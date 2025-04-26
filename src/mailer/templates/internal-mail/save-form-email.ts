/* eslint-disable import/no-anonymous-default-export */
import mailTemplate from "../template";
// TODO: Dùng sau khi xác nhận nhận đơn đăng ký

export default (data: any) => {
  const content = `
    Thân gửi Team KTSTN,<br>
    <br>
    Qua vòng duyệt đơn, đơn của ứng viên này đã bị loại. Bạn hãy lưu lại địa chỉ email của ứng viên nhé.<br>
    Email: ${data.email}<br>
    <br>
    Khoảng Trời Của Bé cảm ơn bạn nhiều!<br>
    <br>
    Thân mến!<br>
    Khoảng Trời Của Bé<br>
  `;

  return mailTemplate(content);
};