// module.exports = router;
require('dotenv').config();
const env = process.env;
const express = require("express");
const app = express();
const stripe = require("stripe")('sk_test_09l3shTSTKHYCzzZZsiLl2vA');
const console = require("console");
const request = require("request");
const API_KEY = "Bearer "+env.secretKey;
const BASE_URL = "https://api.test.fincode.jp";
const endpoint = {
  payments: "/v1/payments",     // 決済登録
  customers: "/v1/customers",   // 顧客登録
};


app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
  
});

app.get("/publicKey", async (req, res) => {
  res.send({
    publicKey: env.publicKey,
  });
  
});


/**決済登録を行う
 * amount 金額
 */
app.post("/create-payment", async (req, res) => {
  const DATA = {
    pay_type: "Card",          // 決済種別
    job_code: "AUTH",      // 処理区分(有効性チェック=CHECK、仮売上=CAPTURE、売上確定=AUTH)
    amount: req.body.amount,  // 金額。有効性チェック以外で必須
  };
  const options = {
    url: BASE_URL + endpoint.payments,
    // proxy: PROXY_URL,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: API_KEY,
    },
    json: DATA,
  }
    
  // fincodeに決済登録のAPIを投げる
  request.post(options, (error, response, body) => {
    if (200 != response.statusCode) {
      console.log("ERROR");
      console.log(body);
    } else {
      console.log("SUCCESS");
      console.log(body);
      }

    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(body);
    }
  );  
});

/**顧客登録を行う
 * name 顧客名
 */
 app.post("/create-customer", async (req, res) => {
  const DATA = {
    name: req.body.name,
    email: "test.sample.yamada@test.test",
    addr_city: "港区",
  };
  const options = {
    url: BASE_URL + endpoint.customers,
    // proxy: PROXY_URL,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: API_KEY,
    },
    json: DATA,
  }
    
  // fincodeに顧客登録のAPIを投げる
  request.post(options, (error, response, body) => {
    if (200 != response.statusCode) {
      console.log("ERROR");
      console.log(body);
    } else {
      console.log("SUCCESS");
      console.log(body);
    }

    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(body);
    }
  );  
});


app.listen(4242, () => console.log("Node server listening on port 4242!"));

