const express = require("express");
const { getEmailTemplates, sendBulkEmails, sendEmails } = require("../controller/mailController");

const router = express.Router();

// router.post("/add/employee", addEmployee);
router.post("/send/bulk-email", sendEmails);
router.get("/get/templates", getEmailTemplates);
// router.get("/get/employee/limited", getFilteredEmployees);
// router.put("/edit/employee/:id", updateEmployee);
// router.delete("/delete/employee/:id", deleteEmployee);
module.exports = router;
