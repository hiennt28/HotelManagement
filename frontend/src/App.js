import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserHome from './pages/UserHome';
import BookingHistory from './pages/BookingHistory'; // Import trang lịch sử
import './index.css';

function App() {
    const [user, setUser] = useState(null);

    // Kiểm tra đăng nhập khi tải trang (F5)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Component bảo vệ Route Admin
    const AdminRoute = ({ children }) => {
        if (!user) return <Navigate to="/login" />;
        return user.role === 'admin' ? children : <Navigate to="/" />;
    };

    return (
        <Router>
            <div className="app-container">
                {/* Navbar hiển thị trên tất cả các trang */}
                <Navbar user={user} setUser={setUser} />
                
                <Routes>
                    {/* Trang chủ khách hàng */}
                    <Route path="/" element={<UserHome />} />
                    
                    {/* Xác thực */}
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Trang dành cho Admin (Bảo mật) */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />

                    {/* Trang lịch sử đặt phòng (Mới) */}
                    <Route path="/bookings" element={
                        user ? <BookingHistory /> : <Navigate to="/login" />
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;