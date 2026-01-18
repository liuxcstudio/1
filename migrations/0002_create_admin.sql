-- 插入默认管理员用户
-- 密码: admin123 (请在生产环境中修改)
INSERT INTO users (username, email, password_hash) 
VALUES ('admin', 'admin@example.com', '$2a$10$rOqKJqJqJqJqJqJqJqJqJuY7zK7zK7zK7zK7zK7zK7zK7zK7zK7zK7zK7');

-- 插入一些测试注册码
INSERT INTO registration_codes (code, max_uses, is_active, created_by) VALUES
('WELCOME2024', 100, 1, 'admin'),
('BETA2024', 50, 1, 'admin'),
('VIP2024', 10, 1, 'admin');