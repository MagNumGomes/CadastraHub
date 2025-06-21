const prisma = require('../dbConnector');  // Certifique-se de que o prisma está corretamente configurado

// Criar um novo produto (C)
const createProduct = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { type, quantity_tonelada, subtypeAluminio, subtypeCobre } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        type,
        quantity_tonelada,
        userId,
        subtypeAluminio: type === 'ALUMINIO' ? subtypeAluminio : null,
        subtypeCobre: type === 'COBRE' ? subtypeCobre : null
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

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { user: true }
    });
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Falha ao buscar produtos' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { type, quantity_tonelada, userId } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        type,
        quantity_tonelada,
        userId: userId ? Number(userId) : undefined
      }
    });

    res.status(200).json({ message: 'Produto atualizado com sucesso', product });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Falha ao atualizar produto' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({ error: 'Falha ao remover produto' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { user: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Falha ao buscar produto' });
  }
};

module.exports = {
  createProduct,
  getUserProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById
};
