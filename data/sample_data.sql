INSERT INTO users (name, email, role) VALUES
('Anitha', 'anitha@campus.edu', 'ADMIN'),
('Ravi', 'ravi@campus.edu', 'USER'),
('Priya', 'priya@campus.edu', 'USER'),
('Karthik', 'karthik@campus.edu', 'USER'),
('Divya', 'divya@campus.edu', 'USER');

INSERT INTO technicians (name, specialty, active) VALUES
('Arun', 'Electrical', TRUE),
('Bala', 'Plumbing', TRUE),
('Chitra', 'Electrical', TRUE),
('Dinesh', 'Carpentry', TRUE),
('Eswari', 'Air Conditioning', TRUE),
('Farook', 'Plumbing', TRUE),
('Gowri', 'IT Network', TRUE),
('Hari', 'Carpentry', TRUE),
('Indira', 'Cleaning', TRUE),
('Jegan', 'Electrical', FALSE);

WITH base AS (
    SELECT g,
           (ARRAY['LOW','MEDIUM','HIGH'])[1 + g % 3] AS priority,
           (ARRAY['OPEN','IN_PROGRESS','RESOLVED'])[1 + (g / 3) % 3] AS status,
           NOW() - (g || ' days')::interval AS created_at
    FROM generate_series(1, 50) AS g
)
INSERT INTO requests
    (title, description, priority, status, created_by, assigned_to,
     created_at, due_at, resolved_at)
SELECT
    'Maintenance issue #' || g,
    'Sample request number ' || g,
    priority,
    status,
    1 + g % 5,
    CASE WHEN status = 'OPEN' THEN NULL ELSE 1 + g % 9 END,
    created_at,
    created_at + CASE priority
        WHEN 'HIGH' THEN interval '1 day'
        WHEN 'MEDIUM' THEN interval '3 days'
        ELSE interval '7 days' END,
    CASE WHEN status = 'RESOLVED'
         THEN created_at + interval '2 days' END
FROM base;