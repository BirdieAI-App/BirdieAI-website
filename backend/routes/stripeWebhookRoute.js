const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User.js');

const stripeWebhookRoute = express.Router();

stripeWebhookRoute.post('/stripe/webhook', async(req,res)=>{
    
    const event = req.body;
    // Handle the event
    switch (event.type) {
        case 'invoice.payment_succeeded':
            await handleAccessGrant(event.data.object);
            break;
        case 'invoice.payment_failed':
        case 'customer.subscription.deleted':
            await handleAccessRevoke(event.data.object);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
})

async function handleAccessGrant(invoice) {
    try {
        const filter = {"profileData.stripeCustomerId": invoice.customer};
        const update = {"profileData.hasAccess": true};
        const option = {"new": true};
        const user = await User.findOneAndUpdate(filter, update, option);
        if (!user) {
            console.log("No user was found with Stripe Customer ID:", invoice.customer);
        } else {
            console.log("Granted access to chatBot for userID:", user._id);
        }
    } catch (err) {
        console.error("Error in handleAccessGrant:", err.message);
    }
}

async function handleAccessRevoke(invoice) {
    try {
        const filter = {"profileData.stripeCustomerId": invoice.customer};
        const update = {"profileData.hasAccess": false};
        const option = {"new": true};
        const user = await User.findOneAndUpdate(filter, update, option);
        if (!user) {
            console.log("No user was found with Stripe Customer ID:", invoice.customer);
        } else{
            console.log("Revoked access to chatBot for userID:", user._id);
        }
    } catch (err) {
        console.error("Error in handleAccessRevoke:", err.message);
    }
}


module.exports = stripeWebhookRoute;