const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User.js')

const stripeRoute = express.Router();

stripeRoute.post('/stripe/create-checkout', async(req,res)=>{
        console.log("in /stripe/create-checkout (POST) to create stripe checkout session")
        const {priceId, userId, successUrl, cancelUrl} = req.body;
        if(!priceId){
            return res.status(400).send("Price ID is required");
        }
        if(!successUrl || !cancelUrl){
            return res.status(400).send("Success and cancel URLs are required");
        }
        
        // const session = await getServerSession(req,res,authOptions);
        const dbUser = await User.findById(userId);
        let stripeCustomerId = dbUser.profileData.stripeCustomerId;
        //CREATING A NEW CUSTOMER IN STRIPE IF USER HAS NOT MADE ANY PREVIOUSE SUBSCRIPTION
        if(!stripeCustomerId){
            console.log("UserID " + dbUser._id+" does not have an associated stripe account. Creating")
            const customer = await stripe.customers.create({
                email: dbUser.accountData.email,
                name: dbUser.accountData.email
            });
            stripeCustomerId = customer.id;
            console.log("Saving stripeID: "+ stripeCustomerId+"to UserID: " + dbUser._id );
            //UPDATE corresponding user in database to contain stripeCustomerId
            dbUser.profileData.stripeCustomerId = stripeCustomerId;
            await dbUser.save();
        }
        const requiredParamater = {
            success_url: successUrl,
            cancel_url: cancelUrl,
            mode: 'subscription',
            client_reference_id: userId,
            line_items:[{
                price: priceId,
                quantity: 1
            }],
            // customer_email: session.user.email,
            customer: stripeCustomerId
        };
        const extraParameter = {
            allow_promotion_codes: true,
            consent_collection: {
                terms_of_service: 'required'
            },
            expires_at: Math.floor(Date.now() / 1000) + (60 * 30),
            metadata:{
                paymentProcessed: 'false'
            },
            subscription_data: {
                metadata: {
                  sessionId: '{{CHECKOUT_SESSION_ID}}'
                }
              }            
        };       
        try{
            const stripeCheckoutSession = await stripe.checkout.sessions.create({
                ...requiredParamater,
                ...extraParameter
            });
            return res.status(200).json({
                url: stripeCheckoutSession.url,
                checkoutSessionId: stripeCheckoutSession.id
            });
        }catch(err){
            console.log(err.message)
            return res.status(500).send("Unexpected Error occured while creating stripe checkout session: " + err.message);
        }
    }
)

stripeRoute.get('/stripe/session/:sessionID', async(req,res)=>{
    console.log("in /stripe/session/:sessionID checkin Payment Status")
    const sessionID = req.params.sessionID;
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionID);
        res.status(200).json({ paymentProcessed: session.metadata.paymentProcessed });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

})    

stripeRoute.post('/stripe/create-customer-portal', async (req, res) => {
    console.log("in /stripe/create-customer-portal (POST) to create stripe customer portal session"); 
    return res.status(200).json({ url:'https://www.google.com' })
//     const { userId, returnUrl } = req.body;

//     const dbUser = await User.findById(userId);
//     let stripeCustomerId = dbUser.profileData.stripeCustomerId;

//     if (!stripeCustomerId) {
//         return res.status(400).send('User does not have a Stripe customer ID');
//     }
//     if (!returnUrl) {
//         return res.status(400).send("Return URL is required");
//     }
//     if (!stripeCustomerId) {
//         return res.status(400).send("User does not have a Stripe customer ID.");
//     }
//     try {
//         const portalSession = await stripe.billingPortal.sessions.create({
//             userId: stripeCustomerId,
//             return_url: returnUrl
//         });
//         return res.status(200).json({
//             url: portalSession.url
//         });

//     } catch (err) {
//         console.log("Error creating Stripe Customer Portal session:", err.message);
//         return res.status(500).send("Unexpected error occurred while creating customer portal session: " + err.message);
//     }
});

module.exports = stripeRoute;