const prisma = require('../dbConnector');  // Certifique-se de que o prisma está corretamente configurado

// Criar um novo produto (C)
const createProduct = async (req, res) => {
  const userId = parseInt(req.params.id); // Obtendo o ID do usuário da URL
  const { type, quantity_tonelada } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        type,
        quantity_tonelada,
        userId
      }
    });

    res.status(201).json({ message: 'Produto adicionado com sucesso', product });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Falha ao adicionar produto' });
  }
};


const getUserProducts = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const products = await prisma.product.findMany({
      where: { userId }
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Falha ao buscar produtos' });
  }
};

module.exports = {
  createProduct,
  getUserProducts
};