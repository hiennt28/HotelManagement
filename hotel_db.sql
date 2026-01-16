CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('available', 'booked') DEFAULT 'available',
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE,
    status ENUM('pending', 'confirmed') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Dữ liệu mẫu
INSERT INTO users (username, password, full_name, role) VALUES 
('admin', 'admin', 'Quản Trị Viên', 'admin'),
('user', 'user', 'Khách Hàng', 'user');

INSERT INTO rooms (room_number, type, price, status, image_url) VALUES 
('101', 'Single', 500000, 'available', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32'),
('201', 'VIP', 2000000, 'available', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b');