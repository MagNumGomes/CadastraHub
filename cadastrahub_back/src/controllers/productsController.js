/*const prisma = require('../dbConnector');  // Certifique-se de que o prisma está corretamente configurado

// Criar um novo produto (C)
const createProduct = async (req, res) => {
  const { name, type, quantity_tonelada, userId } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        type,
        quantity_tonelada,
        userId
      }
    });

    res.status(201).json({ message: 'Produto criado com sucesso', product: newProduct });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Falha ao criar produto' });
  }
};

module.exports = {
  createProduct
};*/
