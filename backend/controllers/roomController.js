const RoomModel = require('../models/roomModel');

// 1. Lấy danh sách tất cả phòng
exports.getRooms = (req, res) => {
  RoomModel.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi server: ' + err.message });
    }
    res.json(results);
  });
};

// 2. Thêm phòng mới
exports.addRoom = (req, res) => {
  // Lấy dữ liệu từ Frontend gửi lên (Lưu ý: Frontend gửi biến 'number' và 'image')
  const { number, type, price, image } = req.body;

  // Validate dữ liệu cơ bản
  if (!number || !price) {
    return res.status(400).json({ message: 'Vui lòng nhập số phòng và giá!' });
  }

  // Chuẩn bị object dữ liệu để lưu vào Database
  // QUAN TRỌNG: Phải đổi tên key cho khớp với cột trong MySQL ('room_number', 'image_url')
  const newRoom = { 
    room_number: number, 
    type, 
    price, 
    image_url: image || '', // Nếu không có ảnh thì để chuỗi rỗng
    status: 'available'     // Mặc định khi tạo là phòng trống
  };

  RoomModel.create(newRoom, (err, result) => {
    if (err) {
      console.error("Lỗi thêm phòng:", err); 
      // Trả về lỗi chi tiết để dễ debug (VD: trùng số phòng)
      return res.status(500).json({ error: 'Lỗi Database: ' + err.sqlMessage });
    }
    res.json({ message: 'Thêm phòng thành công!', id: result.insertId });
  });
};

// 3. Cập nhật thông tin phòng (MỚI)
exports.updateRoom = (req, res) => {
  const { id } = req.params;
  const { number, type, price, image } = req.body;

  if (!number || !price) {
    return res.status(400).json({ message: 'Vui lòng nhập số phòng và giá!' });
  }

  const roomData = { 
    room_number: number, 
    type, 
    price, 
    image_url: image || '' 
  };

  RoomModel.update(id, roomData, (err, result) => {
    if (err) {
        console.error("Lỗi cập nhật phòng:", err);
        return res.status(500).json({ error: 'Lỗi Database: ' + err.message });
    }
    res.json({ message: 'Cập nhật phòng thành công!' });
  });
};

// 4. Xóa phòng
exports.deleteRoom = (req, res) => {
  const { id } = req.params;
  RoomModel.delete(id, (err, result) => {
    if (err) {
        console.error("Lỗi xóa phòng:", err);
        return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Đã xóa phòng thành công' });
  });
};