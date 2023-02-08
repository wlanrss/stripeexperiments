// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

const stripe = require('stripe')("sk_test_51MR18oIyvXHrTx9wbqIafpykpzCAHutMzR3f8vc81xoJ4msicn7OZiozJhjY1QR1SgAErYGAxjTrpSv7D17tpB3B00atgHO9s2");
const express = require('express');
const app = express();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
//const endpointSecret = "whsec_sjDHnSK93FK8TnrUpCJHtL3WZWXJwYnw";   
const endpointSecret = "whsec_b0c25288540378e3bc3c1615f3fbdfc777fe65906a23b47c959dc4000a90f21e"
//we_1MYwjsIyvXHrTx9w6yB1iLnY

app.use(express.json({
  limit: '5mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

app.get("/",(rep,res) =>{

    res.send("Hello World")
})

app.post('/hooks', express.raw({type: 'application/json'}), (request, response) => {
  
  const sig = request.headers['stripe-signature'];
  let event;
  console.log("webhook:",sig)
  
  try {
   // event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
   event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
   
  } catch (err) {
    console.log("err:",err)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'account.external_account.created':
      const accountExternalAccountCreated = event.data.object;
      // Then define and call a function to handle the event account.external_account.created
      break;
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object;
      // Then define and call a function to handle the event checkout.session.expired
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  console.log("event:",event.data.object)
  // Return a 200 response to acknowledge receipt of the event
  //response.send();
  response.status(200).json({ 'msg': 'success','data':data })
});

console.log("Version 2.1")
app.listen(5000, () => console.log('Running on port 5000'));

//curl --request POST --url "https://stripeexperiments.onrender.com/webhook" --header "Content-Type: application/json" --data "{\"param1\":\"param1\",\"param2\":\"two\"}"
