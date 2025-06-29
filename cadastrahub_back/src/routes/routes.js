const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController');
const productControllers = require('../controllers/productsController');
const authMiddleware = require('../middlewares/auth'); 

router.post('/', userControllers.createUser);

router.get('/', userControllers.getAllUsers);

router.put('/:id', userControllers.updateUser);

router.delete('/:id', userControllers.deleteUser);

router.post('/login', userControllers.loginUser);

router.get('/profile', authMiddleware, userControllers.getProfile);

router.post('/:id/products', productControllers.createProduct);

router.post('/:id/products/save-all', productControllers.saveAllProducts);

router.get('/:id/products', productControllers.getUserProducts);

router.delete('/:id/products/:id', productControllers.deleteProduct);

module.exports = router;
