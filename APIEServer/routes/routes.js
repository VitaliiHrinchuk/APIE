// const Model = require('../models/Model');

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');


/**
 * Метод, який приймає запит на зчитування даних
 * @param {String} URL шлях запиту
 * @param {function} callback обробник запиту
 */
router.get('/flights/',controller.getAllFlights);
/**
 * Метод, який приймає запит на запис даних
 * @param {String} URL шлях запиту
 * @param {function} callback обробник запиту
 */
router.post('/flights/', controller.postFlight);
/**
 * Метод, який приймає запит на оновлення даних
 * @param {String} URL шлях запиту
 * @param {function} callback обробник запиту
 */
router.put('/flights/', controller.updateFlight);

router.get('/user/:username', controller.getUser);
router.post('/user/create/', controller.createUser);


module.exports = router;