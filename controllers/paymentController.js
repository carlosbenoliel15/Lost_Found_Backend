const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

exports.payment = async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        // line_items: [
        //   //product data
        //   {
        //     price_data: {
        //         //price currency
        //         currency: 'usd',
        //         //product data
        //         product_data: {
        //             //product name
        //             name: 'T-shirt',
        //         },
        //         //price in cents
        //         unit_amount: 2000,
        //     },
        //     quantity: 1,
        //   },
        // ],
        line_items: req.body,
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/cancel`,
      });
    
      res.send({url: session.url});
};

exports.webhook = async (req, res) => {
  const event = request.body;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('PaymentMethod was attached to a Customer!');
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({received: true});
}

exports.sendEmail = async (req, res) => {
  const to = req.body.to;
  const subject = req.body.subject;
  const text = req.body.text;

    // Create a transporter object using SMTP transport.
    let transporter = nodemailer.createTransport({
        service: 'gmail', // or use another email service
        auth: {
            user: "bidfinderEmail@gmail.com",
            pass: "ljin oklh rrdr ieyd"
        }
    });

    // Set up email data
    let mailOptions = {
        from: '"no-reply@bidfinder.ddns.net" <duartegvmiranda@gmail.com>',
        to: to,
        subject: subject,
        text: text
    };

    // Send mail with defined transport object
    try {
        let info = await transporter.sendMail(mailOptions);

        res.status(200).send(`Email sent: ${info.response}`);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
}