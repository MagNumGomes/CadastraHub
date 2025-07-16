const prisma = require('../dbConnector');

// Criar um novo produto associado a um usuário
const createProduct = async (req, res) => {
  const userId = req.user.id;
  const { type, quantity_tonelada, subtypeAluminio, subtypeCobre } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        type,
        quantity_tonelada,
        userId,
        subtypeAluminio: type === 'ALUMINIO' ? subtypeAluminio : null,
        subtypeCobre: type === 'COBRE' ? subtypeCobre : null,
      },
    });
    res.status(201).json({ message: 'Produto adicionado com sucesso', product });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Falha ao adicionar produto' });
  }
};

// Buscar produtos de um usuário específico
const getUserProducts = async (req, res) => {
  const userId = req.user.id;
  try {
    const products = await prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos do usuário:', error);
    res.status(500).json({ message: 'Falha ao buscar produtos' });
  }
};

// Buscar todos os produtos (para Insights ou Admin)
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error('Erro ao buscar todos os produtos:', error);
    res.status(500).json({ message: 'Falha ao buscar produtos' });
  }
};

// Deletar um produto
const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    await prisma.product.delete({
      where: { id: Number(productId) },
    });
    res.status(200).json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({ message: 'Falha ao remover produto' });
  }
};

// ATUALIZAR UM PRODUTO
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { type, quantity_tonelada } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        type,
        quantity_tonelada: parseFloat(quantity_tonelada)
      },
    });
    res.status(200).json({ message: 'Produto atualizado com sucesso', product: updatedProduct });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Falha ao atualizar produto' });
  }
};

// BUSCAR PRODUTO POR ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Falha ao buscar produto' });
  }
};

const searchProducts = async (req, res) => {
  const { type, subtypeAluminio, subtypeCobre } = req.query;

  try {
    const filters = {};

    if (type) filters.type = type;
    if (subtypeAluminio) filters.subtypeAluminio = subtypeAluminio;
    if (subtypeCobre) filters.subtypeCobre = subtypeCobre;

    const products = await prisma.product.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos.' });
  }
};


module.exports = {
  createProduct,
  getUserProducts,
  getAllProducts,
  deleteProduct,
  updateProduct,    
  getProductById, 
  searchProducts,  
};