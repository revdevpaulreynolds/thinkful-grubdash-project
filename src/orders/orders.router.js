const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./orders.controller");

// TODO: Implement the /orders routes needed to make the tests pass
router.route("/")
    .get(controller.list)
    .post()
    .all(methodNotAllowed)

router.route("/:orderId")
    .get(controller.read)
    .put()
    .delete()
    .all(methodNotAllowed)

module.exports = router;
