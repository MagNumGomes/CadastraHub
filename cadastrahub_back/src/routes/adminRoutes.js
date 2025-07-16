const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController');
const productControllers = require('../controllers/productsController');
const adminAuth = require('../middlewares/adminAuth');

router.post('/register', userControllers.createAdmin);

router.use(adminAuth);

// Rota de estatísticas do Dashboard
router.get('/dashboard-stats', userControllers.getDashboardStats);

// Gerenciamento de usuários pelo Admin
router.get('/users', userControllers.getAllUsers);
router.get('/users/search', userControllers.searchUsers);
router.get('/users/export/excel', userControllers.exportUsersToExcel); // Rota adicionada
router.get('/users/:id', userControllers.getUserById);
router.put('/users/:id', userControllers.updateUser);
router.delete('/users/:id', userControllers.deleteUser);

// Gerenciamento de produtos pelo Admin
router.get('/products', productControllers.getAllProducts);
router.get('/products/search', productControllers.searchProducts);
router.get('/products/:id', productControllers.getProductById);
router.post('/products', productControllers.createProduct);
router.put('/products/:id', productControllers.updateProduct);
router.delete('/products/:id', productControllers.deleteProduct);

module.exports = router;