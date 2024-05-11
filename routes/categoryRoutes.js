const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

//============================Super Categories================================
// Rota para listar todas as categorias
router.get('/', categoryController.listAll);
// Rota para criar uma categoria
router.post('/', categoryController.createCategory);
// Rota para deletar uma categoria
router.delete('/:name', categoryController.delete);
// Rota para obter uma categoria pelo id
router.get('/:id', categoryController.getCategoryById);

//============================Sub Categories================================
// Rota para criar uma subcategoria
router.post('/subCat/:categoryName', categoryController.createSubCategory);
// Rota para deletar uma subcategoria
router.delete('/subCat/:categoryName/:subCategoryName', categoryController.deleteSubCategory);
// Rota para obter uma subcategoria pelo id
router.get('/subCat/:categoryName/:subCategoryId', categoryController.getSubCategoryById);
// Rota para listar todas as subcategorias de uma categoria
router.get('/subCat/:categoryName', categoryController.listAllSubCategories);


module.exports = router;