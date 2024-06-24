const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const nodemailer = require('nodemailer');
const {AuctionModel, BidModel, PaymentModel} = require('../models/Auction');
const {BidderModel, OwnerModel, UserModel, PoliceOfficerModel} = require('../models/User');
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/config");
const {LostObjectModel, FoundObjectModel} = require("../models/Object");
const {PoliceStationModel} = require("../models/Police");


exports.payment = async (req, res) => {
    try {
        const product = req.body;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', "paypal"],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: product.name,
                            images: [product.image],
                        },
                        unit_amount: Math.round(product.price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: process.env.URL_APP + '/profile/profile/?success=true&auctionId=' + jwt.sign({auctionId: product.auctionId}, process.env.STRIPE_API_KEY),
            cancel_url: process.env.URL_APP + '/profile/profile/?success=false',
        });
        res.json({id: session.id});
    } catch (error) {
        res.status(400).json({error: "Payment not created"});
    }
}
exports.checkPayment = async (req, res) => {
    try {
        const auction = req.params.auctionId;
        const payment = await PaymentModel.findOne({paymentAuction: auction});
        if (!payment){
            return res.status(200).json({
                "paid": false,
                "payment": null
        });
        }
        res.status(200).json(
            {
                "paid": true,
                "payment": payment
            }
        );
    } catch (error) {
        res.status(400).json({error: "Payment info not found"});

    }

}

exports.webhook = async (req, res) => {
  const event = request.body;
    console.log(event)

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
        const auctionId = jwt.decode(req.body.auctionId)?.auctionId
        const auction = await AuctionModel.findById(auctionId);
        const auctionWinnerBid = await BidModel.findById(auction.winnerBid);
        const paymentObject = {
            paymentUser: auctionWinnerBid.bidder,
            paymentAuction: auctionId,
            paymentValue: auctionWinnerBid.value
        }
        const bidder = await BidderModel.findById(auctionWinnerBid.bidder);

        const paymentVerify = await PaymentModel.findOne(paymentObject);
        if (paymentVerify){
            return res.status(400).json({error: "Payment already exists"});
        }

        if (!auction){
            return res.status(400).json({error: "Auction not found"});
        }
        else if (auction.status === 'Open'){
            return res.status(400).json({error: "Auction is still open"});
        }
        else if (auction.status === 'Closed' && !auction.winnerBid){
            return res.status(400).json({error: "Auction is closed but no winner bid not found"});
        }


        if (!auctionWinnerBid.bidder){
            return res.status(400).json({error: "Bidder not found"});
        }


        const payment = new PaymentModel(paymentObject);
        await payment.save();

        const foundObject = await FoundObjectModel.findById(auction.foundObject);
        if (!foundObject) {
            return res.status(404).json({ error: 'FoundObject not found' });
        }

        const user = await UserModel.findById(bidder.user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const policeOfficer = await PoliceOfficerModel.findById(foundObject.policeOfficerThatReceived);
        if (!policeOfficer) {
            return res.status(404).json({ error: 'PoliceOfficer not found' });
        }
        const policeStation = await PoliceStationModel.findById(policeOfficer.station);
        if (!policeStation) {
            return res.status(404).json({ error: 'PoliceStation not found' });
        }

        //send an email to the owner of the lost object
        let transporter = nodemailer.createTransport({
            service: 'gmail', // or use another email service
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        var text = `Hi ${user.first_name} ${user.last_name},\n Your payment was successful for the delivered object ${foundObject.title}.\nGo to ${policeStation.name}, ${policeStation.address}, ${policeStation.zip_code} to get your object back. Present this code: \nFound Object: ${foundObject._id}`;
        var line1 = `Hi ${user.first_name} ${user.last_name},`
        var line2 = `Your payment was successful for the delivered object ${foundObject.title}.`
        var line3 = `Go to ${policeStation.name}, ${policeStation.address}, ${policeStation.zip_code} to get your object back.`
        var line4 = `Present this code:`
        var line5 = `Found Object: ${foundObject._id}`

        let mailOptions = {
            from: "no-reply@bidfinder.ddns.net",
            to: user.email,
            subject: "Match accepted",
            text: text,
            html: `
      <p>${line1}</p>
      <p>${line2}</p>
      <p>${line3}</p>
      <p>${line4}</p>
      <p>${line5}</p>
      <img src="cid:unique@icon.cid" alt="Icon" />`,
            attachments: [
                {
                    filename: 'icon.png',
                    path: 'logo.png',
                    cid: 'unique@icon.cid'
                }
            ]
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({message: "Payment info created"});
    } catch (error) {
        console.log(error)
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