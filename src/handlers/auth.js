import { hashPassword, verifyPassword, generateToken, verifyToken } from '../utils/auth.js';
import { validateEmail, validateUsername, validatePassword, validateRegistrationCode, sanitizeInput } from '../utils/validators.js';

export async function handleRegister(request, env) {
  try {
    const { username, email, password, softwareName, licenseKey } = await request.json();

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSoftwareName = sanitizeInput(softwareName);
    const sanitizedLicenseKey = sanitizeInput(licenseKey);

    if (!validateUsername(sanitizedUsername)) {
      return Response.json({ error: '用户名必须是3-20个字符，只能包含字母、数字和下划线' }, { status: 400 });
    }

    if (!validateEmail(sanitizedEmail)) {
      return Response.json({ error: '邮箱格式不正确' }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return Response.json({ error: '密码至少需要6个字符' }, { status: 400 });
    }

    if (!sanitizedSoftwareName || !sanitizedLicenseKey) {
      return Response.json({ error: '软件名称和注册码不能为空' }, { status: 400 });
    }

    const licenseStmt = env.DB.prepare('SELECT * FROM software_licenses WHERE software_name = ? AND license_key = ? AND is_active = 1');
    const licenseResult = await licenseStmt.bind(sanitizedSoftwareName, sanitizedLicenseKey).first();

    if (!licenseResult) {
      return Response.json({ error: '软件授权无效或已失效' }, { status: 400 });
    }

    if (licenseResult.used_devices >= licenseResult.max_devices) {
      return Response.json({ error: '该授权已达到最大设备数限制' }, { status: 400 });
    }

    if (licenseResult.expires_at && new Date(licenseResult.expires_at) < new Date()) {
      return Response.json({ error: '软件授权已过期' }, { status: 400 });
    }

    const existingUserStmt = env.DB.prepare('SELECT * FROM users WHERE username = ? OR email = ?');
    const existingUser = await existingUserStmt.bind(sanitizedUsername, sanitizedEmail).first();

    if (existingUser) {
      if (existingUser.username === sanitizedUsername) {
        return Response.json({ error: '用户名已存在' }, { status: 400 });
      }
      if (existingUser.email === sanitizedEmail) {
        return Response.json({ error: '邮箱已被注册' }, { status: 400 });
      }
    }

    const passwordHash = await hashPassword(password);

    const insertStmt = env.DB.prepare(`
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `);
    await insertStmt.bind(sanitizedUsername, sanitizedEmail, passwordHash).run();

    const updateLicenseStmt = env.DB.prepare(`
      UPDATE software_licenses
      SET used_devices = used_devices + 1
      WHERE software_name = ? AND license_key = ?
    `);
    await updateLicenseStmt.bind(sanitizedSoftwareName, sanitizedLicenseKey).run();

    return Response.json({ 
      success: true, 
      message: '注册成功，请登录',
      software: sanitizedSoftwareName
    });

  } catch (error) {
    console.error('注册错误:', error);
    return Response.json({ error: '注册失败，请稍后重试' }, { status: 500 });
  }
}

export async function handleLogin(request, env) {
  try {
    const { username, password, softwareName, licenseKey } = await request.json();

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedSoftwareName = sanitizeInput(softwareName);
    const sanitizedLicenseKey = sanitizeInput(licenseKey);

    if (!sanitizedUsername || !password) {
      return Response.json({ error: '用户名和密码不能为空' }, { status: 400 });
    }

    if (!sanitizedSoftwareName || !sanitizedLicenseKey) {
      return Response.json({ error: '软件名称和注册码不能为空' }, { status: 400 });
    }

    const licenseStmt = env.DB.prepare('SELECT * FROM software_licenses WHERE software_name = ? AND license_key = ? AND is_active = 1');
    const licenseResult = await licenseStmt.bind(sanitizedSoftwareName, sanitizedLicenseKey).first();

    if (!licenseResult) {
      return Response.json({ error: '软件授权无效' }, { status: 401 });
    }

    if (licenseResult.expires_at && new Date(licenseResult.expires_at) < new Date()) {
      return Response.json({ error: '软件授权已过期' }, { status: 401 });
    }

    const stmt = env.DB.prepare('SELECT * FROM users WHERE username = ? AND is_active = 1');
    const user = await stmt.bind(sanitizedUsername).first();

    if (!user) {
      return Response.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return Response.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    const token = generateToken(user.id, user.username, env.JWT_SECRET);

    const sessionId = crypto.randomUUID();
    const sessionData = {
      userId: user.id,
      username: user.username,
      softwareName: sanitizedSoftwareName,
      licenseKey: sanitizedLicenseKey,
      createdAt: new Date().toISOString()
    };

    await env.SESSIONS.put(sessionId, JSON.stringify(sessionData), {
      expirationTtl: 604800
    });

    return Response.json({
      success: true,
      token,
      sessionId,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        softwareName: sanitizedSoftwareName,
        licenseKey: sanitizedLicenseKey,
        licenseExpires: licenseResult.expires_at
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    return Response.json({ error: '登录失败，请稍后重试' }, { status: 500 });
  }
}

export async function handleVerify(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: '未提供认证令牌' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token, env.JWT_SECRET);

    if (!decoded) {
      return Response.json({ error: '无效的认证令牌' }, { status: 401 });
    }

    const sessionId = request.headers.get('X-Session-ID');
    if (!sessionId) {
      return Response.json({ error: '会话无效' }, { status: 401 });
    }

    const sessionData = await env.SESSIONS.get(sessionId);
    if (!sessionData) {
      return Response.json({ error: '会话已过期' }, { status: 401 });
    }

    const session = JSON.parse(sessionData);
    if (session.userId !== decoded.userId) {
      return Response.json({ error: '会话不匹配' }, { status: 401 });
    }

    const stmt = env.DB.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?');
    const user = await stmt.bind(decoded.userId).first();

    if (!user) {
      return Response.json({ error: '用户不存在' }, { status: 404 });
    }

    return Response.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('验证错误:', error);
    return Response.json({ error: '验证失败' }, { status: 500 });
  }
}

export async function handleLogout(request, env) {
  try {
    const sessionId = request.headers.get('X-Session-ID');
    
    if (sessionId) {
      await env.SESSIONS.delete(sessionId);
    }

    return Response.json({
      success: true,
      message: '登出成功'
    });

  } catch (error) {
    console.error('登出错误:', error);
    return Response.json({ error: '登出失败' }, { status: 500 });
  }
}