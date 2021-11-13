const User = require("../model/user");
// const jwt = require("jsonwebtoken");

// var nodemailer = require("nodemailer");
// const qrcode = require("qrcode");
const _ = require("lodash");

exports.signup = async (req, res) => {
  
    var { firstName, lastName, username, PhoneNumber, email, dateOfBirth, password, avatar } =
      req.body;
   
  
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res
        .status(400)
        .json({ error: "user with this emial id is already exists" });
    }
    let newUser = new User({
      firstName,
      lastName,
      username,
      PhoneNumber,
      email,
      dateOfBirth,
      password,
      avatar,
    });
    console.log(newUser);
    newUser.save((err, sucess) => {
      if (err) {
        return res.status(400).json({ error: err.message});
      }
      res.json({ message: "signup successful" });
    });
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      if (user.email == email && user.password == password) {
        return res.status(200).json({ success: "user signedin" });
      }
      return res.status(400).json({ error: "wrong email or password" });
    }
    return res.status(400).json({ error: "user does not exist" });
  });
};

exports.forgetPassword = function (req, res) {
  const { email, newpass } = req.body;
  console.log("done");
  if (newpass.length < 8) {
    return res
      .status(400)
      .json({ error: "password length less than 8 characters!!!" });
  }
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "user does not exist" });
    }
    const obj = {
      password: newpass,
    };
    user = _.extend(user, obj);
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: "reset password error" });
      } else {
        return res
          .status(200)
          .json({ message: "password changed , please login" });
      }
    });
  });
};
exports.profilepicture = async (req, res) => {
  try {
    const users = await User.findById(req.params.id);
    if (!users || !users.avatar) {
      throw new Error("image does not exist");
    }
    res.set("Content-Type", "image/jpg");
    res.send(users.avatar);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateProfile = async (req, res) => {
  console.log(req.body.id);
  try {
    var { id, firstName, lastName, avatar } = req.body;
    console.log(id);
    console.log(lastName)
    if (avatar === undefined || avatar === null || avatar == "") {
      var avat = await User.findById(id);
      avatar = avat.avatar;
    }
    if (firstName === undefined || firstName === null || firstName == "") {
      var firstNa = await User.findById(id);
      firstName = firstNa.firstName;
    }
    if (lastName === undefined || lastName === null || lastName == "") {
      var lastNa = await User.findById(id);
      lastName = lastNa.lastName;
    }

    // var data = {
    //   firstName: req.body.firstName,
    //   lastName: req.body.lastName,

    //   avatar: req.body.avatar,
    // };
    //console.log(data)

    var update = await User.findByIdAndUpdate(
      { _id: id },
      {
        firstName: firstName,
        lastName: lastName,
        avatar: avatar,
      },
      function (err, data) {
        if (err) {
          console.log(err.mesage);
        } else {
          res.send("done updated user");
          console.log("Updated User : ", data);
        }
      }
    );
  } catch (e) {
    res.json(e);
  }
};

exports.viewProfile = async (req, res, next) => {
  var email = req.params.email;
  if (email == undefined || email == null || email.length == 0) {
    return res.send("incoorect email");
  }

  await User.findOne({ email }, (err, user) => {
    if (!user) {
      return res.send({ error: "User not found" });
    }
    return res.send({ user });
  });
};

exports.verifyEmail = async (req, res) => {
  const email = req.params.email ;
  try {
 await  User.findOne({ email }, (err, user) => { 
    if(user ) {
       return res.status(200).send({ message: "Email exists " });
    
    }
    return res.status(404).send({ message: "No email found" });
  
  })
}catch (e) {
  return res.status(500).send({ message: e.message });
}
}

exports.usersDataById = async (req, res) => {
  var id = req.params.id;
  var ObjectId = require('mongoose').Types.ObjectId;
  if (id == undefined || id == null || id.length == 0 || ! ObjectId.isValid(id)) {
    return res.send("incoorect id");
  }

  await User.findOne({ _id : id }, (err, user) => {
    if (!user) {
      return res.send({ error: "User not found" });
    }
    return res.send({ user });
  });
}



// exports.signup = (req, res) => {
//   console.log(req.body);
//   const { name, username, PhoneNumber, email, dateOfBirth, password } =
//     req.body;
//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res
//         .status(400)
//         .json({ error: "user with this emial id is already exists" });
//     }
//     const token = jwt.sign(
//       { name, username, PhoneNumber, email, dateOfBirth, password },
//       "fahad123",
//       { expiresIn: "20m" }
//     );

//     var transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//              user: 'fahad.khalid01234@gmail.com',
//              pass: 'Khalid@786'
//          }
//      });
//      const mailOptions = {
//        from: 'fahad.khalid01234@gmail.com', // sender address
//        to: email, // list of receivers
//        subject: 'ACCOUNT VERIFICATION', // Subject line
//        html: `
//        <h2>Please click on given link to activate the account</h2>
//        <p>https://pure-woodland-42301.herokuapp.com/api/email-activate/${token}</p>

//        `// plain text body
//      };
//      transporter.sendMail(mailOptions, function (err, info) {
//         if(err)
//         {
//           return res.json({
//             error: "wrong",
//           });
//         }
//         return res.json({
//           message: "email has been sent , kindly activate your account",
//         });

//      });
//   });
// };
// exports.activateAccount = (req, res) => {
//   const { token } = req.body;
//   if (token) {
//     jwt.verify(token, "fahad123", function (err, decodeToken) {
//       if (err) {
//         return res.status(400).json({ error : "incorect or expired link" });
//       }
//       const { name, username, PhoneNumber, email, dateOfBirth, password } =
//         decodeToken;
//       User.findOne({ email }).exec((err, user) => {
//         if (user) {
//           return res
//             .status(400)
//             .json({ error: "user with email already exixist" });
//         }
//         let newUser = new User({
//           name,
//           username,
//           PhoneNumber,
//           email,
//           dateOfBirth,
//           password,
//         });
// console.log(newUser);
//         newUser.save((err, sucess) => {
//           if (err) {
//             return res
//               .status(400)
//               .json({ error: "error in activating account" });
//           }
//           res.json({ message: "signup successful" });
//         });
//       });
//     });
//   } else {
//     return res.json({ error: "something went wrong" });
//   }
// };
// exports.updateProfilee = async (req, res) => {
//   //console.log(req.params.id);
//  // res.send(req.params.id);
//   console.log(req.params.firstName);
//   res.send(req.body.firstName)
//   console.log("done1");

 
// };

   