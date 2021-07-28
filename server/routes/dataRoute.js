const router = require("express").Router();
const controller = require("../controllers/dataController");

router.post("/newData", controller.postData);
router.get("/getData", controller.getData);

module.exports = router;
