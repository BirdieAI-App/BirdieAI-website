import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebhookRoute = express.Router();

stripeWebhookRoute.post('/stripe/webhook', async (req, res) => {

    const event = req.body;
    // Handle the event
    switch (event.type) {
        case 'invoice.payment_succeeded':
            console.log("in invoice.payument_suceeded event")
            await handleAccessGrant(event.data.object);
            await updateSessionMetadata(event.data.object.subscription);

            break;
        case 'invoice.payment_failed':
        case 'customer.subscription.deleted':
            await handleAccessRevoke(event.data.object);
            break;

        case 'checkout.session.completed':
            //case to store checkout sessionID into subscription
            console.log("in checkout.session.completed event")
            const session = event.data.object;
            if (session.subscription) {
                await stripe.subscriptions.update(session.subscription, {
                    metadata: {
                        sessionId: session.id
                    }
                });
            }
        default:
            console.log(`   Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
})

async function handleAccessGrant(invoice) {
    try {
        const filter = { "profileData.stripeCustomerId": invoice.customer };
        let update;
        const type = invoice.lines.data[0].plan.interval;
        if (type === 'month') {
            update = { "profileData.subscriptionTier": "Monthly" };
        } else if (type === 'year') {
            update = { "profileData.subscriptionTier": "Annually" };
        }
        const option = { "new": true };
        const user = await User.findOneAndUpdate(filter, update, option);
        if (!user) {
            console.log("No user was found with Stripe Customer ID:", invoice.customer);
        } else {
            console.log(`Granted access ${type} to chatBot for userID: ${user._id}`);
        }
    } catch (err) {
        console.error("Error in handleAccessGrant:", err.message);
    }
}

async function handleAccessRevoke(invoice) {
    try {
        const filter = { "profileData.stripeCustomerId": invoice.customer };
        const update = { "profileData.subscriptionTier": "Free" };
        const option = { "new": true };
        const user = await User.findOneAndUpdate(filter, update, option);
        if (!user) {
            console.log("No user was found with Stripe Customer ID:", invoice.customer);
        } else {
            console.log("Revoked access to chatBot for userID:", user._id);
        }
    } catch (err) {
        console.error("Error in handleAccessRevoke:", err.message);
    }
}

async function updateSessionMetadata(subscriptionId) {
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const session = await stripe.checkout.sessions.retrieve(subscription.metadata.sessionId);
        const updated = await stripe.checkout.sessions.update(session.id, {
            metadata: { paymentProcessed: 'true' }
        });
    } catch (err) {
        console.error("Error updating session metadata:", err.message);
    }
}

export default stripeWebhookRoute;