import React, { useState } from 'react';
import api from '../services/api';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const [formData, setFormData] = useState({
        id: user.id,
        full_name: user.full_name || '',
        phone: user.phone || '',
        password: ''
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/profile', formData);
            alert('Cập nhật thành công! Vui lòng đăng nhập lại.');
            localStorage.removeItem('user');
            window.location.href = '/login';
        } catch (err) { alert('Lỗi cập nhật'); }
    };

    return (
        <div className="container" style={{maxWidth: '500px', marginTop: '50px'}}>
            <h2>Hồ sơ cá nhân</h2>
            <form onSubmit={handleUpdate} className="card">
                <div className="form-group">
                    <label>Họ tên</label>
                    <input className="form-input" value={formData.full_name} onChange={e=>setFormData({...formData, full_name: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input className="form-input" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Đổi mật khẩu (Để trống nếu không đổi)</label>
                    <input className="form-input" type="password" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
                </div>
                <button className="btn btn-primary" style={{width:'100%'}}>Lưu thay đổi</button>
            </form>
        </div>
    );
};
export default Profile;