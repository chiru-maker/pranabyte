-- Seed SQL script for pure PostgreSQL / SQLite migrations
INSERT INTO users (id, email, hashed_password, full_name, role) 
VALUES ('usr_doc_01', 'doctor@hospital.in', '$2b$12$e8Y5M3P4aV0Q6l9tX3mZae0w/V9gq/9s7h.YhGqH6O7w5g0X.J4C6', 'Dr. Priya Sharma (Cardiology)', 'doctor')
ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, user_id, patient_id_display, name, age, sex, phone, abha_id, is_existing)
VALUES ('pat_rahul_01', 'usr_pat_01', 'PAT-2026-0891', 'Rahul Kumar', 58, 'Male', '+91 98765 43210', '91-8273-9912-0041', TRUE)
ON CONFLICT (id) DO NOTHING;
