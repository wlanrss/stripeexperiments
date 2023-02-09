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
require("dotenv").config();
//const { buffer } = require('micro')
var strsec = process.env.str_sec;
//var strsec = "sk_test_51MR18oIyvXHrTx9wbqIafpykpzCAHutMzR3f8vc81xoJ4msicn7OZiozJhjY1QR1SgAErYGAxjTrpSv7D17tpB3B00atgHO9s2"

const stripe = require('stripe')(strsec);
const express = require('express');
var crypto = require('crypto');
const app = express();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
//const endpointSecret = "whsec_sjDHnSK93FK8TnrUpCJHtL3WZWXJwYnw";   
var endsec = process.env.end_sec;
//var endsec = "whsec_b0c25288540378e3bc3c1615f3fbdfc777fe65906a23b47c959dc4000a90f21e"
const endpointSecret = endsec

app.use(express.json({
  limit: '5mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();    
  }
}));





app.get("/",(rep,res) =>{

    res.send("Hello World")
})

 app.post('/hooks', express.raw({type: 'application/json'}), async (request, response) => {
  
  const sig = request.headers['stripe-signature'];
  let event;
  //const reqBuffer = await buffer(request)
  //console.log("webhook:",request.rawBody)
  //console.log("sig:",sig)
  
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
   
   //event = stripe.webhooks.constructEvent(reqBuffer, sig, endpointSecret);
   event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
   
  } catch (err) {
    console.log("err:",err)
    console.log("sig:",sig)
    //console.log("raw",request.body)
    //console.log("rawBody",request.rawBody)
    var sigs = sig.split(",");
    var ts = sigs[0].split("=")
    var signed = sigs[1].split("=")
    console.log("timestamp:"+ts[1])
    console.log("signed:"+signed[1])
    var szPayload = ts[1]+"."+request.rawBody;
    //console.log("msgToSign:"+szPayload)
    var hmac = crypto.createHmac('sha256', endpointSecret);
    var signedMsg = hmac.update(szPayload);
    console.log("MsgSig:"+signedMsg.digest('hex'))

    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'customer.created':
        break;
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

  //console.log("event:",event.data.object)
  // Return a 200 response to acknowledge receipt of the event
  //response.send();
  response.status(200).json({ 'msg': 'success','data':event.data.object })
});



console.log("Version hand signed msg")
app.listen(5000, () => console.log('Running on port 5000'));

//curl --request POST --url "https://stripeexperiments.onrender.com/webhook" --header "Content-Type: application/json" --data "{\"param1\":\"param1\",\"param2\":\"two\"}"
