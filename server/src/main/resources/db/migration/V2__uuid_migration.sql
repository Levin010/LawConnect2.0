-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==================
-- DROP ALL FOREIGN KEY CONSTRAINTS FIRST
-- ==================
ALTER TABLE advocate_profiles DROP CONSTRAINT IF EXISTS fkla48oioyilx15o0hbvkhpv1hj;
ALTER TABLE client_profiles DROP CONSTRAINT IF EXISTS fkkixowj3qccjpmb5lqalaqdkx;
ALTER TABLE representation_requests DROP CONSTRAINT IF EXISTS fkp6utp1mtpcw5g3723ata5ayky;
ALTER TABLE representation_requests DROP CONSTRAINT IF EXISTS fkkvhvapu8ciscyxnbxy3f793py;
ALTER TABLE legal_cases DROP CONSTRAINT IF EXISTS fkcfexysanophmty3roii7qwbay;
ALTER TABLE legal_cases DROP CONSTRAINT IF EXISTS fk8gq0j8f4hyka70qb86of6lyl8;

-- ==================
-- USERS TABLE
-- ==================
ALTER TABLE users ADD COLUMN new_id VARCHAR(255);
UPDATE users SET new_id = gen_random_uuid()::text;

-- Update foreign keys in child tables
ALTER TABLE advocate_profiles ADD COLUMN new_user_id VARCHAR(255);
UPDATE advocate_profiles ap
SET new_user_id = u.new_id
    FROM users u
WHERE u.id = ap.user_id;

ALTER TABLE client_profiles ADD COLUMN new_user_id VARCHAR(255);
UPDATE client_profiles cp
SET new_user_id = u.new_id
    FROM users u
WHERE u.id = cp.user_id;

ALTER TABLE representation_requests ADD COLUMN new_client_id VARCHAR(255);
UPDATE representation_requests rr
SET new_client_id = u.new_id
    FROM users u
WHERE u.id = rr.client_id;

ALTER TABLE representation_requests ADD COLUMN new_advocate_id VARCHAR(255);
UPDATE representation_requests rr
SET new_advocate_id = u.new_id
    FROM users u
WHERE u.id = rr.advocate_id;

ALTER TABLE legal_cases ADD COLUMN new_advocate_id VARCHAR(255);
UPDATE legal_cases lc
SET new_advocate_id = u.new_id
    FROM users u
WHERE u.id = lc.advocate_id;

ALTER TABLE legal_cases ADD COLUMN new_client_id VARCHAR(255);
UPDATE legal_cases lc
SET new_client_id = u.new_id
    FROM users u
WHERE u.id = lc.client_id;

-- Drop old columns from child tables
ALTER TABLE advocate_profiles DROP COLUMN user_id;
ALTER TABLE client_profiles DROP COLUMN user_id;
ALTER TABLE representation_requests DROP COLUMN client_id;
ALTER TABLE representation_requests DROP COLUMN advocate_id;
ALTER TABLE legal_cases DROP COLUMN advocate_id;
ALTER TABLE legal_cases DROP COLUMN client_id;

-- Rename new columns in child tables
ALTER TABLE advocate_profiles RENAME COLUMN new_user_id TO user_id;
ALTER TABLE client_profiles RENAME COLUMN new_user_id TO user_id;
ALTER TABLE representation_requests RENAME COLUMN new_client_id TO client_id;
ALTER TABLE representation_requests RENAME COLUMN new_advocate_id TO advocate_id;
ALTER TABLE legal_cases RENAME COLUMN new_advocate_id TO advocate_id;
ALTER TABLE legal_cases RENAME COLUMN new_client_id TO client_id;

-- Now safely drop users primary key and id
ALTER TABLE users DROP CONSTRAINT users_pkey;
ALTER TABLE users DROP COLUMN id;
ALTER TABLE users RENAME COLUMN new_id TO id;
ALTER TABLE users ADD PRIMARY KEY (id);

-- ==================
-- ADVOCATE_PROFILES TABLE
-- ==================
ALTER TABLE advocate_profiles ADD COLUMN new_id VARCHAR(255);
UPDATE advocate_profiles SET new_id = gen_random_uuid()::text;
ALTER TABLE advocate_profiles DROP CONSTRAINT IF EXISTS advocate_profiles_pkey;
ALTER TABLE advocate_profiles DROP COLUMN id;
ALTER TABLE advocate_profiles RENAME COLUMN new_id TO id;
ALTER TABLE advocate_profiles ADD PRIMARY KEY (id);

-- ==================
-- CLIENT_PROFILES TABLE
-- ==================
ALTER TABLE client_profiles ADD COLUMN new_id VARCHAR(255);
UPDATE client_profiles SET new_id = gen_random_uuid()::text;
ALTER TABLE client_profiles DROP CONSTRAINT IF EXISTS client_profiles_pkey;
ALTER TABLE client_profiles DROP COLUMN id;
ALTER TABLE client_profiles RENAME COLUMN new_id TO id;
ALTER TABLE client_profiles ADD PRIMARY KEY (id);

-- ==================
-- REPRESENTATION_REQUESTS TABLE
-- ==================
ALTER TABLE representation_requests ADD COLUMN new_id VARCHAR(255);
UPDATE representation_requests SET new_id = gen_random_uuid()::text;
ALTER TABLE representation_requests DROP CONSTRAINT IF EXISTS representation_requests_pkey;
ALTER TABLE representation_requests DROP COLUMN id;
ALTER TABLE representation_requests RENAME COLUMN new_id TO id;
ALTER TABLE representation_requests ADD PRIMARY KEY (id);

-- ==================
-- ADD FOREIGN KEY CONSTRAINTS BACK
-- ==================
ALTER TABLE advocate_profiles ADD CONSTRAINT advocate_profiles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE client_profiles ADD CONSTRAINT client_profiles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE representation_requests ADD CONSTRAINT representation_requests_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES users(id);
ALTER TABLE representation_requests ADD CONSTRAINT representation_requests_advocate_id_fkey
    FOREIGN KEY (advocate_id) REFERENCES users(id);
ALTER TABLE legal_cases ADD CONSTRAINT legal_cases_advocate_id_fkey
    FOREIGN KEY (advocate_id) REFERENCES users(id);
ALTER TABLE legal_cases ADD CONSTRAINT legal_cases_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES users(id);