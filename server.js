const express = require('express')
const cors = require('cors')
require('dotenv').config();
require('./signup/db/connectDB')
const app = express();

//import routes
const authRoutes = require('./signup/routes/auth');
app.use(express.json());

app.use(cors());

//middleswares
app.use('/api' , authRoutes);

const port = process.env.PORT || 3000
if(port == null || port == ""){
port = 3000
}
app.listen(port , ()=>{
    console.log('listening on port '+port)
});

