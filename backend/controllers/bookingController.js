const db = require('../config/db');
const emailService = require('../services/emailService'); 

exports.createBooking = (req, res) => {
    const { user_id, room_id, check_in, check_out, customer_name, customer_phone, total_price } = req.body;

    const checkQuery = `
        SELECT * FROM bookings 
        WHERE room_id = ? 
        AND status NOT IN ('cancelled', 'checked_out')
        AND (? < check_out AND ? > check_in)
    `;

    db.execute(checkQuery, [room_id, check_in, check_out], (err, results) => {
        if (err) return res.status(500).json({ message: 'Lỗi kiểm tra phòng', error: err });
        
        if (results.length > 0) {
            return res.status(400).json({ message: 'Phòng đã có người đặt trong thời gian này!' });
        }

        const insertQuery = `
            INSERT INTO bookings (user_id, room_id, customer_name, customer_phone, check_in, check_out, total_price) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.execute(insertQuery, [user_id, room_id, customer_name, customer_phone, check_in, check_out, total_price], (err, result) => {
            if (err) return res.status(500).json({ message: 'Lỗi lưu đặt phòng', error: err });
            
            const bookingId = result.insertId;

            db.execute("UPDATE rooms SET status = 'booked' WHERE id = ?", [room_id], (updateErr) => {
                if (updateErr) console.error("Lỗi cập nhật trạng thái phòng:", updateErr);
                
                try {
                    if (emailService && emailService.sendBookingEmail) {
                        // emailService.sendBookingEmail('email_khach@gmail.com', { ... });
                        console.log(`[Email Service] Đã kích hoạt gửi mail cho đơn #${bookingId}`);
                    }
                } catch (emailErr) {
                    console.error("Lỗi gửi email:", emailErr);
                }

                res.json({ success: true, message: 'Đặt phòng thành công!', bookingId });
            });
        });
    });
};

exports.getAllBookings = (req, res) => {
    const query = `
        SELECT b.*, r.room_number, r.type 
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        ORDER BY b.created_at DESC
    `;
    db.execute(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getUserBookings = (req, res) => {
    const { user_id } = req.query;
    
    if (!user_id) {
        return res.status(400).json({ message: 'Thiếu user_id' });
    }

    const query = `
        SELECT b.*, r.room_number, r.type, r.image_url
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    `;

    db.execute(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        db.execute('SELECT room_id FROM bookings WHERE id = ?', [id], (err, rows) => {
            if (!err && rows.length > 0) {
                const roomId = rows[0].room_id;
                
                if (status === 'cancelled' || status === 'checked_out') {
                    db.execute("UPDATE rooms SET status = 'available' WHERE id = ?", [roomId]);
                } else if (status === 'confirmed' || status === 'checked_in') {
                    db.execute("UPDATE rooms SET status = 'booked' WHERE id = ?", [roomId]);
                }
            }
        });

        res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
    });
};

exports.getStats = (req, res) => {
    const queryRooms = "SELECT COUNT(*) as total, SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available FROM rooms";
    const queryRevenue = "SELECT SUM(total_price) as revenue FROM bookings WHERE status = 'checked_out'";
    const queryPending = "SELECT COUNT(*) as pending FROM bookings WHERE status = 'pending'";

    db.execute(queryRooms, (err, roomResult) => {
        if (err) return res.status(500).json({ error: err.message });

        db.execute(queryRevenue, (err, revenueResult) => {
            if (err) return res.status(500).json({ error: err.message });

            db.execute(queryPending, (err, pendingResult) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                    totalRooms: roomResult[0].total || 0,
                    availableRooms: roomResult[0].available || 0,
                    revenue: revenueResult[0].revenue || 0,
                    pendingBookings: pendingResult[0].pending || 0
                });
            });
        });
    });
};