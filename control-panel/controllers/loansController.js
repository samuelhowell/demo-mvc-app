const MongoClient = require('mongodb');
const dbUrl = process.env.DB_CONNECTION;
const sha = require('../controllers/shaController');
const csprng = require('csprng');
const { body,validationResult } = require('express-validator');


exports.index = (req, res, next) => {
 
    const alert = req.query.alert;
    MongoClient.connect(dbUrl, (error, database) => {
      if (error) return;
      console.log('DB Connection in loansController is good');
      const db = database.db(process.env.DB)
      const collection = db.collection('loans');

      collection.find().toArray((err, loans) => {
        res.render('pages/loans', { user: req.user, loans: loans, alert: alert });
      });
    });

}

exports.chartWidget = (req, res) => {

    MongoClient.connect(dbUrl, async(error, database) => {
      if (error) return;
      console.log('DB Connection in cartWidget is good');
      const db = database.db(process.env.DB)
      const collection = db.collection('loans');

      const approved = await collection.count({status: 'approved'});
      const denied = await collection.count({status: 'denied'});
      console.log({denied: denied, approved: approved});
      res.json({denied: denied, approved: approved});
    });
}

exports.processLoan = async (email) => {

const status = Math.random() >= 0.5 ? 'approved' : 'denied';
  console.log('loan status: ' + status);
  await MongoClient.connect(dbUrl, async (error, database) => {
    const db = database.db(process.env.DB)
    const collection = db.collection('loans');
    await collection.findOneAndUpdate({email: email},{$set:{status: status}});
  })

}

exports.findLoan = (req, res, next) => {

  return  new Promise((resolve, reject) => {

    MongoClient.connect(dbUrl, async (error, database) => {

      if (error) {
        resolve(error);
      };

      console.log('DB Connection in loansController is good');
      const db = database.db(process.env.DB)
      const collection = db.collection('loans');

        // check if applicant has applied before
        const getLoans = new Promise((resolve, reject) => {
          collection.find().toArray((err, loans) => {
          resolve(loans);
         });
        });

        const loanRecords = await getLoans;
        let status;
        for (let i = 0, len = loanRecords.length; i < len; i++) {
          if (loanRecords[i].loanid.toLowerCase() === req.params.id.toLowerCase()) {
            status = loanRecords[i].status;
          }
        }

        if(status){
          resolve({success:true, status:status});
        } else {
          resolve({success:false, mssg: 'loan application id not found'});
        }

    });
  });

}

exports.postLoanApp = async (req) => {
  const Loan = require('../models/loan');
  body('name').not().isEmpty().trim().isLength({ min: 5 });
  body('email').isEmail().normalizeEmail({all_lowercase: true}).isLength({ min: 5 });
  body('ssn').not().isEmpty().trim().isLength({ min: 2 });
  body('amount').not().isEmpty().isNumeric().trim().isLength({ min: 4 });

  const errors = validationResult(req);

return  new Promise((resolve, reject) => {
    if (errors.isEmpty()) {
      console.log('loan validation passed');

      MongoClient.connect(dbUrl, async (error, database) => {
        if (error) {
          resolve(error);
        };

        console.log('Connection is okay');

        const db = database.db(process.env.DB);
        const collection = db.collection('loans');


        // check if applicant has applied before
        const getLoans = new Promise((resolve, reject) => {
          collection.find().toArray((err, loans) => {
          resolve(loans);
         });
        });

        const loanRecords = await getLoans;
        let applicantFound = 0;
        for (let i = 0, len = loanRecords.length; i < len; i++) {
          let loan = loanRecords[i];
          if (loan.email === req.body.email) {
            applicantFound++;
          }
        }

        if(applicantFound > 0){
          resolve({success:false, emailfound:true, mssg:'email already exists'});
        } else {

          // make unique loan id
          const today = new Date();
          const dd = String(today.getDate()).padStart(2, '0');
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const yyyy = today.getFullYear();
          const loan_id = mm + dd + yyyy + req.body.email;

          // salt and hash ssn
          const salt = csprng(160, 36);
          const ssn = sha.hash(`${salt}${req.body.ssn}`);
          console.log(req.body);

          // make new loan entry object
          const loan = new Loan(
            {
            loanid: loan_id,
            name: req.body.name,
            email: req.body.email,
            ssn: ssn,
            amount: req.body.amount,
            status: 'pending',
            salt: salt,
            });


          // insert into collection
          collection.insertOne(
            loan,
            (err, r) => {
              if (err) {
                console.log(err);
                resolve({success:false});
              } else {
                resolve({success:true, loanid: loan_id, mssg:'loan application successful'});
              }
            }
          );
        }

      });
    }

  });
}
