class AuthApp {
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
                    'Authorization': `Bearer ${this.token}`,
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
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
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
                    'Authorization': `Bearer ${this.token}`,
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
            extraInfo = `<span class="badge bg-primary ms-2">剩余 ${remainingDevices} 设备</span>`;
            if (expiresAt) {
                const expiryDate = new Date(expiresAt).toLocaleDateString('zh-CN');
                extraInfo += `<span class="badge bg-success ms-2">有效期至 ${expiryDate}</span>`;
            }
        }
        
        statusDiv.innerHTML = `
            <div class="code-status ${statusClass}">
                ${icon}
                <span>${message}</span>
                ${extraInfo}
            </div>
        `;
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
        
        this.container.innerHTML = `
            <div class="dashboard-container">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    <h2>欢迎, ${user.username}!</h2>
                    <p class="text-muted">您已成功登录</p>
                </div>

                <div class="info-card">
                    <div class="info-label"><i class="bi bi-person me-2"></i>用户名</div>
                    <div class="info-value">${user.username}</div>
                </div>

                <div class="info-card">
                    <div class="info-label"><i class="bi bi-envelope me-2"></i>邮箱</div>
                    <div class="info-value">${user.email}</div>
                </div>

                <div class="info-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <div class="info-label" style="color: rgba(255,255,255,0.8);"><i class="bi bi-box-seam me-2"></i>软件名称</div>
                    <div class="info-value" style="color: white;">${user.softwareName}</div>
                </div>

                <div class="info-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white;">
                    <div class="info-label" style="color: rgba(255,255,255,0.8);"><i class="bi bi-key me-2"></i>授权码</div>
                    <div class="info-value" style="color: white; font-family: 'Courier New', monospace;">${user.licenseKey}</div>
                </div>

                <div class="info-card">
                    <div class="info-label"><i class="bi bi-calendar-check me-2"></i>授权有效期</div>
                    <div class="info-value">${licenseExpiry}</div>
                </div>

                <div class="info-card">
                    <div class="info-label"><i class="bi bi-clock-history me-2"></i>注册时间</div>
                    <div class="info-value">${new Date(user.created_at).toLocaleDateString('zh-CN')}</div>
                </div>

                <button class="btn btn-logout" onclick="app.handleLogout()">
                    <i class="bi bi-box-arrow-right me-2"></i>退出登录
                </button>
            </div>
        `;
    }

    getLoginForm() {
        return `
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
        `;
    }

    getRegisterForm() {
        return `
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
        `;
    }
}

const app = new AuthApp();