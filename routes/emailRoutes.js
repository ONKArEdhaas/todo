const express = require("express");
const { addEmail, getAllEmails, getEmailById, updateEmail, deleteEmail, getTemplateID } = require("../controller/emailController");

const router = express.Router();

router.post("/add/email-template", addEmail);
router.get("/get/all-templates", getAllEmails);
router.get("/get/template/name", getTemplateID);
router.put("/edit/company/:id", getEmailById);
router.put("/update/email-template/:id", updateEmail);
router.delete("/delete/email-template/:id", deleteEmail);
module.exports = router;
