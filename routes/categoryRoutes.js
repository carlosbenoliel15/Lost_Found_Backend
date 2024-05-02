const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Rota para listar todas as categorias
router.get('/', categoryController.listAll);

// Rota para criar uma categoria
router.post('/', categoryController.createCategory);

// Rota para deletar uma categoria
router.delete('/:name', categoryController.delete);

module.exports = router;