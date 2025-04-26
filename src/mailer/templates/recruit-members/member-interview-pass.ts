/* eslint-disable import/no-anonymous-default-export */
import mailTemplate from "../template";
// TODO: Dùng sau khi xác nhận NHẬN QUA vòng phỏng vấn

export default (data: any) => {
  const content = `
    Thân gửi bạn ${data.fullName}!<br>
    <br>
    Khoảng Trời Của Bé chào bạn! Chúng mình rất ấn tượng với năng lượng và tình yêu dành cho tình nguyện của bạn. Chúng mình tin rằng, với năng lực và tinh thần nhiệt huyết đó, bạn sẽ cùng chúng mình cống hiến thật nhiều trong các hoạt động và công tác tình nguyện của Khoảng Trời Của Bé.<br>
    CHÚC MỪNG BẠN ĐÃ CHÍNH THỨC TRỞ THÀNH MỘT MÀNH GHÉP TRONG GIA ĐÌNH KHOẢNG TRỜI CỦA BÉ.<br>
    <br>
    Sắp tới, chúng mình sẽ tổ chức một buổi gặp mặt thành viên mới. Thông tin chi tiết về buổi gặp mặt sẽ được gửi đến bạn ở những email sau.<br>
    Một lần nữa chúc mừng bạn và hẹn gặp lại bạn vào buổi gặp mặt nhé!<br>
    <br>
    Thân mến!<br>
    Khoảng Trời Của Bé<br>
  `;

  return mailTemplate(content);
};
