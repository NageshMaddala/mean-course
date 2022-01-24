// check whether we are authenticated or not
// it uses jwt to validate the request
// steps:
// 1. Token is valid/token is attached
// 2. Validate the Token - use jwt to validate the token
// 3. just add this middleware in all the route
// 4. All the client requests should pass this token
//    There are 2 possible ways
//      1. manually add header to the all requests which requires guarding
//      2. Or create http interceptor to accomplish the same requirement

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  try {
    // bearer token
    const token = req.headers.authorization.split(" ")[1];
    // write code to validate the token
    // if below verify doesn't throw error then its valid
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    // req will be passed to the next middleware
    // so add decodedToken to this req object and pass it to next middleware
    // Token already contails user id and email
    // so decodedToken contains this infomration, so just pass it via req object
    // create new dynamic property on req object and add this information, just make sure don't override
    // the existing property
    //console.log(decodedToken);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
}
