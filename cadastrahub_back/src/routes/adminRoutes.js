const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController');
const productControllers = require('../controllers/productsController');
const adminAuth = require('../middlewares/adminAuth');

// Adicione esta rota para criar um admin (sem middleware para o primeiro admin)
router.post('/register', userControllers.createAdmin);

// Protect all admin routes
router.use(adminAuth);

// Admin user management
router.get('/users', userControllers.getAllUsers);
router.get('/users/:id', userControllers.getUserById);
router.put('/users/:id', userControllers.updateUser);
router.delete('/users/:id', userControllers.deleteUser);

// Admin user search
router.get('/usuarios/buscar', userControllers.searchUsers);

// Admin product search
router.get('/products/search', productControllers.searchProducts);


// Admin product management
router.get('/products', productControllers.getAllProducts);
router.post('/products', productControllers.createProduct);
router.put('/products/:id', productControllers.updateProduct);
router.delete('/products/:id', productControllers.deleteProduct);
router.get('/products/:id', productControllers.getProductById);

module.exports = router;
