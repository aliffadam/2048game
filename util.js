var jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
   console.log(req.headers.authorization)
   const tokens = req.headers.authorization.split(' ')
   console.log(tokens)

   if(tokens[1] == null) {
      res.status(401).send('Invalid token')
   }

   jwt.verify(tokens[1], 'very-strong-password', function (err, decoded) {
      if(err) {
         res.status(401).send('Invalid token')
      }

      req.user = decoded

      next()
   })
}