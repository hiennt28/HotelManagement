import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Type, UserPlus } from 'lucide-react';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', full_name: '', role: 'user'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi đăng ký');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-box">
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>Tạo tài khoản</h2>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Trải nghiệm dịch vụ đẳng cấp cùng chúng tôi</p>
                </div>
                
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <Type className="input-icon" size={20} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Họ và tên hiển thị"
                            value={formData.full_name}
                            onChange={e => setFormData({...formData, full_name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Tên đăng nhập"
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '10px' }}
                    >
                        {loading ? 'Đang tạo...' : 'Đăng ký thành viên'} 
                        {!loading && <UserPlus size={18} />}
                    </button>
                </form>
                
                <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', fontSize: '14px', color: '#64748b' }}>
                    <p>
                        Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;