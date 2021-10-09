var Employee_Location = require("../model/employee_location");
var ObjectId = require("mongodb").ObjectID;

const _ = require("lodash");

exports.employee_Location = async (req, res) => {
  
  var { employeeId, lattitude, longitude } = req.body;
  let employeeLocation = new Employee_Location({
    employeeId,
    lattitude,
    longitude,
  });
  employeeLocation.save((err, sucess) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json({ message: "location added successfully" });
  });
};

exports.getEmployee_Location = async (req, res) => {
  const employeeCheck = new ObjectId(req.params.employee_id);
   // res.send(employeeCheck);
  const location = await Employee_Location.find({ employeeId: employeeCheck });
  res.send(location);
  console.log(location);
};
