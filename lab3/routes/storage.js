'use strict';

const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storage');

router.get('/', storageController.index);
router.get('/list', storageController.storageList);
router.get('/add', storageController.createStorageForm);
router.post('/add', storageController.postCreateStorage);
router.get('/edit/:id', storageController.updateStorageForm);
router.post('/edit/:id', storageController.putUpdateStorage);
router.get('/remove/:id', storageController.deleteStorageFrom);
router.post('/remove/:id', storageController.deleteStorage);

module.exports = router;
