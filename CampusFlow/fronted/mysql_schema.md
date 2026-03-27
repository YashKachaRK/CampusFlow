# CampusFlow - MySQL Database Schema

If you prefer to use a relational database like **MySQL** instead of MongoDB, here are the exact SQL commands (`DDL`) to create the tables required for your CampusFlow application.

This schema takes advantage of `FOREIGN KEY` constraints to ensure data integrity (e.g., if a user is deleted, their tasks are automatically deleted).

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS campusflow;
USE campusflow;

-- ==========================================
-- 1. USERS TABLE
-- Handles student & admin accounts
-- ==========================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. TASKS TABLE
-- Stores individual student tasks/assignments
-- ==========================================
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NULL,
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    is_done BOOLEAN DEFAULT FALSE,
    due_date DATE NULL,
    file_name VARCHAR(255) NULL,
    file_url VARCHAR(512) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Relationship
    -- If a user is deleted, cascade (delete) all their tasks automatically
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- 3. EVENTS TABLE
-- Global schedule events created by Admins
-- ==========================================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Relationship
    -- If the admin who created this event is deleted, just set created_by to NULL
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ==========================================
-- 4. NOTICES TABLE
-- Campus announcements published by Admins
-- ==========================================
CREATE TABLE notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    notice_date DATE NOT NULL,
    priority ENUM('normal', 'urgent') DEFAULT 'normal',
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Relationship
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```
cd 
### Note on implementation:
If you use this MySQL schema:
1. You will need to install the `mysql2` or `pg` (if you pivot to PostgreSQL) driver in your Node wrapper instead of `mongoose`.
2. You could also use a SQL ORM like **Prisma** or **Sequelize** which would let you define models in Javascript/Typescript and they will generate these SQL tables under the hood automatically!
