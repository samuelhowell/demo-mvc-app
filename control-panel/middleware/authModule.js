const jwt = require('jsonwebtoken');

exports.authApi = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if(authHeader){

    const token = authHeader.split(' ')[1];
    //res.send(token);
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(err);
      if (err) return  res.sendStatus(401); //res.send(err, token);
      req.user = user;
      next();
    })
  } else {
    return res.sendStatus(401);
  }

}

// exports.genJwt = (user) => {
//   return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '28800s' });
// }

exports.isLoggedIn = (req, res, next) => {
  // passport adds this to the request object
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}