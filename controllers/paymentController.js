const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const {AuctionModel, BidModel, PaymentModel} = require('../models/Auction');
const {BidderModel} = require('../models/User');


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

//============================================================================payment info================================================================================================
exports.createPaymentInfo = async (req, res) => {
    try {
        const paymentVerify = await PaymentModel.findOne({paymentUser: req.body.paymentUser, paymentAuction: req.body.paymentAuction});
        if (paymentVerify){
            return res.status(400).json({error: "Payment already exists"});
        }

        const auction = await AuctionModel.findById(req.body.paymentAuction);
        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        }
        else if (auction.status === 'Open'){
            return res.status(400).json({error: "Auction is still open"});
        }
        else if (auction.status === 'Closed' && !auction.winnerBid){
            return res.status(400).json({error: "Auction is closed but no winner bid not found"});
        }

        const bid = await BidModel.findById(auction.winnerBid); 

        const bidder = await BidderModel.findById(req.body.paymentUser);
        if (!bidder){
            return res.status(400).json({error: "Bidder not found"});
        }
        else if (!bidder._id.equals(bid.bidder)){
            return res.status(400).json({error: "This user don't have the winning bid for this auction"});
        }

        const paymentInfo = {}
        paymentInfo.paymentUser = req.body.paymentUser;
        paymentInfo.paymentAuction = req.body.paymentAuction;
        paymentInfo.paymentValue = auction.winnerBid.value;

        const payment = new PaymentModel(paymentInfo);
        await payment.save();
        res.status(200).json({message: "Payment info created"});
    } catch (error) {
        res.status(400).json({error: "Payment info not created"});
    }
}

exports.getPaymentInfoById = async (req, res) => {
    try {
        const payment = await PaymentModel.findById(req.params.id);
        if (!payment){
            return res.status(400).json({error: "Payment info not found"});
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({error: "Payment info not found"});
    }
}

exports.getPaymentInfoByUser = async (req, res) => {
    try {
        const payments = await PaymentModel.find({paymentUser: req.params.userid});
        if (!payments){
            return res.status(400).json({error: "Payment info not found"});
        }

        
        res.status(200).json(payments);
    }
    catch (error) {
        res.status(400).json({error: "Payment info not found"});
    }
}