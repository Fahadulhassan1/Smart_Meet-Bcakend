const User = require("../model/user");
const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js");

const DOMAIN = "sandbox2b916e76cd2a4252857fd06f12630f01.mailgun.org";
const mg = mailgun({
  apiKey: "088d7659afeda9959ea720c34d614879-64574a68-44a35e8d",
  domain: DOMAIN,
});

exports.signup = (req, res) => {
  console.log(req.body);
  const { name, username, PhoneNumber, email, dateOfBirth, password } =
    req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res
        .status(400)
        .json({ error: "user with this emial id is already exists" });
    }
    const token = jwt.sign(
      { name, username, PhoneNumber, email, dateOfBirth, password },
      "fahad123",
      { expiresIn: "20m" }
    );

    const data = {
      from: "noreply@hello.com",
      to: email,
      subject: "Account activation link",
      html: `
     <h2>Please click on given link to activate the account</h2>
     <p>http://localhost:3000/authentication/activate/${token}</p>
 
     `,
    };
    mg.messages().send(data, function (error, body) {
      if (error) {
        return res.json({
          error: "wrong",
        });
      }
      return res.json({
        message: "email has been sent , kindly activate your account",
      });
    });
  });
};
exports.activateAccount = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, "fahad123", function (err, decodeToken) {
      if (err) {
        return res.status(400).json({ error : "incorect or expired link" });
      }
      const { name, username, PhoneNumber, email, dateOfBirth, password } =
        decodeToken;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          return res
            .status(400)
            .json({ error: "user with email already exixist" });
        }
        let newUser = new User({
          name,
          username,
          PhoneNumber,
          email,
          dateOfBirth,
          password,
        });
console.log(newUser);
        newUser.save((err, sucess) => {
          if (err) {
            return res
              .status(400)
              .json({ error: "error in activating account" });
          }
          res.json({ message: "signup successful" });
        });
      });
    });
  } else {
    return res.json({ error: "something went wrong" });
  }
};
