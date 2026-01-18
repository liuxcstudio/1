-- 软件授权表
CREATE TABLE IF NOT EXISTS software_licenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  software_name TEXT NOT NULL,
  license_key TEXT NOT NULL,
  max_devices INTEGER DEFAULT 1,
  used_devices INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(software_name, license_key)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_licenses_software_key ON software_licenses(software_name, license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_active ON software_licenses(is_active);

-- 插入测试软件授权
INSERT INTO software_licenses (software_name, license_key, max_devices, expires_at) VALUES
('MyApp-Pro', 'PRO-2024-XXXX-YYYY', 5, '2025-12-31'),
('MyApp-Enterprise', 'ENT-2024-AAAA-BBBB', 10, '2025-12-31'),
('MyApp-Basic', 'BAS-2024-1111-2222', 1, '2024-12-31');