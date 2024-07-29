const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripeWebhookRoute = express.Router();

stripeWebhookRoute.post('/stripe/webhook', async(req,res)=>{
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        // case 'checkout.session.completed':
        //     const session = event.data.object;
        //     // Handle successful checkout session
        //     console.log('Checkout session completed:', session);
        //     // Perform actions based on the session details, e.g., update your database
        //     break;
        case 'invoice.payment_succeeded':
            const invoice = event.data.object;
            // Handle successful invoice payment
            console.log('Invoice payment succeeded:', invoice);
            // Perform actions based on the invoice details
            break;
        // Add additional event types as needed
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
})

module.exports = stripeWebhookRoute;