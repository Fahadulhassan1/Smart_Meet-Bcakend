const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./signup/db/connectDB");
const app = express();
const fs = require("fs");

//import routes
const authRoutes = require("./signup/routes/auth");
const EmployeeAuthRoutes = require("./signup/routes/employeAuth");
const AppointmentRoutes = require("./signup/routes/appointment");
const Employee_LocationRoutes = require("./signup/routes/employee_Location");
const Admin_PanelRoutes = require("./signup/routes/admin_panel");
const Ocr = require("./signup/routes/ocr");
app.use(express.json());

app.use(cors());

//middleswares
app.use("/api", authRoutes);
app.use("/api", EmployeeAuthRoutes);
app.use("/api", AppointmentRoutes);
app.use("/api", Employee_LocationRoutes);
app.use("/api", Admin_PanelRoutes);
app.use("/api", Ocr);
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port, () => {
  console.log("listening on port " + port);
});
