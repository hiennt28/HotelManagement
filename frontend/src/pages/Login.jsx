import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { username, password });
            if (res.data.success) {
                const userData = res.data.user;
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                navigate(userData.role === 'admin' ? '/admin' : '/');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Sai thông tin đăng nhập');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-box">
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>Đăng nhập</h2>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Chào mừng bạn quay trở lại</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'} 
                        {!loading && <ArrowRight size={18}/>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
                    Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;