-- Insert mock users into auth.users to satisfy foreign key constraints
INSERT INTO auth.users (id, email)
VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'admin@thepower.education'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d02', 'marta@inditex.com'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d03', 'student@thepower.edu'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d04', 'ana@santander.com'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d05', 'carlos@santander.com')
ON CONFLICT (id) DO NOTHING;
