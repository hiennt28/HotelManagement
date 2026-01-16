import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
    MapPin, Wifi, Coffee, ArrowRight, Search, 
    X, Check, Star, CheckCircle, AlertCircle, LogIn 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
    const navigate = useNavigate();
    
    // --- STATE DATA ---
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [filter, setFilter] = useState({ type: 'All', maxPrice: '' });
    
    // --- STATE MODAL NGHIỆP VỤ ---
    const [selectedRoom, setSelectedRoom] = useState(null); // Modal đặt phòng
    const [bookingData, setBookingData] = useState({
        checkIn: '', 
        checkOut: '', 
        customerName: '', 
        customerPhone: ''
    });

    // --- STATE MODAL THÔNG BÁO (SYSTEM) ---
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

    // --- EFFECT ---
    useEffect(() => {
        api.get('/rooms').then(res => {
            setRooms(res.data);
            setFilteredRooms(res.data);
        }).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        let result = rooms;
        if (filter.type !== 'All') result = result.filter(r => r.type === filter.type);
        if (filter.maxPrice) result = result.filter(r => parseInt(r.price) <= parseInt(filter.maxPrice));
        setFilteredRooms(result);
    }, [filter, rooms]);

    // --- HELPER SHOW MODAL ---
    const showNotify = (msg, type = 'success') => {
        setNotification({ show: true, message: msg, type });
        if(type === 'success') setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const showConfirm = (msg, action) => {
        setConfirmModal({ show: true, message: msg, onConfirm: action });
    };

    // --- HANDLERS ---
    const handleOpenBooking = (room) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            // Thay alert bằng Confirm Modal chuyển hướng đăng nhập
            showConfirm('Bạn cần đăng nhập để đặt phòng. Chuyển đến trang đăng nhập ngay?', () => {
                navigate('/login');
            });
            return;
        }
        setBookingData(prev => ({ ...prev, customerName: user.full_name || '' }));
        setSelectedRoom(room);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user) return showNotify('Vui lòng đăng nhập lại!', 'error');

        const start = new Date(bookingData.checkIn);
        const end = new Date(bookingData.checkOut);
        const nights = (end - start) / (1000 * 60 * 60 * 24);
        
        if (nights <= 0) return showNotify('Ngày trả phòng phải sau ngày nhận!', 'error');

        const totalPrice = nights * selectedRoom.price;

        try {
            await api.post('/bookings/add', {
                user_id: user.id,
                room_id: selectedRoom.id,
                check_in: bookingData.checkIn,
                check_out: bookingData.checkOut,
                customer_name: bookingData.customerName,
                customer_phone: bookingData.customerPhone,
                total_price: totalPrice
            });

            // Thay alert thành Notify Modal
            showNotify('Đặt phòng thành công! Vui lòng chờ Admin xác nhận.');
            
            // Đóng form đặt phòng sau khi thành công
            setSelectedRoom(null); 
            setBookingData({ checkIn: '', checkOut: '', customerName: '', customerPhone: '' });
        } catch (err) {
            console.error(err);
            showNotify(err.response?.data?.message || 'Lỗi đặt phòng', 'error');
        }
    };

    // --- RENDER ---
    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* HERO SECTION */}
            <div className="hero-section">
                <img 
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80" 
                    alt="Luxury Hotel" className="hero-bg" 
                />
                <div style={{ position: 'relative', zIndex: 1, padding: '0 20px' }}>
                    <div style={{ background: 'rgba(37, 99, 235, 0.9)', display: 'inline-block', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px' }}>
                        Luxury Stay Experience
                    </div>
                    <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        Kỳ nghỉ đẳng cấp <span style={{ color: '#93c5fd' }}>5 Sao</span>
                    </h1>
                    <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px auto', opacity: 0.9 }}>
                        Khám phá không gian sang trọng, dịch vụ hoàn hảo và những khoảnh khắc đáng nhớ.
                    </p>
                </div>
            </div>

            <div className="container">
                {/* SEARCH BAR */}
                <div className="search-bar">
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '5px' }}>Loại phòng</label>
                        <select className="form-select" value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})}>
                            <option value="All">Tất cả hạng phòng</option>
                            <option value="Single">Single (Đơn)</option>
                            <option value="Double">Double (Đôi)</option>
                            <option value="VIP">VIP Suite</option>
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '5px' }}>Ngân sách tối đa</label>
                        <input type="number" className="form-input" placeholder="VD: 2000000" value={filter.maxPrice} onChange={e => setFilter({...filter, maxPrice: e.target.value})}/>
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: 'auto', height: '44px' }}><Search size={18} /> Tìm ngay</button>
                </div>

                {/* ROOM LIST HEADER */}
                <div className="flex-between" style={{ marginTop: '50px', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '28px', borderLeft: '5px solid var(--primary-color)', paddingLeft: '15px', margin: 0, color: 'var(--text-color)' }}>
                            Danh sách phòng ({filteredRooms.length})
                        </h2>
                        <p style={{ color: '#64748b', margin: '5px 0 0 20px', fontSize: '14px' }}>Lựa chọn không gian nghỉ dưỡng phù hợp nhất</p>
                    </div>
                    <div className="flex gap-20" style={{ background: 'white', padding: '10px 20px', borderRadius: '10px', boxShadow: 'var(--shadow)' }}>
                        <span className="flex" style={{ gap: '5px', alignItems: 'center', fontSize: '13px', color: '#64748b' }}><Check size={16} color="var(--success)"/> Miễn phí hủy</span>
                        <span className="flex" style={{ gap: '5px', alignItems: 'center', fontSize: '13px', color: '#64748b' }}><Check size={16} color="var(--success)"/> Thanh toán sau</span>
                    </div>
                </div>

                {/* ROOM GRID */}
                <div className="room-grid">
                    {filteredRooms.map(room => (
                        <div key={room.id} className="room-card">
                            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                <img 
                                    src={room.image_url || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'} 
                                    className="room-img" alt="Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', gap: '5px' }}>
                                    <span style={{ 
                                        background: room.type === 'VIP' ? 'linear-gradient(45deg, #f59e0b, #d97706)' : 'var(--primary-color)', 
                                        color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
                                    }}>
                                        {room.type}
                                    </span>
                                </div>
                                {/* Label "Đã kín" nếu phòng đã booked */}
                                {room.status !== 'available' && (
                                    <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        <span style={{color:'white', fontWeight:'bold', border:'2px solid white', padding:'5px 15px', textTransform:'uppercase'}}>Đã kín</span>
                                    </div>
                                )}
                            </div>

                            <div className="room-info">
                                <div className="flex gap-10" style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                                    <span className="flex" style={{ gap: '4px', alignItems: 'center' }}><MapPin size={14} color="#ef4444"/> View đẹp</span>
                                    <span className="flex" style={{ gap: '4px', alignItems: 'center' }}><Wifi size={14} color="#3b82f6"/> Wifi Free</span>
                                    <span className="flex" style={{ gap: '4px', alignItems: 'center' }}><Coffee size={14} color="#d97706"/> Ăn sáng</span>
                                </div>

                                <div className="flex-between" style={{ alignItems: 'flex-end' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Giá mỗi đêm</div>
                                        <div style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '20px', lineHeight: 1 }}>
                                            {parseInt(room.price).toLocaleString()} <span style={{fontSize: '14px', fontWeight: 400}}>đ</span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleOpenBooking(room)}
                                        disabled={room.status !== 'available'}
                                        className="btn"
                                        style={{ 
                                            background: room.status === 'available' ? 'var(--primary-color)' : '#e2e8f0',
                                            color: room.status === 'available' ? 'white' : '#94a3b8',
                                            padding: '10px 20px', fontSize: '13px',
                                            cursor: room.status === 'available' ? 'pointer' : 'not-allowed',
                                            boxShadow: room.status === 'available' ? '0 4px 6px rgba(37, 99, 235, 0.2)' : 'none'
                                        }}
                                    >
                                        {room.status === 'available' ? <>Đặt ngay <ArrowRight size={16}/></> : 'Hết phòng'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= MODALS SECTION ================= */}

            {/* 1. BOOKING FORM MODAL */}
            {selectedRoom && (
                <div className="overlay" style={{zIndex: 1000}} onClick={(e) => e.target.className === 'overlay' && setSelectedRoom(null)}>
                    <div className="modal">
                        <div className="flex-between" style={{ marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Xác nhận đặt phòng</h3>
                                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#64748b' }}>Phòng {selectedRoom.room_number} - {selectedRoom.type}</p>
                            </div>
                            <button onClick={() => setSelectedRoom(null)} style={{ background: 'transparent', color: '#94a3b8' }}><X /></button>
                        </div>
                        
                        <form onSubmit={handleBookingSubmit}>
                            <div className="form-group">
                                <label style={{fontSize: '13px', fontWeight: 600, marginBottom: '5px', display: 'block'}}>Họ tên khách hàng</label>
                                <input className="form-input" required value={bookingData.customerName} onChange={e => setBookingData({...bookingData, customerName: e.target.value})} placeholder="Nhập họ tên đầy đủ"/>
                            </div>
                            
                            <div className="form-group">
                                <label style={{fontSize: '13px', fontWeight: 600, marginBottom: '5px', display: 'block'}}>Số điện thoại</label>
                                <input className="form-input" required value={bookingData.customerPhone} onChange={e => setBookingData({...bookingData, customerPhone: e.target.value})} placeholder="Nhập số điện thoại liên hệ"/>
                            </div>

                            <div className="flex gap-20">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label style={{fontSize: '13px', fontWeight: 600, marginBottom: '5px', display: 'block'}}>Ngày nhận</label>
                                    <input type="date" className="form-input" required value={bookingData.checkIn} onChange={e => setBookingData({...bookingData, checkIn: e.target.value})}/>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label style={{fontSize: '13px', fontWeight: 600, marginBottom: '5px', display: 'block'}}>Ngày trả</label>
                                    <input type="date" className="form-input" required value={bookingData.checkOut} onChange={e => setBookingData({...bookingData, checkOut: e.target.value})}/>
                                </div>
                            </div>

                            <div style={{ background: '#eff6ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#1e3a8a' }}>Tổng thanh toán tạm tính:</span>
                                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '18px' }}>
                                    {bookingData.checkIn && bookingData.checkOut ? 
                                        (() => {
                                            const start = new Date(bookingData.checkIn);
                                            const end = new Date(bookingData.checkOut);
                                            const nights = (end - start) / (1000 * 60 * 60 * 24);
                                            return nights > 0 ? (nights * selectedRoom.price).toLocaleString() + ' đ' : '0 đ';
                                        })() : '0 đ'}
                                </span>
                            </div>

                            <button className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>Hoàn tất đặt phòng</button>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. NOTIFICATION MODAL */}
            {notification.show && (
                <div className="overlay" style={{zIndex: 2000}}>
                    <div className="modal" style={{width: '350px', textAlign: 'center'}}>
                        <div style={{marginBottom: '15px'}}>
                            {notification.type === 'success' ? <CheckCircle size={50} color="var(--success)"/> : <AlertCircle size={50} color="var(--danger)"/>}
                        </div>
                        <h3 style={{margin: '0 0 10px 0'}}>{notification.type === 'success' ? 'Thành công' : 'Thông báo'}</h3>
                        <p style={{color: '#64748b', marginBottom: '20px'}}>{notification.message}</p>
                        <button onClick={() => setNotification({...notification, show: false})} className="btn btn-primary" style={{width: '100%'}}>Đóng</button>
                    </div>
                </div>
            )}

            {/* 3. CONFIRMATION MODAL */}
            {confirmModal.show && (
                <div className="overlay" style={{zIndex: 2000}}>
                    <div className="modal" style={{width: '400px'}}>
                        <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <LogIn size={20} color="var(--primary-color)"/> Xác nhận
                        </h3>
                        <p>{confirmModal.message}</p>
                        <div className="flex gap-10" style={{justifyContent: 'flex-end', marginTop: '20px'}}>
                            <button onClick={() => setConfirmModal({...confirmModal, show: false})} className="btn" style={{background:'#f1f5f9'}}>Hủy bỏ</button>
                            <button onClick={() => { confirmModal.onConfirm(); setConfirmModal({...confirmModal, show: false}); }} className="btn btn-primary">Đồng ý</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserHome;