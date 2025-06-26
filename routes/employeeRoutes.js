const express = require("express");
const { addEmployee, getAllEmployees, updateEmployee, deleteEmployee, getFilteredEmployees, geminiRes } = require("../controller/employeeController");

const router = express.Router();

router.post("/add/employee", addEmployee);
router.get("/get/employee", getAllEmployees);
router.get("/get/employee/limited", getFilteredEmployees);
router.put("/edit/employee/:id", updateEmployee);
router.delete("/delete/employee/:id", deleteEmployee);
module.exports = router;
