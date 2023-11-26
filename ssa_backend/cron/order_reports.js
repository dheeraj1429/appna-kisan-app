const fs = require('fs');
const path = require('path');
const handlebar = require('handlebars');
const Order = require('../modals/Orders');
const EmailService = require('../utils/EmailService');

const sendPendingOrdersReportToEmail = async () => {
  try {
    console.log('Sending email...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentTime = new Date();

    const ordersRes = await Order.aggregate([
      {
        $match: {
          order_status: 'pending',
          createdAt: { $gte: today, $lte: currentTime },
        },
      },
      {
        $facet: {
          count: [{ $count: 'count' }],
          orders: [
            {
              $unwind: {
                path: '$products',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $sort: {
                createdAt: -1,
                'products._id': 1,
              },
            },
            {
              $project: {
                order_id: 1,
                customer_id: 1,
                customer_name: 1,
                customer_phone_number: 1,
                customer_email: 1,
                order_status: 1,
                products: 1,
              },
            },
          ],
        },
      },
    ]);

    const orders = ordersRes?.[0].orders ?? [];
    const totalOrdersPending = ordersRes?.[0]?.count?.[0]?.count ?? 0;

    handlebar.registerHelper('getProductImage', function (images) {
      if (Array.isArray(images) && images.length > 0) {
        return images[0].image_url;
      }

      return '/path/to/default/image.jpg';
    });

    const templatePath = path.join(
      __dirname,
      '../templates/pending_order_email.hbs'
    );

    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebar.compile(source);

    const email = template({
      orders,
      totalOrdersPending,
      reportGenerationDate: new Date().toLocaleString(),
    });

    const emailService = new EmailService();

    const emailSend = await emailService.sendMail({
      from: process.env.NODEMAILER_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Pending Orders Report',
      html: email,
    });

    console.log('Email sent', { emailSend });
  } catch (error) {
    console.log('Sending error failed! ', error);
  }
};

module.exports = { sendPendingOrdersReportToEmail };
