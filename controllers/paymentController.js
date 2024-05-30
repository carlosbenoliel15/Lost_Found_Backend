const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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