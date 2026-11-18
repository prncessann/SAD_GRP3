-- BASE SCHEMA (Jm: Foundation). Shared master tables only.
-- Module tables live in their own files, which run after this one:
--   Princess -> db/sales.sql    (batches, stock ledger, sales, daily closings)
--   Jiano    -> db/dispatch.sql (dispatches, receipts, material stock/usage, discrepancies, audits)
-- Business codes from the frontend (PRD-001, MAT-001, ACC-001) are used as keys.
-- Use CREATE TABLE IF NOT EXISTS in every file.

CREATE TABLE IF NOT EXISTS roles (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- 'hub' = central kitchen (Main hub), 'branch' = selling branch
CREATE TABLE IF NOT EXISTS branches (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  kind ENUM('hub','branch') NOT NULL DEFAULT 'branch'
);

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(20)  NOT NULL UNIQUE,          -- ACC-001
  username      VARCHAR(60)  NOT NULL UNIQUE,
  full_name     VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id       INT NOT NULL,
  branch_id     INT NULL,                              -- NULL = all branches
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role   FOREIGN KEY (role_id)   REFERENCES roles(id),
  CONSTRAINT fk_users_branch FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- Product master. Quantities, batches and locations belong in Princess's sales.sql.
CREATE TABLE IF NOT EXISTS products (
  code        VARCHAR(20) PRIMARY KEY,                 -- PRD-001
  name        VARCHAR(120) NOT NULL,
  description TEXT NULL,
  price       DECIMAL(10,2) NOT NULL,
  cost        DECIMAL(10,2) NOT NULL,
  threshold   INT NOT NULL DEFAULT 0,                  -- low-stock level
  is_active   TINYINT(1) NOT NULL DEFAULT 1
);

-- Raw material master. Stock-in and daily usage belong in Jiano's dispatch.sql.
CREATE TABLE IF NOT EXISTS materials (
  code      VARCHAR(20) PRIMARY KEY,                   -- MAT-001
  name      VARCHAR(120) NOT NULL,
  category  VARCHAR(60) NULL,
  unit      VARCHAR(10) NOT NULL,
  cost      DECIMAL(10,2) NOT NULL,                    -- per unit
  threshold DECIMAL(10,2) NOT NULL DEFAULT 0,
  supplier  VARCHAR(120) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

INSERT IGNORE INTO roles (name) VALUES
  ('Business Owner'), ('Sales Staff'), ('Production Head'), ('Production Staff');
