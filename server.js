const express = require('express')
const cors = require('cors')
require('dotenv').config();
require('./signup/db/connectDB')
const app = express();

//import routes
const authRoutes = require('./signup/routes/auth');
const EmployeeAuthRoutes = require("./signup/routes/employeAuth");
const AppointmentRoutes = require("./signup/routes/appointment");
app.use(express.json());

app.use(cors());

//middleswares
app.use('/api' , authRoutes);
app.use('/api' , EmployeeAuthRoutes)
app.use('/api' , AppointmentRoutes)
let port = process.env.PORT ;
if(port == null || port == ""){
port = 3000
}
app.listen(port , ()=>{
    console.log('listening on port '+port)
});

