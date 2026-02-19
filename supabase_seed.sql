-- Semilla de datos extendida para ThePower LMS
-- Limpieza (opcional)
TRUNCATE public.enrollments, public.subscriptions, public.modules, public.courses, public.users, public.clients CASCADE;

-- 1. Clientes (Empresas)
INSERT INTO public.clients (id, name, slug, domain, industry, contact_email, branding)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ThePower Education', 'thepower', 'thepower.education', 'Education', 'hello@thepower.education', '{"colors": {"primary": "#1e3740", "secondary": "#a1e6c5"}}'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Inditex', 'inditex', 'inditex.com', 'Fashion', 'hr@inditex.com', '{"colors": {"primary": "#000000", "secondary": "#ffffff"}}'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Santander', 'santander', 'santander.com', 'Banking', 'formacion@santander.com', '{"colors": {"primary": "#ec0000", "secondary": "#ffffff"}}');

-- 2. Cursos
INSERT INTO public.courses (id, tenant_id, title, description, hours, level, status, family_professional, fundae_compatible)
VALUES
('eb15e6a0-3214-4ab4-95b4-2c832dec2639', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ThePowerMBA Business Strategy', 'Master en estrategia de negocio y gestión empresarial.', 40.0, 'advanced', 'published', 'Business', true),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Digital Marketing Rockstars', 'Especialización en marketing digital y crecimiento.', 30.0, 'intermediate', 'published', 'Marketing', true),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Agile & Scrum Leadership', 'Metodologías ágiles para equipos de alto rendimiento.', 15.0, 'intermediate', 'published', 'Product', false);

-- 3. Módulos
INSERT INTO public.modules (id, course_id, title, type, duration_minutes, order_index, is_mandatory)
VALUES
(uuid_generate_v4(), 'eb15e6a0-3214-4ab4-95b4-2c832dec2639', 'Introducción al Business Strategy', 'video', 15, 1, true),
(uuid_generate_v4(), 'eb15e6a0-3214-4ab4-95b4-2c832dec2639', 'Análisis de Mercado', 'video', 30, 2, true),
(uuid_generate_v4(), 'eb15e6a0-3214-4ab4-95b4-2c832dec2639', 'Estrategias Competitivas', 'quiz', 10, 3, true),
(uuid_generate_v4(), 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', 'SEO Avanzado', 'video', 45, 1, true),
(uuid_generate_v4(), 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', 'Content Marketing Strategy', 'pdf', 20, 2, true);

-- 4. Usuarios (Perfiles en la tabla pública)
-- Nota: Estos IDs deberían idealmente coincidir con auth.users
INSERT INTO public.users (id, client_id, first_name, last_name, role, job_title)
VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin', 'ThePower', 'admin', 'Super Admin'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Marta', 'Ortega', 'manager', 'HR Director'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d03', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Gabriel', 'Rodriguez', 'student', 'Growth Hacker'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d04', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Ana', 'Botín', 'manager', 'Learning Manager'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d05', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Carlos', 'User', 'student', 'Analista');

-- 5. Subscripciones
INSERT INTO public.subscriptions (id, client_id, plan_name, total_seats, users_per_seat, start_date, end_date, status)
VALUES
('50eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Enterprise Diamond', 500, 2, '2025-01-01', '2026-01-01', 'active'),
('50eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Business Plus', 100, 1, '2024-06-01', '2025-06-01', 'active');

-- 6. Enrolments (Inscripciones)
INSERT INTO public.enrollments (user_id, course_id, subscription_id, status, progress_pct)
VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d03', 'eb15e6a0-3214-4ab4-95b4-2c832dec2639', '50eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'in_progress', 45),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d03', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', '50eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'assigned', 0),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d05', 'eb15e6a0-3214-4ab4-95b4-2c832dec2639', '50eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'completed', 100);

-- 7. Gamificación (Estadísticas iniciales)
INSERT INTO public.gamification_stats (user_id, total_xp, current_level, current_streak)
VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d03', 1250, 5, 3),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d05', 5000, 12, 0);

-- 8. Badges (Insignias)
INSERT INTO public.badges (id, name, description, icon_url)
VALUES
(uuid_generate_v4(), 'Top Learner', 'Completó su primer curso al 100%', 'https://cdn-icons-png.flaticon.com/512/6119/6119533.png'),
(uuid_generate_v4(), 'Night Owl', 'Estudió después de las 11 PM', 'https://cdn-icons-png.flaticon.com/512/289/289661.png');
