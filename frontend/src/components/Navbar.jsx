import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Hotel, History, ChevronDown } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Xử lý click ra ngoài để đóng dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
        setShowDropdown(false);
    };

    return (
        <nav className="navbar">
            <div className="container flex-between">
                {/* Logo */}
                <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <Hotel size={28} color="var(--primary-color)" />
                    <span>Luxury Hotel</span>
                </div>

                {/* User Info with Dropdown */}
                {user ? (
                    <div className="flex" style={{ gap: '20px', alignItems: 'center', position: 'relative' }} ref={dropdownRef}>
                        
                        {/* Avatar Button */}
                        <div 
                            className="user-badge" 
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{ cursor: 'pointer', userSelect: 'none', transition: '0.2s', background: showDropdown ? '#e2e8f0' : '#f1f5f9' }}
                        >
                            <User size={18} color="var(--primary-color)" />
                            <div className="flex-col">
                                <span style={{ fontWeight: 600, fontSize: '14px' }}>{user.full_name}</span>
                            </div>
                            <ChevronDown size={14} style={{ marginLeft: '5px', color: '#64748b' }}/>
                        </div>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="dropdown-menu">
                                {/* Mũi tên nhỏ chỉ lên trên (optional) */}
                                <div style={{position:'absolute', top:'-5px', right:'20px', width:'10px', height:'10px', background:'white', transform:'rotate(45deg)', borderLeft:'1px solid #e2e8f0', borderTop:'1px solid #e2e8f0'}}></div>
                                
                                <ul style={{position: 'relative', zIndex: 1}}>
                                    <li onClick={() => { navigate('/bookings'); setShowDropdown(false); }}>
                                        <History size={16} /> Lịch sử đặt phòng
                                    </li>
                                    {/* Bạn có thể thêm 'Hồ sơ cá nhân' ở đây nếu muốn */}
                                    <li onClick={handleLogout} style={{ color: 'var(--danger)', borderTop: '1px solid #f1f5f9' }}>
                                        <LogOut size={16} /> Đăng xuất
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-10">
                        <button onClick={() => navigate('/login')} className="btn" style={{ color: '#64748b' }}>Đăng nhập</button>
                        <button onClick={() => navigate('/register')} className="btn btn-primary">Đăng ký</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;