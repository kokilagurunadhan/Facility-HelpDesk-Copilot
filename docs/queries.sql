Piece 1: count resolved requests per priority
Piece 2: how long one request took


-- Overdue requests
SELECT id, title, priority, status, due_at
FROM requests
WHERE status <> 'RESOLVED'
  AND due_at < NOW()
ORDER BY due_at;

-- Technician workload
SELECT t.name,
       t.specialty,
       COUNT(r.id) AS total_requests,
       COUNT(r.id) FILTER (WHERE r.status = 'IN_PROGRESS') AS in_progress,
       COUNT(r.id) FILTER (WHERE r.status = 'RESOLVED') AS resolved
FROM technicians t
LEFT JOIN requests r ON r.assigned_to = t.id
GROUP BY t.id, t.name, t.specialty
ORDER BY total_requests DESC;

-- Average resolution time by priority
SELECT priority,
       COUNT(*) AS resolved_count,
       ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600), 1) AS avg_hours
FROM requests
WHERE status = 'RESOLVED'
GROUP BY priority;