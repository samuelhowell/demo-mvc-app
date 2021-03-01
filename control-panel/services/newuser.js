exports.addNewUser = async (req) => {
  const MongoClient = require('mongodb');
  const dbUrl = process.env.DB_CONNECTION;
  const sha = require('../controllers/shaController');
  const csprng = require('csprng');
  const User = require('../models/user');
  const { body,validationResult } = require('express-validator');
  const auth = require('../controllers/authController');

  body('email').isEmail().normalizeEmail({all_lowercase: true}).isLength({ min: 5 });
  body('username').not().isEmpty().trim().isLength({ min: 3 });
  body('fname').not().isEmpty().trim().isLength({ min: 2 });
  body('lname').not().isEmpty().trim().isLength({ min: 2 });
  body('pass').not().isEmpty().trim().isLength({ min: 8 });
  body('role').not().isEmpty().trim();

  const errors = validationResult(req);

  return new Promise((resolve, reject) => {

  if (errors.isEmpty()) {

   auth.findByUsername(req.body.username.toLowerCase(), function (err, user) {

     if (user) {

       const error = new Error('user exists');
       console.log(error)
       resolve(error);

      } else {

        console.log('validation passed');

        MongoClient.connect(dbUrl, (error, database) => {

          if (error) return process.exit(1);
          console.log('Connection is okay');

          const db = database.db(process.env.DB)
          const collection = db.collection('users');

            const salt = csprng(160, 36);
            req.body.pass = sha.hash(`${salt}${req.body.pass}`);
            const role = req.body.admin ? 'admin' : 'normie';


            const user = new User(
              {
              fname: req.body.fname,
              lname: req.body.lname,
              username: req.body.username.toLowerCase(),
              email: req.body.email,
              pass: req.body.pass,
              role: role,
              salt: salt,
              });

              collection.insertOne(
                user,
                (err, r) => {
                  if (err) {
                    console.log(err);
                    resolve(err);
                  }
                 else {
                  resolve('user added');
                }
              }
              );
        });
      }
   });

  } else {
    resolve(new Error('validation failed'));
  }

});

}