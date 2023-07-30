import { Resend } from 'resend';
import * as dotenv from 'dotenv'


dotenv.config();


const resend = new Resend(process.env.RESEND_API_KEY);

// `
//       <h1>Withdrawal on from your account</h1>
//     <p>Thank you for subscribing to our newsletter. We are excited to have you on board!</p>
//     <img src="https://pzvncfqhcjoyyahqntai.supabase.co/storage/v1/object/public/app_assets/logo.jpg?t=2023-07-29T13%3A08%3A13.297Z" alt="Image Description">
//     <p style="font-weight: bold;">Stay tuned for the latest updates and news.</p>
//       <p>You've sent ${amount} ${tokenFrom} to ${address}</p>`

export async function sendSwapEmail(email, amount, tokenFrom, address) {
  try {
    const data = await resend.emails.send({
      from: 'Quantum Exchange <mail@quantum-xch.com>',
      to: [`${email}`],
      subject: `Withdrawal on Quantum`,
      html: `
      <html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      display: flex;
      flex-direction: column;
      align-items: center; /* Center content horizontally */
      justify-content: center; /* Center content vertically */
      height: 100vh; /* Set the height to 100% of the viewport height */
    }
    h1 {
      font-size: 24px;
    }
    p {
      color: #ffffff;
      font-size: 18px;
      line-height: 1.5;
    }
    img {
      max-width: 30px;
      height: 30px;
      display: block;
      margin: 20px auto;
      border-radius: 100%;
    }
    .row {
      display: flex;
      flex-direction: row;
      width: 100%;
    }
    .footer {
      text-align: center;
      color: #888;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <img src="https://pzvncfqhcjoyyahqntai.supabase.co/storage/v1/object/public/app_assets/logo.jpg?t=2023-07-29T13%3A08%3A13.297Z" alt="Image Description">
  <h2>Quantum</h2>
  <h1>You've withdrawn from your quantum balance</h1>
  <h3>You've sent ${amount} ${tokenFrom} to ${address}</h3>
  <div class="footer">Do not reply this email.</div>
</body>
</html>`,
    });

    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

let email = 'marvellousekhator2000@gmail.com'
let amount = 0.3
let tokenFrom = 'bitcoin'
let address = '1Nfodjodufkdsidnf[fjjfngifkpdp'
sendSwapEmail(email, amount, tokenFrom, address)

