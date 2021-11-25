const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./smartMeet/db/connectDB");
const app = express();
const fs = require("fs");

//import routes
const authRoutes = require("./smartMeet/routes/auth");
const EmployeeAuthRoutes = require("./smartMeet/routes/employeAuth");
const AppointmentRoutes = require("./smartMeet/routes/appointment");
const Employee_LocationRoutes = require("./smartMeet/routes/employee_Location");
const Admin_PanelRoutes = require("./smartMeet/routes/admin_panel");
const RunInAppointment = require("./smartMeet/routes/runInAppointment");
const Ocr = require("./smartMeet/routes/ocr");
app.use(express.json());

app.use(cors());

//middleswares
app.use("/api", authRoutes);
app.use("/api", EmployeeAuthRoutes);
app.use("/api", AppointmentRoutes);
app.use("/api", Employee_LocationRoutes);
app.use("/api", Admin_PanelRoutes);
app.use("/api", RunInAppointment);
app.use("/api", Ocr);
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port, () => {
  console.log("listening on port " + port);
});
