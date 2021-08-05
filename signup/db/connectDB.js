const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://fahad:fahad@cluster0.cof3c.mongodb.net/smartmeet' , {
useNewUrlParser : true ,
useFindAndModify: true, 
useUnifiedTopology : true, 
useCreateIndex: true, 
}).then(() => console.log("Success"))
.catch(err => console.log("Error: " + err));

