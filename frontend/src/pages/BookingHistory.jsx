import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Calendar, MapPin, Clock } from 'lucide-react';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            // Gọi API kèm user_id
            api.get(`/bookings/my-bookings?user_id=${user.id}`)
                .then(res => setBookings(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, []);

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Đang tải dữ liệu...</div>;

    return (
        <div className="container" style={{ marginTop: '30px', paddingBottom: '50px' }}>
            <h2 style={{ marginBottom: '30px', borderLeft: '5px solid var(--primary-color)', paddingLeft: '15px' }}>
                Lịch sử đặt phòng của bạn
            </h2>

            {bookings.length === 0 ? (
                <p>Bạn chưa có đơn đặt phòng nào.</p>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {bookings.map(item => (
                        <div key={item.id} className="card flex" style={{ padding: '0', overflow: 'hidden', alignItems: 'stretch' }}>
                            {/* Ảnh phòng bên trái */}
                            <div style={{ width: '200px', minWidth: '200px' }}>
                                <img 
                                    src={item.image_url || 'https://via.placeholder.com/200'} 
                                    alt="Room" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            </div>

                            {/* Thông tin bên phải */}
                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div className="flex-between" style={{ marginBottom: '10px' }}>
                                    <h3 style={{ margin: 0 }}>Phòng {item.room_number} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'normal' }}>({item.type})</span></h3>
                                    <span className={`status-badge`} 
                                          style={{ 
                                              background: item.status === 'confirmed' ? '#dcfce7' : item.status === 'pending' ? '#fef3c7' : item.status === 'cancelled' ? '#fee2e2' : '#f1f5f9',
                                              color: item.status === 'confirmed' ? '#166534' : item.status === 'pending' ? '#d97706' : item.status === 'cancelled' ? '#991b1b' : '#64748b'
                                          }}>
                                        {item.status === 'pending' && 'Chờ duyệt'}
                                        {item.status === 'confirmed' && 'Đã duyệt'}
                                        {item.status === 'checked_in' && 'Đang ở'}
                                        {item.status === 'checked_out' && 'Hoàn tất'}
                                        {item.status === 'cancelled' && 'Đã hủy'}
                                    </span>
                                </div>

                                <div style={{ color: '#64748b', fontSize: '14px', display: 'flex', gap: '20px', marginBottom: '15px' }}>
                                    <span className="flex" style={{ gap: '5px', alignItems: 'center' }}>
                                        <Calendar size={16} /> 
                                        {new Date(item.check_in).toLocaleDateString()} - {new Date(item.check_out).toLocaleDateString()}
                                    </span>
                                    <span className="flex" style={{ gap: '5px', alignItems: 'center' }}>
                                        <Clock size={16} /> 
                                        {new Date(item.created_at).toLocaleDateString()} (Ngày đặt)
                                    </span>
                                </div>

                                <div className="flex-between" style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                                    <span style={{ fontSize: '14px' }}>Tổng thanh toán:</span>
                                    <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '18px' }}>
                                        {parseInt(item.total_price).toLocaleString()} đ
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingHistory;