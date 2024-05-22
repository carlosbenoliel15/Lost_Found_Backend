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

//============================Sub Sub Categories================================
// Rotas para criar uma sub sub categoria
router.post('/subSubCat/:categoryName/:subCategoryName', categoryController.createSubSubCategory);
// Rota para listar todas as sub sub categorias de uma sub categoria
router.get('/subSubCat/:categoryName/:subCategoryName', categoryController.listAllSubSubCategories);
// Rota para deletar uma sub sub categoria
router.delete('/subSubCat/:categoryName/:subCategoryName/:subSubCategoryName', categoryController.deleteSubSubCategory);
// Rota para obter uma sub sub categoria pelo id
router.get('/subSubCat/:categoryName/:subCategoryName/:subSubCategoryName', categoryController.getSubSubCategoryById);

module.exports = router;