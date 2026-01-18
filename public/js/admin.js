const ADMIN_KEY = 'your-admin-key-for-generating-codes';

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
                this.showAlert(`授权码生成成功！<br><strong class="code-display">${data.licenseKey}</strong><br>软件: ${data.softwareName}`, 'success');
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
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        <i class="bi bi-inbox me-2"></i>暂无授权
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = licenses.map(license => {
            const statusBadge = this.getStatusBadge(license);
            const createdAt = new Date(license.created_at).toLocaleString('zh-CN');
            const expiresAt = license.expires_at ? new Date(license.expires_at).toLocaleString('zh-CN') : '永不过期';
            const usageText = `${license.used_devices} / ${license.max_devices}`;

            return `
                <tr>
                    <td>
                        <div><strong>${license.software_name}</strong></div>
                        <div class="code-display mt-1">${license.license_key}</div>
                    </td>
                    <td>${usageText}</td>
                    <td>${statusBadge}</td>
                    <td>${expiresAt}</td>
                    <td>${createdAt}</td>
                </tr>
            `;
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

        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

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