const mysql = require('mysql2');

// Cấu hình kết nối
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: '',      
  database: 'hotel_db'
});

connection.connect(error => {
  if (error) {
    console.error("Lỗi kết nối MySQL:", error.message);
    return;
  }
  console.log(" Đã kết nối thành công tới MySQL Database!");
});

module.exports = connection;