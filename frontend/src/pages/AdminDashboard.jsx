import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });
  const [roomModal, setRoomModal] = useState({ show: false, mode: 'add', data: null });
  const [paymentModal, setPaymentModal] = useState({ show: false, booking: null });

  const [roomFormData, setRoomFormData] = useState({ number: '', type: 'Single', price: '', image: '' });

  const BANK_INFO = {
      bankId: 'MB',
      accountNo: '033333333',
      accountName: 'KHACH SAN LUXURY',
      template: 'compact'
  };

  const fetchData = async () => {
    if (activeTab === 'rooms') api.get('/rooms').then(res => setRooms(res.data)).catch(console.error);
    if (activeTab === 'bookings') api.get('/bookings/all').then(res => setBookings(res.data)).catch(console.error);
    if (activeTab === 'stats') api.get('/bookings/stats').then(res => setStats(res.data)).catch(console.error);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const showNotify = (msg, type = 'success') => {
      setNotification({ show: true, message: msg, type });
      if(type === 'success') setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const showConfirm = (msg, action) => {
      setConfirmModal({ show: true, message: msg, onConfirm: action });
  };

  const handleOpenRoomModal = (mode, room = null) => {
      setRoomModal({ show: true, mode, data: room });
      if (mode === 'edit' && room) {
          setRoomFormData({ number: room.room_number, type: room.type, price: room.price, image: room.image_url || '' });
      } else {
          setRoomFormData({ number: '', type: 'Single', price: '', image: '' });
      }
  };

  const handleSaveRoom = async (e) => {
      e.preventDefault();
      try {
          if (roomModal.mode === 'add') {
              await api.post('/rooms/add', roomFormData);
              showNotify('Thêm phòng thành công!');
          } else {
              await api.put(`/rooms/${roomModal.data.id}`, roomFormData);
              showNotify('Cập nhật phòng thành công!');
          }
          setRoomModal({ show: false, mode: 'add', data: null });
          fetchData();
      } catch (err) {
          showNotify(err.response?.data?.message || 'Có lỗi xảy ra', 'error');
      }
  };

  const handleDeleteRoom = (id) => {
      showConfirm('Bạn chắc chắn muốn xóa phòng này?', async () => {
          try { await api.delete(`/rooms/${id}`); showNotify('Đã xóa phòng!'); fetchData(); }
          catch (err) { showNotify('Lỗi xóa phòng', 'error'); }
      });
  };

  const handleBookingAction = (booking, status, text) => {
      if (status === 'checked_out') {
          setPaymentModal({ show: true, booking: booking });
          return;
      }
      showConfirm(`Xác nhận: ${text}?`, async () => {
          try {
              await api.put(`/bookings/${booking.id}/status`, { status });
              showNotify('Cập nhật trạng thái thành công!');
              fetchData();
          } catch (err) { showNotify('Lỗi cập nhật', 'error'); }
      });
  };

  const handleConfirmPayment = async () => {
      if (!paymentModal.booking) return;
      try {
          await api.put(`/bookings/${paymentModal.booking.id}/status`, { status: 'checked_out' });
          showNotify('Thanh toán thành công! Đã Check-out.');
          setPaymentModal({ show: false, booking: null });
          fetchData();
      } catch (err) {
          showNotify('Lỗi xử lý check-out', 'error');
      }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h1 style={{ color: 'var(--primary-color)', fontSize: '24px', marginBottom: '40px', fontWeight: 'bold' }}>Admin Portal</h1>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => setActiveTab('rooms')} className={`btn ${activeTab==='rooms'?'btn-primary':''}`} style={{justifyContent:'flex-start', color: activeTab!=='rooms'?'#64748b':''}}>Quản lý phòng</button>
            <button onClick={() => setActiveTab('bookings')} className={`btn ${activeTab==='bookings'?'btn-primary':''}`} style={{justifyContent:'flex-start', color: activeTab!=='bookings'?'#64748b':''}}>Đặt phòng</button>
            <button onClick={() => setActiveTab('stats')} className={`btn ${activeTab==='stats'?'btn-primary':''}`} style={{justifyContent:'flex-start', color: activeTab!=='stats'?'#64748b':''}}>Thống kê</button>
        </nav>
        <button onClick={() => {localStorage.removeItem('user'); navigate('/login');}} className="btn-danger flex" style={{gap:'10px'}}>Đăng xuất</button>
      </aside>

      <main className="main-content">
        {activeTab === 'rooms' && (
          <>
            <div className="flex-between" style={{marginBottom: '30px'}}>
                <h2>Quản Lý Phòng</h2>
                <button onClick={() => handleOpenRoomModal('add')} className="btn btn-primary">Thêm phòng mới</button>
            </div>
            <div className="card" style={{padding:0, overflow:'hidden'}}>
                <table className="data-table">
                    <thead><tr><th>Phòng</th><th>Loại</th><th>Giá</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.id}>
                                <td><strong>P.{room.room_number}</strong></td>
                                <td>{room.type}</td>
                                <td style={{color:'var(--primary-color)', fontWeight:'bold'}}>{parseInt(room.price).toLocaleString()} đ</td>
                                <td><span className={`status-badge ${room.status==='available'?'status-available':'status-booked'}`}>{room.status==='available'?'Trống':'Đã đặt'}</span></td>
                                <td>
                                    <div className="flex gap-10">
                                        <button onClick={() => handleOpenRoomModal('edit', room)} style={{color:'var(--primary-color)'}}>Sửa</button>
                                        <button onClick={() => handleDeleteRoom(room.id)} style={{color:'var(--danger)'}}>Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </>
        )}

        {activeTab === 'bookings' && (
            <>
                <h2>Quản Lý Đặt Phòng</h2>
                <div className="card" style={{padding:0}}>
                    <table className="data-table">
                        <thead><tr><th>Khách</th><th>Phòng</th><th>Lịch trình</th><th>Tổng tiền</th><th>Trạng thái</th><th>Xử lý</th></tr></thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id}>
                                    <td><div>{b.customer_name}</div><div style={{fontSize:'12px', color:'#64748b'}}>{b.customer_phone}</div></td>
                                    <td>P.{b.room_number}</td>
                                    <td>{new Date(b.check_in).toLocaleDateString()} - {new Date(b.check_out).toLocaleDateString()}</td>
                                    <td style={{fontWeight:'bold'}}>{parseInt(b.total_price).toLocaleString()} đ</td>
                                    <td><span className={`status-badge`}>{b.status}</span></td>
                                    <td>
                                        <div className="flex gap-10">
                                            {b.status === 'pending' && <>
                                                <button onClick={() => handleBookingAction(b, 'confirmed', 'Duyệt đơn này')} style={{color:'green'}}>Duyệt</button>
                                                <button onClick={() => handleBookingAction(b, 'cancelled', 'Hủy đơn này')} style={{color:'red'}}>Hủy</button>
                                            </>}
                                            {b.status === 'confirmed' && <button onClick={() => handleBookingAction(b, 'checked_in', 'Khách nhận phòng')} className="btn btn-primary" style={{padding:'5px', fontSize:'12px'}}>Check-in</button>}
                                            {b.status === 'checked_in' && (
                                                <button onClick={() => handleBookingAction(b, 'checked_out', 'Khách trả phòng')} className="btn btn-danger" style={{padding:'5px 10px', fontSize:'12px', border: '1px solid var(--danger)'}}>Thanh toán</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}
        
        {activeTab === 'stats' && (
            <>
               <h2>Báo Cáo Thống Kê</h2>
               <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px'}}>
                    <div className="card" style={{textAlign:'center', padding:'30px'}}>
                        <div style={{color:'#64748b', marginBottom:'10px'}}>DOANH THU</div>
                        <div style={{fontSize:'32px', fontWeight:'bold', color:'var(--primary-color)'}}>{parseInt(stats.revenue||0).toLocaleString()} đ</div>
                    </div>
                    <div className="card" style={{textAlign:'center', padding:'30px'}}>
                        <div style={{color:'#64748b', marginBottom:'10px'}}>PHÒNG TRỐNG</div>
                        <div style={{fontSize:'32px', fontWeight:'bold', color:'var(--success)'}}>{stats.availableRooms||0}</div>
                    </div>
                    <div className="card" style={{textAlign:'center', padding:'30px'}}>
                        <div style={{color:'#64748b', marginBottom:'10px'}}>ĐƠN CHỜ DUYỆT</div>
                        <div style={{fontSize:'32px', fontWeight:'bold', color:'#f59e0b'}}>{stats.pendingBookings||0}</div>
                    </div>
                </div>
            </>
        )}
      </main>

      {notification.show && (
          <div className="overlay" style={{zIndex: 2000}}>
              <div className="modal" style={{width: '350px', textAlign: 'center'}}>
                  <h3 style={{margin: '0 0 10px 0'}}>{notification.type === 'success' ? 'Thành công' : 'Thất bại'}</h3>
                  <p style={{color: '#64748b', marginBottom: '20px'}}>{notification.message}</p>
                  <button onClick={() => setNotification({...notification, show: false})} className="btn btn-primary" style={{width: '100%'}}>Đóng</button>
              </div>
          </div>
      )}

      {confirmModal.show && (
          <div className="overlay" style={{zIndex: 2000}}>
              <div className="modal" style={{width: '400px'}}>
                  <h3 style={{marginTop: 0}}>Xác nhận hành động</h3>
                  <p>{confirmModal.message}</p>
                  <div className="flex gap-10" style={{justifyContent: 'flex-end', marginTop: '20px'}}>
                      <button onClick={() => setConfirmModal({...confirmModal, show: false})} className="btn" style={{background:'#f1f5f9'}}>Hủy bỏ</button>
                      <button onClick={() => { confirmModal.onConfirm(); setConfirmModal({...confirmModal, show: false}); }} className="btn btn-primary">Đồng ý</button>
                  </div>
              </div>
          </div>
      )}

      {roomModal.show && (
        <div className="overlay" style={{zIndex: 1500}}>
           <div className="modal" style={{width: '500px'}}>
                  <div className="flex-between" style={{marginBottom: '20px'}}>
                      <h3 style={{margin: 0}}>{roomModal.mode === 'add' ? 'Thêm phòng mới' : 'Cập nhật phòng'}</h3>
                      <button onClick={() => setRoomModal({...roomModal, show: false})}>Đóng</button>
                  </div>
                  <form onSubmit={handleSaveRoom}>
                      <div className="form-group">
                          <label>Số phòng</label>
                          <input className="form-input" value={roomFormData.number} onChange={e => setRoomFormData({...roomFormData, number: e.target.value})} required placeholder="VD: 101"/>
                      </div>
                      <div className="form-group">
                          <label>Loại phòng</label>
                          <select className="form-select" value={roomFormData.type} onChange={e => setRoomFormData({...roomFormData, type: e.target.value})}>
                              <option value="Single">Single</option><option value="Double">Double</option><option value="VIP">VIP</option>
                          </select>
                      </div>
                      <div className="form-group">
                          <label>Giá phòng</label>
                          <input type="number" className="form-input" value={roomFormData.price} onChange={e => setRoomFormData({...roomFormData, price: e.target.value})} required/>
                      </div>
                      <div className="form-group">
                          <label>Link ảnh (URL)</label>
                          <input className="form-input" value={roomFormData.image} onChange={e => setRoomFormData({...roomFormData, image: e.target.value})} placeholder="https://..."/>
                      </div>
                      <button className="btn btn-primary" style={{width: '100%'}}>
                          {roomModal.mode === 'add' ? 'Lưu phòng mới' : 'Lưu thay đổi'}
                      </button>
                  </form>
              </div>
        </div>
      )}

      {paymentModal.show && paymentModal.booking && (
          <div className="overlay" style={{zIndex: 1600}}>
              <div className="modal" style={{width: '750px', maxWidth: '90%'}}>
                  <div className="flex-between" style={{marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px'}}>
                      <h3 style={{margin: 0}}>Thanh toán hóa đơn</h3>
                      <button onClick={() => setPaymentModal({show: false, booking: null})}>Đóng</button>
                  </div>

                  <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
                      <div style={{flex: 1, minWidth: '300px'}}>
                          <div style={{background: '#f8fafc', padding: '20px', borderRadius: '12px'}}>
                              <h4 style={{marginTop: 0, color: '#64748b', textTransform: 'uppercase', fontSize: '12px'}}>Thông tin đặt phòng</h4>
                              <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '5px'}}>P.{paymentModal.booking.room_number}</div>
                              <div style={{marginBottom: '20px', color: '#64748b'}}>{paymentModal.booking.type} Room</div>
                              
                              <div className="flex-between" style={{marginBottom: '10px', fontSize: '14px'}}>
                                  <span>Khách hàng:</span>
                                  <strong>{paymentModal.booking.customer_name}</strong>
                              </div>
                              <div className="flex-between" style={{marginBottom: '10px', fontSize: '14px'}}>
                                  <span>Check-in:</span>
                                  <strong>{new Date(paymentModal.booking.check_in).toLocaleDateString()}</strong>
                              </div>
                              <div className="flex-between" style={{marginBottom: '10px', fontSize: '14px'}}>
                                  <span>Check-out:</span>
                                  <strong>{new Date(paymentModal.booking.check_out).toLocaleDateString()}</strong>
                              </div>
                              
                              <div style={{borderTop: '2px dashed #cbd5e1', margin: '20px 0'}}></div>
                              
                              <div className="flex-between" style={{fontSize: '18px'}}>
                                  <span>Tổng tiền:</span>
                                  <strong style={{color: 'var(--primary-color)'}}>{parseInt(paymentModal.booking.total_price).toLocaleString()} đ</strong>
                              </div>
                          </div>
                      </div>

                      <div style={{flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                          <div style={{background: 'white', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                              <img 
                                  src={`https://img.vietqr.io/image/${BANK_INFO.bankId}-${BANK_INFO.accountNo}-${BANK_INFO.template}.png?amount=${paymentModal.booking.total_price}&addInfo=Thanh toan P${paymentModal.booking.room_number} ${paymentModal.booking.customer_name}&accountName=${BANK_INFO.accountName}`} 
                                  alt="VietQR Payment"
                                  style={{width: '100%', maxWidth: '300px'}}
                              />
                          </div>
                          <p style={{textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '15px'}}>
                              Mở App ngân hàng để quét mã.<br/>Hệ thống tự động điền số tiền và nội dung.
                          </p>
                      </div>
                  </div>

                  <div style={{marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px'}}>
                      <button onClick={() => setPaymentModal({show: false, booking: null})} className="btn" style={{background: '#f1f5f9'}}>Hủy bỏ</button>
                      <button onClick={handleConfirmPayment} className="btn btn-primary" style={{padding: '12px 30px'}}>
                          Xác nhận đã nhận tiền
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;