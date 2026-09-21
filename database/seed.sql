-- Seed SQL script for pure PostgreSQL / SQLite migrations
INSERT INTO users (id, email, hashed_password, full_name, role) 
VALUES ('usr_doc_01', 'doctor@hospital.in', '$2b$12$e8Y5M3P4aV0Q6l9tX3mZae0w/V9gq/9s7h.YhGqH6O7w5g0X.J4C6', 'Dr. Priya Sharma (Cardiology)', 'doctor')
ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, user_id, patient_id_display, name, age, sex, phone, abha_id, is_existing)
VALUES ('pat_demo_01', 'usr_pat_01', 'PAT-DEMO-001', 'Demo Patient', 58, 'Male', '+91 90000 00001', '91-0000-1111-2222', TRUE)
ON CONFLICT (id) DO NOTHING;
