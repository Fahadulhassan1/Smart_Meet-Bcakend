var Employee_Location = require("../model/employee_location");
var ObjectId = require("mongodb").ObjectID;

const _ = require("lodash");

exports.employee_Location = async (req, res) => {
  console.log("hello");
  var { employeeId, x_Axis, y_Axis } = req.body;
  let employeeLocation = new Employee_Location({
    employeeId,
    x_Axis,
    y_Axis,
  });
  employeeLocation.save((err, sucess) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json({ message: "appointment request sent successfully" });
  });
};

exports.getEmployee_Location = async (req, res) => {
  const employeeCheck = new ObjectId(req.params.employee_id);
   // res.send(employeeCheck);
  const location = await Employee_Location.find({ employeeId: employeeCheck });
  res.send(location);
  console.log(location);
};
