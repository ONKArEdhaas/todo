const express = require("express");
const { addCompany, getAllCompanies, updateCompany, deleteCompany, getCompanyNames } = require("../controller/companyController");

const router = express.Router();

router.post("/add/company", addCompany);
router.get("/get/company", getAllCompanies);
router.get("/get/company/name", getCompanyNames);
router.put("/edit/company/:id", updateCompany);
router.delete("/delete/company/:id", deleteCompany);
module.exports = router;
