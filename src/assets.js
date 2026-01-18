// 静态资源 - 硬编码以避免在 Cloudflare Workers 运行时使用 fs 模块

export const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>软件授权系统</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --glass-bg: rgba(255, 255, 255, 0.95);
            --shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        body {
            min-height: 100vh;
            background: var(--primary-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .auth-container {
            background: var(--glass-bg);
            border-radius: 20px;
            box-shadow: var(--shadow);
            padding: 40px;
            width: 100%;
            max-width: 450px;
            animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .logo {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo i {
            font-size: 4rem;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .logo h1 {
            font-size: 2rem;
            font-weight: 700;
            margin-top: 10px;
            color: #333;
        }

        .form-floating {
            margin-bottom: 20px;
        }

        .form-floating > .form-control {
            border-radius: 12px;
            border: 2px solid #e0e0e0;
            padding: 1rem;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-floating > .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .form-floating > label {
            padding: 1rem;
            color: #999;
        }

        .btn-primary {
            background: var(--primary-gradient);
            border: none;
            border-radius: 12px;
            padding: 14px;
            font-size: 1.1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            width: 100%;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:disabled {
            background: #ccc;
            transform: none;
        }

        .switch-form {
            text-align: center;
            margin-top: 25px;
            color: #666;
        }

        .switch-form a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }

        .switch-form a:hover {
            color: #764ba2;
        }

        .alert {
            border-radius: 12px;
            border: none;
            padding: 15px;
            margin-bottom: 20px;
            animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }

        .spinner-border {
            width: 1.5rem;
            height: 1.5rem;
        }

        .dashboard-container {
            background: var(--glass-bg);
            border-radius: 20px;
            box-shadow: var(--shadow);
            padding: 40px;
            width: 100%;
            max-width: 600px;
            animation: fadeInUp 0.6s ease-out;
        }

        .user-info {
            text-align: center;
            margin-bottom: 30px;
        }

        .user-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: var(--primary-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 3rem;
            color: white;
        }

        .info-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
        }

        .info-label {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 5px;
        }

        .info-value {
            color: #333;
            font-weight: 600;
            font-size: 1.1rem;
        }

        .btn-logout {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border: none;
            border-radius: 12px;
            padding: 14px;
            font-size: 1.1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            width: 100%;
            color: white;
        }

        .btn-logout:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(245, 87, 108, 0.3);
            color: white;
        }

        .code-verification {
            margin-top: 15px;
            padding: 15px;
            background: #e3f2fd;
            border-radius: 12px;
            border-left: 4px solid #2196F3;
        }

        .code-status {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }

        .status-valid {
            color: #4CAF50;
        }

        .status-invalid {
            color: #f44336;
        }

        .input-group {
            margin-bottom: 15px;
        }

        .input-group .form-control {
            border-radius: 12px 0 0 12px;
            border: 2px solid #e0e0e0;
            padding: 14px;
            font-size: 1rem;
        }

        .input-group .btn {
            border-radius: 0 12px 12px 0;
            padding: 14px 20px;
        }
    </style>
</head>
<body>
    <div id="app"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/app.js"></script>
</body>
</html>`;

export const adminHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>软件授权管理 - 管理员面板</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --glass-bg: rgba(255, 255, 255, 0.95);
            --shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        body {
            min-height: 100vh;
            background: var(--primary-gradient);
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .admin-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: var(--glass-bg);
            border-radius: 20px;
            box-shadow: var(--shadow);
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
        }

        .header h1 {
            color: #333;
            font-weight: 700;
        }

        .card {
            background: var(--glass-bg);
            border-radius: 20px;
            box-shadow: var(--shadow);
            border: none;
            margin-bottom: 20px;
        }

        .card-header {
            background: transparent;
            border-bottom: 2px solid #f0f0f0;
            padding: 20px;
            font-weight: 600;
            color: #333;
        }

        .card-body {
            padding: 25px;
        }

        .form-control {
            border-radius: 12px;
            border: 2px solid #e0e0e0;
            padding: 12px;
            transition: all 0.3s ease;
        }

        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .btn-primary {
            background: var(--primary-gradient);
            border: none;
            border-radius: 12px;
            padding: 12px 30px;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .table {
            border-radius: 12px;
            overflow: hidden;
        }

        .table thead {
            background: var(--primary-gradient);
            color: white;
        }

        .table th {
            border: none;
            padding: 15px;
            font-weight: 600;
        }

        .table td {
            padding: 15px;
            vertical-align: middle;
        }

        .badge {
            padding: 8px 12px;
            border-radius: 8px;
            font-weight: 600;
        }

        .badge-success {
            background: #d4edda;
            color: #155724;
        }

        .badge-warning {
            background: #fff3cd;
            color: #856404;
        }

        .badge-danger {
            background: #f8d7da;
            color: #721c24;
        }

        .code-display {
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            font-weight: 700;
            letter-spacing: 2px;
            background: #f8f9fa;
            padding: 10px 15px;
            border-radius: 8px;
            display: inline-block;
        }

        .stats-card {
            text-align: center;
            padding: 20px;
        }

        .stats-number {
            font-size: 2.5rem;
            font-weight: 700;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .stats-label {
            color: #666;
            margin-top: 5px;
        }

        .alert {
            border-radius: 12px;
            border: none;
            padding: 15px;
        }

        .spinner-border {
            width: 1.5rem;
            height: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="header">
            <h1><i class="bi bi-shield-key me-2"></i>软件授权管理系统</h1>
            <p class="text-muted">生成和管理软件授权码</p>
        </div>

        <div class="row mb-4">
            <div class="col-md-4">
                <div class="card stats-card">
                    <div class="stats-number" id="totalCodes">0</div>
                    <div class="stats-label">总授权数</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card stats-card">
                    <div class="stats-number" id="activeCodes">0</div>
                    <div class="stats-label">有效授权</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card stats-card">
                    <div class="stats-number" id="totalUsers">0</div>
                    <div class="stats-label">已激活设备</div>
                </div>
            </div>
        </div>

        <div class="card">
                    <div class="card-header">
                        <i class="bi bi-plus-circle me-2"></i>生成新授权码
                    </div>
                    <div class="card-body">
                        <form id="generateCodeForm">
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label for="softwareName" class="form-label">软件名称</label>
                                    <input type="text" class="form-control" id="softwareName" placeholder="例如：MyApp-Pro" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="maxDevices" class="form-label">最大设备数</label>
                                    <input type="number" class="form-control" id="maxDevices" value="1" min="1" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="expiresAt" class="form-label">过期时间（可选）</label>
                                    <input type="datetime-local" class="form-control" id="expiresAt">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-magic me-2"></i>生成授权码
                            </button>
         </form>
                    </div>
                </div>
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-list-ul me-2"></i>授权列表</span>
                <button class="btn btn-sm btn-outline-primary" onclick="loadCodes()">
                    <i class="bi bi-arrow-clockwise me-1"></i>刷新
                </button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>软件 / 授权码</th>
                                <th>使用情况</th>
                                <th>状态</th>
                                <th>过期时间</th>
                                <th>创建时间</th>
                            </tr>
                        </thead>
                        <tbody id="codesTableBody">
                            <tr>
                                <td colspan="5" class="text-center text-muted">
                                    <i class="bi bi-hourglass-split me-2"></i>加载中...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/admin.js"></script>
</body>
</html>`;

export const appJs = `class AuthApp {
    constructor() {
        this.container = document.getElementById('app');
        this.token = localStorage.getItem('token');
        this.sessionId = localStorage.getItem('sessionId');
        this.init();
    }

    init() {
        if (this.token && this.sessionId) {
            this.verifyToken();
        } else {
            this.renderLogin();
        }
    }

    async verifyToken() {
        try {
            const response = await fetch('/api/verify', {
                method: 'GET',
                headers: {
                    'Authorization': \`Bearer \${this.token}\`,
                    'X-Session-ID': this.sessionId
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderDashboard(data.user);
            } else {
                this.clearAuth();
                this.renderLogin();
            }
        } catch (error) {
            console.error('验证令牌失败:', error);
            this.clearAuth();
            this.renderLogin();
        }
    }

    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('sessionId');
        this.token = null;
        this.sessionId = null;
    }

    showAlert(message, type = 'danger') {
        const alertHtml = \`
            <div class="alert alert-\${type} alert-dismissible fade show" role="alert">
                \${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        \`;
        return alertHtml;
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const softwareName = document.getElementById('loginSoftwareName').value.trim();
        const licenseKey = document.getElementById('loginLicenseKey').value.trim().toUpperCase();
        const submitBtn = event.target.querySelector('button[type="submit"]');

        if (!username || !password || !softwareName || !licenseKey) {
            this.container.innerHTML = this.showAlert('请填写所有字段') + this.getLoginForm();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>登录中...';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, softwareName, licenseKey })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('sessionId', data.sessionId);
                this.token = data.token;
                this.sessionId = data.sessionId;
                this.renderDashboard(data.user);
            } else {
                this.container.innerHTML = this.showAlert(data.error || '登录失败') + this.getLoginForm();
            }
        } catch (error) {
            console.error('登录错误:', error);
            this.container.innerHTML = this.showAlert('网络错误，请稍后重试') + this.getLoginForm();
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const softwareName = document.getElementById('regSoftwareName').value.trim();
        const licenseKey = document.getElementById('regLicenseKey').value.trim().toUpperCase();
        const submitBtn = event.target.querySelector('button[type="submit"]');

        if (!username || !email || !password || !softwareName || !licenseKey) {
            this.container.innerHTML = this.showAlert('请填写所有字段') + this.getRegisterForm();
            return;
        }

        if (password !== confirmPassword) {
            this.container.innerHTML = this.showAlert('两次密码输入不一致') + this.getRegisterForm();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>注册中...';

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, softwareName, licenseKey })
            });

            const data = await response.json();

            if (response.ok) {
                this.container.innerHTML = this.showAlert(data.message, 'success') + this.getLoginForm();
            } else {
                this.container.innerHTML = this.showAlert(data.error || '注册失败') + this.getRegisterForm();
            }
        } catch (error) {
            console.error('注册错误:', error);
            this.container.innerHTML = this.showAlert('网络错误，请稍后重试') + this.getRegisterForm();
        }
    }

    async handleLogout() {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': \`Bearer \${this.token}\`,
                    'X-Session-ID': this.sessionId
                }
            });
        } catch (error) {
            console.error('登出错误:', error);
        }

        this.clearAuth();
        this.renderLogin();
    }

    async validateCode(softwareName, licenseKey) {
        if (!softwareName || !licenseKey) {
            this.showCodeStatus('', false);
            return;
        }

        try {
            const response = await fetch('/api/codes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ softwareName, licenseKey })
            });

            const data = await response.json();
            this.showCodeStatus(data.message, data.valid, data.remainingDevices, data.expiresAt);
        } catch (error) {
            console.error('验证授权码错误:', error);
            this.showCodeStatus('验证失败', false);
        }
    }

    showCodeStatus(message, isValid, remainingDevices = 0, expiresAt = null) {
        const statusDiv = document.getElementById('codeStatus');
        if (!statusDiv) return;

        const icon = isValid ? '<i class="bi bi-check-circle-fill"></i>' : '<i class="bi bi-x-circle-fill"></i>';
        const statusClass = isValid ? 'status-valid' : 'status-invalid';
        
        let extraInfo = '';
        if (isValid) {
            extraInfo = \`<span class="badge bg-primary ms-2">剩余 \${remainingDevices} 设备</span>\`;
            if (expiresAt) {
                const expiryDate = new Date(expiresAt).toLocaleDateString('zh-CN');
                extraInfo += \`<span class="badge bg-success ms-2">有效期至 \${expiryDate}</span>\`;
            }
        }
        
        statusDiv.innerHTML = \`
            <div class="code-status \${statusClass}">
                \${icon}
                <span>\${message}</span>
                \${extraInfo}
            </div>
        \`;
    }

    renderLogin() {
        this.container.innerHTML = this.getLoginForm();
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    }

    renderRegister() {
        this.container.innerHTML = this.getRegisterForm();
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        
        const softwareNameInput = document.getElementById('regSoftwareName');
        const licenseKeyInput = document.getElementById('regLicenseKey');
        let debounceTimer;
        
        const validateHandler = () => {
            clearTimeout(debounceTimer);
            const softwareName = softwareNameInput.value.trim();
            const licenseKey = licenseKeyInput.value.toUpperCase();
            licenseKeyInput.value = licenseKey;
            
            debounceTimer = setTimeout(() => {
                this.validateCode(softwareName, licenseKey);
            }, 500);
        };
        
        softwareNameInput.addEventListener('input', validateHandler);
        licenseKeyInput.addEventListener('input', validateHandler);
    }

    renderDashboard(user) {
        const licenseExpiry = user.licenseExpires ? new Date(user.licenseExpires).toLocaleDateString('zh-CN') : '永久有效';
        
        this.container.innerHTML = \`
            <div class="dashboard-container">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    <h2>欢迎, \${user.username}!</h2>
                    <p class="text-muted">您已成功登录</p>
                </div>

                <div class="info-card">
                    <div class="info-label"><i class="bi bi-person me-2"></i>用户名</div>
                    <div class="info-value">\${user.username}</div>
                </div>

                <div class="info-card">
                    <div class="info-label"><i class="bi bi-envelope me-2"></i>邮箱</div>
                    <div class="info-value">\${user.email}</div>
                </div>

                <div class="info-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <div class="info-label" style="color: rgba(255,255,255,0.8);"><i class="bi bi-box-seam me-2"></i>软件名称</div>
                    <div class="info-value" style="color: white;">\${user.softwareName}</div>
                </div>

                <div class="info-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white;">
                    <div class="info-label" style="color: rgba(255,255,255,0.8);"><i class="bi bi-key me-2"></i>授权码</div>
                    <div class="info-value" style="color: white; font-family: 'Courier New', monospace;">\${user.licenseKey}</div>
                </div>

                <div class="info-card">
                    <div class="info-label"><i class="bi bi-calendar-check me-2"></i>授权有效期</div>
                    <div class="info-value">\${licenseExpiry}</div>
                </div>

                <div class="info-card">
                    <div class="info-label"><i class="bi bi-clock-history me-2"></i>注册时间</div>
                    <div class="info-value">\${new Date(user.created_at).toLocaleDateString('zh-CN')}</div>
                </div>

                <button class="btn btn-logout" onclick="app.handleLogout()">
                    <i class="bi bi-box-arrow-right me-2"></i>退出登录
                </button>
            </div>
        \`;
    }

    getLoginForm() {
        return \`
            <div class="auth-container">
                <div class="logo">
                    <i class="bi bi-shield-lock-fill"></i>
                    <h1>软件授权登录</h1>
                </div>
                <form id="loginForm">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="loginUsername" placeholder="用户名" required>
                        <label for="loginUsername"><i class="bi bi-person me-2"></i>用户名</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" id="loginPassword" placeholder="密码" required>
                        <label for="loginPassword"><i class="bi bi-lock me-2"></i>密码</label>
                    </div>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="loginSoftwareName" placeholder="软件名称" required>
                        <label for="loginSoftwareName"><i class="bi bi-box-seam me-2"></i>软件名称</label>
                    </div>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="loginLicenseKey" placeholder="授权码" required maxlength="12">
                        <label for="loginLicenseKey"><i class="bi bi-key me-2"></i>授权码</label>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-box-arrow-in-right me-2"></i>登录
                    </button>
                </form>
                <div class="switch-form">
                    还没有账号？<a href="#" onclick="app.renderRegister()">立即注册</a>
                </div>
            </div>
        \`;
    }

    getRegisterForm() {
        return \`
            <div class="auth-container">
                <div class="logo">
                    <i class="bi bi-person-plus-fill"></i>
                    <h1>创建账号</h1>
                </div>
                <form id="registerForm">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="regUsername" placeholder="用户名" required>
                        <label for="regUsername"><i class="bi bi-person me-2"></i>用户名</label>
                    </div>
                    <div class="form-floating">
                        <input type="email" class="form-control" id="regEmail" placeholder="邮箱" required>
                        <label for="regEmail"><i class="bi bi-envelope me-2"></i>邮箱</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" id="regPassword" placeholder="密码" required>
                        <label for="regPassword"><i class="bi bi-lock me-2"></i>密码</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" id="regConfirmPassword" placeholder="确认密码" required>
                        <label for="regConfirmPassword"><i class="bi bi-lock-fill me-2"></i>确认密码</label>
                    </div>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="regSoftwareName" placeholder="软件名称" required>
                        <label for="regSoftwareName"><i class="bi bi-box-seam me-2"></i>软件名称</label>
                    </div>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="regLicenseKey" placeholder="授权码" required maxlength="12">
                        <label for="regLicenseKey"><i class="bi bi-key me-2"></i>授权码</label>
                    </div>
                    <div id="codeStatus" class="code-verification" style="display: none;">
                        <div class="code-status">
                            <i class="bi bi-info-circle"></i>
                            <span>请输入软件名称和授权码</span>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-person-check me-2"></i>注册
                    </button>
                </form>
                <div class="switch-form">
                    已有账号？<a href="#" onclick="app.renderLogin()">立即登录</a>
                </div>
            </div>
        \`;
    }
}

const app = new AuthApp();`;

export const adminJs = `const ADMIN_KEY = 'your-admin-key-for-generating-codes';

class AdminPanel {
    constructor() {
        this.init();
    }

    init() {
        document.getElementById('generateCodeForm').addEventListener('submit', (e) => this.handleGenerateCode(e));
        this.loadCodes();
        this.loadStats();
    }

    async handleGenerateCode(event) {
        event.preventDefault();
        
        const softwareName = document.getElementById('softwareName').value.trim();
        const maxDevices = parseInt(document.getElementById('maxDevices').value);
        const expiresAt = document.getElementById('expiresAt').value;
        const submitBtn = event.target.querySelector('button[type="submit"]');

        if (!softwareName) {
            this.showAlert('请输入软件名称', 'danger');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>生成中...';

        try {
            const response = await fetch('/api/codes/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Key': ADMIN_KEY
                },
                body: JSON.stringify({
                    softwareName,
                    maxDevices,
                    expiresAt: expiresAt || null
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.showAlert(\`授权码生成成功！<br><strong class="code-display">\${data.licenseKey}</strong><br>软件: \${data.softwareName}\`, 'success');
                document.getElementById('generateCodeForm').reset();
                this.loadCodes();
                this.loadStats();
            } else {
                this.showAlert(data.error || '生成失败', 'danger');
            }
        } catch (error) {
            console.error('生成授权码错误:', error);
            this.showAlert('网络错误，请稍后重试', 'danger');
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-magic me-2"></i>生成授权码';
    }

    async loadCodes() {
        try {
            const response = await fetch('/api/codes/list', {
                method: 'GET',
                headers: {
                    'X-Admin-Key': ADMIN_KEY
                }
            });

            const data = await response.json();

            if (response.ok) {
                this.renderCodesTable(data.licenses);
            } else {
                this.showAlert(data.error || '加载失败', 'danger');
            }
        } catch (error) {
            console.error('加载授权列表错误:', error);
            this.showAlert('网络错误，请稍后重试', 'danger');
        }
    }

    async loadStats() {
        try {
            const response = await fetch('/api/codes/list', {
                method: 'GET',
                headers: {
                    'X-Admin-Key': ADMIN_KEY
                }
            });

            const data = await response.json();

            if (response.ok) {
                const licenses = data.licenses;
                const totalLicenses = licenses.length;
                const activeLicenses = licenses.filter(l => l.is_active && l.used_devices < l.max_devices).length;
                const totalDevices = licenses.reduce((sum, l) => sum + l.used_devices, 0);

                document.getElementById('totalCodes').textContent = totalLicenses;
                document.getElementById('activeCodes').textContent = activeLicenses;
                document.getElementById('totalUsers').textContent = totalDevices;
            }
        } catch (error) {
            console.error('加载统计信息错误:', error);
        }
    }

    renderCodesTable(licenses) {
        const tbody = document.getElementById('codesTableBody');

        if (licenses.length === 0) {
            tbody.innerHTML = \`
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        <i class="bi bi-inbox me-2"></i>暂无授权
                    </td>
                </tr>
            \`;
            return;
        }

        tbody.innerHTML = licenses.map(license => {
            const statusBadge = this.getStatusBadge(license);
            const createdAt = new Date(license.created_at).toLocaleString('zh-CN');
            const expiresAt = license.expires_at ? new Date(license.expires_at).toLocaleString('zh-CN') : '永不过期';
            const usageText = \`\${license.used_devices} / \${license.max_devices}\`;

            return \`
                <tr>
                    <td>
                        <div><strong>\${license.software_name}</strong></div>
                        <div class="code-display mt-1">\${license.license_key}</div>
                    </td>
                    <td>\${usageText}</td>
                    <td>\${statusBadge}</td>
                    <td>\${expiresAt}</td>
                    <td>\${createdAt}</td>
                </tr>
            \`;
        }).join('');
    }

    getStatusBadge(license) {
        if (!license.is_active) {
            return '<span class="badge badge-danger">已禁用</span>';
        }

        if (license.used_devices >= license.max_devices) {
            return '<span class="badge badge-warning">已用完</span>';
        }

        if (license.expires_at && new Date(license.expires_at) < new Date()) {
            return '<span class="badge badge-danger">已过期</span>';
        }

        return '<span class="badge badge-success">有效</span>';
    }

    showAlert(message, type = 'danger') {
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertHtml = \`
            <div class="alert alert-\${type} alert-dismissible fade show" role="alert">
                \${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        \`;

        const container = document.querySelector('.admin-container');
        container.insertAdjacentHTML('afterbegin', alertHtml);

        setTimeout(() => {
            const alert = document.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 5000);
    }
}

function loadCodes() {
    adminPanel.loadCodes();
    adminPanel.loadStats();
}

const adminPanel = new AdminPanel();

export const ASSETS = {
  index: indexHtml,
  admin: adminHtml,
  appJs: appJs,
  adminJs: adminJs
};