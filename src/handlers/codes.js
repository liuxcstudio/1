import { generateRegistrationCode } from '../utils/auth.js';

export async function handleGenerateCode(request, env) {
  try {
    const adminKey = request.headers.get('X-Admin-Key');
    
    if (adminKey !== env.ADMIN_KEY) {
      return Response.json({ error: '未授权' }, { status: 401 });
    }

    const { softwareName, maxDevices = 1, expiresAt = null } = await request.json();

    if (!softwareName) {
      return Response.json({ error: '软件名称不能为空' }, { status: 400 });
    }

    const licenseKey = generateRegistrationCode();

    const stmt = env.DB.prepare(`
      INSERT INTO software_licenses (software_name, license_key, max_devices, is_active, expires_at)
      VALUES (?, ?, ?, 1, ?)
    `);
    
    await stmt.bind(softwareName, licenseKey, maxDevices, expiresAt).run();

    return Response.json({
      success: true,
      softwareName,
      licenseKey,
      maxDevices,
      expiresAt
    });

  } catch (error) {
    console.error('生成授权码错误:', error);
    return Response.json({ error: '生成授权码失败' }, { status: 500 });
  }
}

export async function handleListCodes(request, env) {
  try {
    const adminKey = request.headers.get('X-Admin-Key');
    
    if (adminKey !== env.ADMIN_KEY) {
      return Response.json({ error: '未授权' }, { status: 401 });
    }

    const stmt = env.DB.prepare(`
      SELECT software_name, license_key, max_devices, used_devices, is_active, expires_at, created_at
      FROM software_licenses
      ORDER BY created_at DESC
    `);
    
    const { results } = await stmt.all();

    return Response.json({
      success: true,
      licenses: results
    });

  } catch (error) {
    console.error('获取授权列表错误:', error);
    return Response.json({ error: '获取授权列表失败' }, { status: 500 });
  }
}

export async function handleValidateCode(request, env) {
  try {
    const { softwareName, licenseKey } = await request.json();

    if (!softwareName || !licenseKey) {
      return Response.json({ error: '软件名称和授权码不能为空' }, { status: 400 });
    }

    const stmt = env.DB.prepare('SELECT * FROM software_licenses WHERE software_name = ? AND license_key = ? AND is_active = 1');
    const licenseResult = await stmt.bind(softwareName, licenseKey).first();

    if (!licenseResult) {
      return Response.json({ 
        valid: false,
        message: '软件授权无效或已失效' 
      });
    }

    if (licenseResult.used_devices >= licenseResult.max_devices) {
      return Response.json({ 
        valid: false,
        message: '该授权已达到最大设备数限制' 
      });
    }

    if (licenseResult.expires_at && new Date(licenseResult.expires_at) < new Date()) {
      return Response.json({ 
        valid: false,
        message: '软件授权已过期' 
      });
    }

    return Response.json({
      valid: true,
      message: '软件授权有效',
      softwareName: licenseResult.software_name,
      remainingDevices: licenseResult.max_devices - licenseResult.used_devices,
      expiresAt: licenseResult.expires_at
    });

  } catch (error) {
    console.error('验证授权码错误:', error);
    return Response.json({ error: '验证授权码失败' }, { status: 500 });
  }
}