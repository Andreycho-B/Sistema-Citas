-- Usuarios del sistema de bienestar emocional
INSERT INTO usuario (id, nombre, email, password, telefono, fecha_registro) VALUES
(1, 'Ana García López', 'ana.garcia@bienestar.com', 'ClaveSegura123', '+57 300 123 4567', NOW()),
(2, 'Carlos Méndez Ruiz', 'carlos.mendez@bienestar.com', 'ClaveSegura123', '+57 301 234 5678', NOW()),
(3, 'María Rodríguez Silva', 'maria.rodriguez@bienestar.com', 'ClaveSegura123', '+57 302 345 6789', NOW()),
(4, 'Pedro Hernández Castro', 'pedro.hernandez@bienestar.com', 'ClaveSegura123', '+57 303 456 7890', NOW());

-- Servicios de apoyo emocional y psicológico
INSERT INTO servicio (id, nombre, descripción, duración, precio) VALUES
(1, 'Terapia Individual Presencial', 'Sesión personalizada de terapia psicológica para manejo de ansiedad, estrés y desarrollo personal', '50 minutos', 85000.00),
(2, 'Terapia Individual Virtual', 'Sesión online de acompañamiento psicológico desde la comodidad de tu espacio', '50 minutos', 75000.00),
(3, 'Sesión de Mindfulness Grupal', 'Práctica guiada de atención plena para reducir estrés y mejorar bienestar emocional en grupo', '60 minutos', 35000.00),
(4, 'Taller de Manejo de Ansiedad', 'Espacio grupal para aprender técnicas y herramientas prácticas para manejar la ansiedad', '90 minutos', 50000.00);

-- Profesionales especializados
INSERT INTO profesional (id, especialidad, horario_disponible, usuario_id) VALUES
(1, 'Psicología Clínica - Ansiedad y Estrés', NOW(), 1),
(2, 'Terapia Cognitivo-Conductual - Mindfulness', NOW(), 2),
(3, 'Psicoterapia Humanista - Crecimiento Personal', NOW(), 3);

-- Citas programadas
INSERT INTO cita (id, fecha_hora, estado, usuario_id, servicio_id, profesional_id) VALUES
(1, '2024-01-15 09:00:00', 'CONFIRMADA', 4, 1, 1),
(2, '2024-01-15 10:30:00', 'PENDIENTE', 3, 2, 2),
(3, '2024-01-16 14:00:00', 'CONFIRMADA', 2, 3, 3);S