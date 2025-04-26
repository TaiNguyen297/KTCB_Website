/* eslint-disable import/no-anonymous-default-export */
import mailTemplate from "../template";
// TODO: Dùng sau khi xác nhận LOẠI KHỎI vòng phỏng vấn

export default (data: any) => {
  const content = `
    Thân gửi bạn ${data.fullName}!<br>
    <br>
    Khoảng Trời Của Bé chào bạn! Lời đầu tiên, chúng mình xin chân thành cảm ơn thời gian quý báu mà bạn đã dành ra để chuẩn bị và tham gia vòng phỏng vấn.<br>
    <br>
    Qua vòng phỏng vấn, chúng mình rất ấn tượng với năng lượng tích cực và tình yêu dành cho các hoạt động tình nguyện của bạn. Tuy nhiên, Khoảng Trời Của Bé rất tiếc vì bạn chưa phù hợp với các hoạt động ở Khoảng Trời Của Bé hiện tại. Chúng mình đánh giá cao nỗ lực của bạn, vậy nên chúng mình sẽ lưu lại hồ sơ và mong rằng có thể hợp tác với bạn trong tương lai.<br>
    <br>
    Chúc bạn luôn hạnh phúc và may mắn trong công việc, học tập. Cảm ơn bạn rất nhiều!<br>
    <br>
    Thân mến!<br>
    Khoảng Trời Của Bé<br>
  `;

  return mailTemplate(content);
};
