// import Stripe from "stripe";
// import User from "../backend/models/User.js"


// // This is used to create a Stripe Checkout for one-time payments. It's usually triggered with the <ButtonCheckout /> component. Webhooks are used to update the user's state in the database.
// export const createCheckout = async ({ priceId, successUrl, cancelUrl, clientReferenceID, email}) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//   console.log(clientReferenceID)
//   const dbUser = await User.findById(clientReferenceID);
//   console.log(dbUser)
//   return "https://www.google.com"
// };

// // This is used to create Customer Portal sessions, so users can manage their subscriptions (payment methods, cancel, etc..)
// export const createCustomerPortal = async ({ customerId, returnUrl }) => {
//   try {
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//     const portalSession = await stripe.billingPortal.sessions.create({
//       customer: customerId,
//       return_url: returnUrl,
//     });

//     return portalSession.url;
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// };

// // This is used to get the uesr checkout session and populate the data so we get the planId the user subscribed to
// export const findCheckoutSession = async (sessionId) => {
//   try {
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//     const session = await stripe.checkout.sessions.retrieve(sessionId, {
//       expand: ["line_items"],
//     });

//     return session;
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// };
