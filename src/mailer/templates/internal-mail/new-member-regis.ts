/* eslint-disable import/no-anonymous-default-export */
import mailTemplate from "../template";
// TODO: Dùng sau khi xác nhận nhận đơn đăng ký

export default (data: any) => {
  const content = `
    Thân gửi Team KTSTN,<br>
    <br>
    Đã có đơn đăng ký tham gia ứng tuyển trở thành thành viên của Khoảng Trời Của Bé, thông tin chi tiết như sau:<br>
    1. Họ và tên: ${data.fullName}<br>
    2. Ngày, tháng, năm sinh: ${new Date(data.birthday).toLocaleDateString(
      "vi"
    )}<br>
    3. Số điện thoại: ${data.phoneNumber}<br>
    4. Email: ${data.email}<br>
    5. Nơi học tập hoặc công tác: ${data.workPlace}<br>
    6. Nơi sống: ${data.address}<br>
    7. Kinh nghiệm tham gia hoạt động xã hội: ${
      data.hasSocialActivities ? "Có" : "Không"
    }<br>
    8. Kỷ niệm khi tham gia hoạt động xã hội: ${data.memories}<br>
    9. Vị trí muốn tham gia tại Khoảng Trời Của Bé: ${data.position.name}<br>
    10. Mong muốn của bạn khi tham gia Khoảng Trời Của Bé: ${
      data.hopeToReceive
    }<br>
    <br>
    Bạn hãy kiểm tra đơn của ứng viên ở Trang vòng đơn. Sau đó, bạn hãy tiến hành quy trình Duyệt đơn nhé.<br>
    Khoảng Trời Của Bé cảm ơn bạn nhiều!<br>
    <br>
    Thân mến!<br>
    Khoảng Trời Của Bé<br>
  `;

  return mailTemplate(content);
};