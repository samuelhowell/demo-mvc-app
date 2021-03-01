const express = require('express');
const app = express();
const fetch = require('node-fetch');
require('dotenv').config();
const port = process.env.PORT || 8083;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/apply/', (req, res) => {

const body = {
  "name": req.body.name,
  "email": req.body.email,
  "ssn": req.body.ssn,
  "amount": req.body.amount,
};

fetch('https://democp.samhowell.dev/api/loans/', {
        method: 'POST',
        body:    JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.API_KEY}`
        },
    })
    .then(res => res.json())
    .then(json => {
      // console.log(json);
      res.send(json);
    });

});

app.get('/status/:id', (req, res) => {
// console.log('server loan id ' + req.body.loanid);
fetch(`https://democp.samhowell.dev/api/loans/${req.params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.API_KEY}`
        },
    })
    .then(res => res.json())
    .then(json => {
      // console.log(json);
      res.send(json);
    });

});

app.listen(port, () => {
  console.log(`Loan App landing page demo app on port: ${port}`)
})