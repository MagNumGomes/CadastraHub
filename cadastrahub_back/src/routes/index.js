const express = require('express');
const router = express.Router();

// Importar e usar outras rotas
// router.use('/users', require('./users'));

router.get('/ping', (req, res) => {
    res.send('pong');
  });

module.exports = router;
