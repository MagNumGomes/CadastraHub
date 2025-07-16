const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController');
const productControllers = require('../controllers/productsController');
const authMiddleware = require('../middlewares/auth');

// Rotas públicas
router.post('/register', userControllers.createUser);
router.post('/login', userControllers.loginUser);

// Rota de Perfil (protegida por middleware padrão)
router.get('/profile', authMiddleware, userControllers.getProfile);
router.put('/profile', authMiddleware, userControllers.updateProfile);

// Rotas de Produtos (protegidas por middleware padrão)
router.post('/products', authMiddleware, productControllers.createProduct);
router.get('/products', authMiddleware, productControllers.getUserProducts);
router.delete('/products/:productId', authMiddleware, productControllers.deleteProduct);

// Rota para todos os produtos (protegida, para insights)
router.get('/products/all', authMiddleware, productControllers.getAllProducts);

module.exports = router;