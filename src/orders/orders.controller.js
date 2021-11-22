const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if(foundOrder) {
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404,
        message: `No order found with id: ${orderId}`
    })
}

function validateOrder(req, res, next) {
    const {data: order} = req.body;
    const requiredFields = ["deliverTo", "mobileNumber", "dishes"];
    requiredFields.forEach((field) => {
        if (!order[field]) {
            return next({
                status: 400,
                message: `Order must include a ${field}`
            })
        }
    })
    if(!Array.isArray(order.dishes) || !order.dishes.length) {
        return next({
            status: 400,
            message: `Order must include at least one dish`,
        })
    }
    order.dishes.forEach((dish, index) => {
        if(!dish.quantity || dish.quantity <1 || !Number.isInteger(dish.quantity)) {
            return next({
                status: 400,
                message: `Dish ${index} must have a quantity that is an integer greater than 0`,
            })
        }
    })
    next();
}

function create(req, res) {
    const {data: order} = req.body;
    const newOrder = {
        ...order,
        id: nextId()
    }
    orders.push(newOrder);
    res.status(201).json({data: newOrder})
}

function list(req, res) {
    res.json({data: orders})
}

function read(req, res) {
    res.json({data: res.locals.order})
}

function destroy(req, res, next) {
    const {orderId} = req.params;
    const index = orders.findIndex((order) => order.id === orderId);
    const currentOrder = orders[index];
    if (currentOrder.status === "pending") {
        orders.splice(index, 1);
        res.sendStatus(204);
    } else {
        return next({
            status: 400,
            message: "Cannot delete an order that is not pending"
        })
    }
}

function validateUpdate(req, res, next) {    
    let order = res.locals.order;
    const { data: attemptedUpdate } = req.body;
    const {orderId} = req.params;
    if(attemptedUpdate.id && orderId !== attemptedUpdate.id) {
        next({
            status: 400,
            message: `Order id does not match route id. Order: ${attemptedUpdate.id}, Route: ${orderId}`,
        })
    }
    if (!attemptedUpdate.status || attemptedUpdate.status !== "pending") {
        next({
            status: 400,
            message: "Order must have a status of pending, preparing, out-for-delivery, delivered",
        })
    }
    if(order.status === "delivered") {
        next({
            status: 400,
            message: "A delivered order cannot be changed",
        })
    }
    next();
}

function update(req, res) {
    let order = res.locals.order;
    const { data: attemptedUpdate } = req.body;
    if (!attemptedUpdate.id) {
        order = {
            ...attemptedUpdate,
            id: order.id,
        }
    } else {
        order = {...attemptedUpdate}
    }
    res.json({ data: order })
}

module.exports = {
    list,
    read: [orderExists, read],
    create: [validateOrder, create],
    delete: [orderExists, destroy],
    update: [orderExists, validateOrder, validateUpdate, update]
}
