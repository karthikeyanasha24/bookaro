const transaction = require("../controllers/TransactionController");
var router = require("express").Router();

router.get("/list", transaction.transactionList);
router.get("/migration", transaction.migrateNumericFieldsFast);

module.exports = router;
