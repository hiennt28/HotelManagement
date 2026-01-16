const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hienk54t1@gmail.com', 
    pass: 'gdokdgdysnwnahst'     
  }
});

exports.sendBookingEmail = (toEmail, bookingDetails) => {
  const mailOptions = {
    from: '"Luxury Hotel" <no-reply@luxuryhotel.com>',
    to: toEmail,
    subject: `Xác nhận đặt phòng #${bookingDetails.id}`,
    html: `
      <h2>Cảm ơn bạn đã đặt phòng tại Luxury Hotel!</h2>
      <p>Mã đơn: <strong>${bookingDetails.id}</strong></p>
      <p>Phòng: ${bookingDetails.room_number}</p>
      <p>Tổng tiền: ${parseInt(bookingDetails.total_price).toLocaleString()} đ</p>
      <p>Vui lòng chờ Admin xác nhận.</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log('Lỗi gửi mail:', error);
    else console.log('Email sent: ' + info.response);
  });
};