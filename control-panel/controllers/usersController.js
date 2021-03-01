const MongoClient = require('mongodb');
const dbUrl = process.env.DB_CONNECTION;

exports.addUser = async (req, res, next) => {

  if(req.user.role === 'admin') {

    const {addNewUser} = require('../services/newuser');
    const {sendEmail} = require('../services/email');

    const userEmail = req.body.email;
    let body = `<h1>Sam's demo app</h1><p>Hi ${req.body.fname}, <br><br>`;
    body += `Demo control panel: https://democp.samhowell.dev/</br>`;  
    body += `username: ${req.body.username.toLowerCase()} <br>`;
    body += `password: ${req.body.pass} <br><br>`;
    body += `This email was automatically generated at signup.</p>`;
    const subject = 'Sam\'s Node demo control panel user registration';

    const result = await addNewUser(req);
    console.log('result '+ result)
    if (result instanceof Error) {

      console.log(result)
      const alert = encodeURIComponent('Error: ' + result);
      res.redirect('/users?alert=' + alert);

    } else {

      await sendEmail(userEmail, subject, body);
      const alert = encodeURIComponent('New user ' + req.body.username + ' successfully added');
      res.redirect('/users?alert=' + alert);

    }
  }

}

exports.index = function(req, res, next) {
    const alert = req.query.alert;
    MongoClient.connect(dbUrl, (error, database) => {
      if (error) return;
      console.log('DB Connection in usersController is good');
      const db = database.db(process.env.DB)
      const collection = db.collection('users');

      collection.find().toArray((err, users) => {
        res.render('pages/users', { user: req.user, users: users, alert: alert });
      });
    });
}
