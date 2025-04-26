export default (content: any) => {
  return `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html lang="vi">
      <head>
        <meta http-equiv="Content-Type" content="text/html">
        <title>Khoảng Trời Của Bé</title>
      </head>

      <body link="#04c" text="#313131" style="color:#313131; background-color:#ffffff; margin: 0; padding: 0;">
        ${content}
      </body>
    </html>
  `
};
