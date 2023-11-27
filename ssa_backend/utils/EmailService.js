const nodemailer = require('nodemailer');

class EmailService {
  #transporter = null;

  constructor(config) {
    const service = config?.service || process.env.NODEMAILER_SERVICE;
    const user = config?.user || process.env.NODEMAILER_USER;
    const pass = config?.pass || process.env.NODEMAILER_PASSWORD;
    console.log({ service, user, pass });

    const transporter = nodemailer.createTransport({
      host: service,
      secureConnection: false, // TLS requires secureConnection to be false
      port: 587, // port for secure SMTP
      tls: {
        ciphers: 'SSLv3',
      },
      auth: { user, pass },
    });

    this.#transporter = transporter;
  }

  async sendMail(mailOptions) {
    console.log(mailOptions.from);
    console.log(mailOptions.to);
    console.log(mailOptions.subject);

    return this.#transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService;
