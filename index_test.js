const stripe = require("stripe")("sk_test_51MR18oIyvXHrTx9wbqIafpykpzCAHutMzR3f8vc81xoJ4msicn7OZiozJhjY1QR1SgAErYGAxjTrpSv7D17tpB3B00atgHO9s2");
 
const express = require('express')
 
const bodyparser = require('body-parser')

const app = express()

app.post('/hooks',bodyparser.raw({type:'application/json'}),async(req, res) => {
  const payload = req.body
  const sig = req.headers['stripe-signature']
  const endpointsecret = "whsec_b0c25288540378e3bc3c1615f3fbdfc777fe65906a23b47c959dc4000a90f21e";
  let event;

  try {

      event = stripe.webhooks.constructEvent(payload,sig,endpointsecret)
      
  } catch (error) {
      console.log(error.message)
      res.status(400).json({ success: false })
      return;
  }
  console.log(event.type)
  console.log(event.data.object)
  console.log(event.data.object.id)
  res.json({
   success:true
  })
})


app.listen(5000, () => {
    console.log("App is listening on port 5000")
})

