const path = require("path");
const errorHandler = require("../errors/errorHandler");
const notFound = require("../errors/notFound");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function dishExists (req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish id not found: ${dishId}`
    })
}

function validateDish(req, res, next) {
    const { data: result = {} } = req.body;
    if (!result.name) {
        next({
            status: 400,
            message: `Dish must include a name`,
        })
    } else if (!result.description) {
        next({
            status: 400,
            message: `Dish must include a description`,
        })
    } else if (!result.price) {
        next({
            status: 400,
            message: `Dish must include a price`,
        })
    } else if (!Number.isInteger(result.price) || result.price < 1) {
        next({
            status: 400,
            message: `Dish must have a price that is an integer greater than 0`,
        })
    } else if (!result.image_url) {
        next({
            status: 400,
            message: `Dish must include a image_url`,
        })
    }
    next();
}

function validateUpdatedDish(req, res, next) {
    const { data: updatedDish } = {} = req.body;
    const {dishId} = req.params;
    if(updatedDish.id && updatedDish.id !== dishId) {
        next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${updatedDish.id}, Route: ${dishId}`
        })
    }
    next();
}

function create(req, res) {
    const { data: result = {} } = req.body;
    const newDish = {
        id: nextId(),
        ...result,
    }
    dishes.push(newDish);
    res.status(201).json({data: newDish})
}

function list(req, res) {
    res.json({ data: dishes })
}

function read(req, res) {
    res.json({ data: res.locals.dish });
}

function update(req, res) {
    let foundDish = res.locals.dish;
    const { data: updatedDish } = req.body;
    console.log(`Updated dish: ${updatedDish.id}`)
    if (!updatedDish.id) {
        foundDish = {
            ...updatedDish,
            id: foundDish.id,
        };
    } else {
        foundDish = {...updatedDish};
    }
    // foundDish = {
    //     id: foundDish.id,
    //     ...updatedDish,
    // };
    res.json({ data: foundDish });

}

module.exports = {
    list,
    read: [dishExists, read],
    put: [dishExists, update],
    create: [validateDish, create],
    update: [dishExists, validateDish, validateUpdatedDish, update]
}