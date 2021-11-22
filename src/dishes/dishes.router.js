const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./dishes.controller");

// TODO: Implement the /dishes routes needed to make the tests pass
router.route("/")
    .get()
    .post()
    .all(methodNotAllowed)

router.route("/:dishId")
    .get(controller.read)
    .put()
    .all(methodNotAllowed)

module.exports = router;
