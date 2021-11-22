const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res) {
    res.json({ data: dishes })
}

function read(req, res, next) {
    const { dishId } = req.params;
    const result = dishId ? dish => dish.id === Number(dishId) : null;
    result && res.json({ data: dishes.filter(result)})
}

module.exports = {
    list,
    read,
}