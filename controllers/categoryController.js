const e = require('express');
const {CategoryModel,SubCategoryModel} = require('../models/Object');

//==================================================Super Categories=======================================================
//create category
exports.createCategory = async (req, res) => {
    try{
        const category = new CategoryModel(req.body);
        if (await CategoryModel.findOne({name: category.name})) {
            return res.status(400).json({error: "Category already exists"});
        }
        await category.save();
        res.status(200).json(category);
    } catch (error){
        return res.status(400).json({error: "Could not create category"});
    }
}

//get all categories
exports.listAll = async (req, res) => {
    try{
        const categories = await CategoryModel.find();
        if (!categories) {
            return res.status(400).json({error: "No categories found"});
        }
        return res.status(200).json(categories);
    } catch (error){
        return res.status(400).json({error: "Could not get categories"});
    }
}

//delete category
exports.delete = async (req, res) => {
    try{
        const category = await CategoryModel.findOneAndDelete({name: req.params.name});
        if (!category){
            return res.status(400).json({error: "Category not found"});
        }
        return res.status(200).json(category);
    } catch (error){
        return res.status(400).json({error: "Could not delete category"});
    }
}

//get category by id
exports.getCategoryById = async (req, res) => {
    try{
        const category = await CategoryModel.findById(req.params.id);
        if (!category){
            return res.status(400).json({error: "Category not found"});
        }
        return res.status(200).json(category);
    } catch (error){
        return res.status(400).json({error: "Could not get category"});
    }
}

//==================================================Sub Categories=======================================================
//create subcategory
exports.createSubCategory = async (req, res) => {
    try{
        const category = await CategoryModel.findOne({name: req.params.categoryName});
        if (!category){
            return res.status(400).json({error: "Category not found"});
        }
        req.body.category = category._id;

        const subCategoryName = await SubCategoryModel.findOne({name: req.body.name, category: category._id});
        if (subCategoryName){
            return res.status(400).json({error: "Subcategory already exists with the given name and category"});
        }
        const subCategory = new SubCategoryModel(req.body);
        await subCategory.save();
        return res.status(200).json({message: "Subcategory created"});
    } catch (error){
        return res.status(400).json({error: error.message});
    }
}

//delete subcategory
exports.deleteSubCategory = async (req, res) => {
    try{
        const category = await CategoryModel.findOne({name: req.params.categoryName});
        if (!category){
            return res.status(400).json({error: "Category not found"});
        }
        const subCategory = await SubCategoryModel.findOneAndDelete({name: req.params.subCategoryName});
        if (!subCategory){
            return res.status(400).json({error: "Subcategory not found"});
        }
        return res.status(200).json({message: "Subcategory deleted"});
    } catch (error){
        return res.status(400).json({error: "Could not delete subcategory"});
    }
}

//get subcategory by id
exports.getSubCategoryById = async (req, res) => {
    try{
        const category = await CategoryModel.findOne({name: req.params.categoryName});
        if (!category){
            return res.status(400).json({error: "Category not found"});
        }
        const subCategory = await SubCategoryModel.findById(req.params.subCategoryId);
        if (!subCategory){
            return res.status(400).json({error: "Subcategory not found"});
        }
        const combinedData = {
            category: category._id,
            category_name: category.name,
            subcategory: subCategory._id,
            subcategory_name: subCategory.name
        };
        return res.status(200).json(combinedData);
    } catch (error){
        return res.status(400).json({error: "Could not get subcategory"});
    }
}

//get all subcategories of a category
exports.listAllSubCategories = async (req, res) => {
    try{
        const category = await CategoryModel.findOne({name: req.params.categoryName});
        if (!category){
            return res.status(400).json({error: "Category not found"});
        }
        const subCategories = await SubCategoryModel.find({category: category._id});
        if (!subCategories){
            return res.status(400).json({error: "No subcategories found"});
        }
        return res.status(200).json(subCategories);
    } catch (error){
        return res.status(400).json({error: "Could not get subcategories"});
    }
}