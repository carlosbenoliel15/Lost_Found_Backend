const e = require('express');
const {CategoryModel,SubCategoryModel,SubSubCategoryModel,SubSubCategoryAssociationModel} = require('../models/Object');

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

//*get all categories
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

//*delete category
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

//*get category by id
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

//*delete subcategory
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

        const ObjectId = require('mongoose').Types.ObjectId;
        const subSubCategories = await SubSubCategoryAssociationModel.find({subCategory: new ObjectId(subCategory._id)});
        var subSubCategoriesJson = [];
        for (let i = 0; i < subSubCategories.length; i++){
            
            const subSubCategory = await SubSubCategoryModel.findById(subSubCategories[i].subSubCategory);
            subSubCategoriesJson.push({
                subSubCategory: subSubCategory._id,
                subSubCategory_name: subSubCategory.name
            });
        }

        const combinedData = {
            category: category._id,
            category_name: category.name,
            subcategory: subCategory._id,
            subcategory_name: subCategory.name,
            subSubCategories: subSubCategoriesJson
        };
        return res.status(200).json(combinedData);
    } catch (error){
        return res.status(400).json({error: error.message});
        //return res.status(400).json({error: "Could not get subcategory"});
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

        const resArray = [];
        for (let i = 0; i < subCategories.length; i++){
            const infoJson = {}
            const ObjectId = require('mongoose').Types.ObjectId;
            const subSubCategories = await SubSubCategoryAssociationModel.find({subCategory: new ObjectId(subCategories[i]._id)});
            var subSubCategoriesJson = [];
            for (let i = 0; i < subSubCategories.length; i++){       
                const subSubCategory = await SubSubCategoryModel.findById(subSubCategories[i].subSubCategory);
                subSubCategoriesJson.push({
                    subSubCategory: subSubCategory._id,
                    subSubCategory_name: subSubCategory.name
                });
            }
            infoJson.category = category._id;
            infoJson.category_name = category.name;
            infoJson.subcategory = subCategories[i]._id;
            infoJson.subcategory_name = subCategories[i].name;
            infoJson.subSubCategories = subSubCategoriesJson;
            resArray.push(infoJson);
        }
        return res.status(200).json(resArray);
    } catch (error){
        return res.status(400).json({error: "Could not get subcategories"});
    }
}

//==================================================Sub Sub Categories=======================================================
//create subsubcategory
exports.createSubSubCategory = async (req, res) => {
    try{
        const category = await CategoryModel.findOne({name: req.params.categoryName});
        if (!category){
            return res.status(400).json({error: "Category not found"});
        }
        const subCategory = await SubCategoryModel.findOne({name: req.params.subCategoryName, category: category._id});
        if (!subCategory){
            return res.status(400).json({error: "Subcategory not found"});
        }
        req.body.category = category._id;
        req.body.subCategory = subCategory._id;

        const subSubCategoryName = await SubSubCategoryModel.findOne({name: req.body.name});
        var create = true;
        if (subSubCategoryName){
           create = false;
        }
        var subSubCategory = null;
        if (create){
            subSubCategory = new SubSubCategoryModel(req.body);
            await subSubCategory.save();
        } else {
            subSubCategory = subSubCategoryName;
        }
        const subSubCategoryAssociation = new SubSubCategoryAssociationModel({
            subCategory: subCategory._id,
            subSubCategory: subSubCategory._id
        });
        await subSubCategoryAssociation.save();

        const subJson = {
            subCategory: subCategory._id,
            subSubCategory: subSubCategory._id
        };
        return res.status(200).json({message: "Subsubcategory created"});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

//delete subsubcategory
exports.deleteSubSubCategory = async (req, res) => {
    try{
        const category = await CategoryModel.findOne({name: req.params.categoryName});
        if (!category){
            return res.status(400).json({error: "Category not found"});
        }
        const subCategory = await SubCategoryModel.findOne({name: req.params.subCategoryName, category: category._id});
        if (!subCategory){
            return res.status(400).json({error: "Subcategory not found"});
        }
        const subSubCategory = await SubSubCategoryModel.findOneAndDelete({name: req.params.subSubCategoryName});
        if (!subSubCategory){
            return res.status(400).json({error: "Subsubcategory not found"});
        }

        const subSubCategoryAssociation = await SubSubCategoryAssociationModel.findOneAndDelete({subCategory: subCategory._id, subSubCategory: subSubCategory._id});
        if (!subSubCategoryAssociation){
            return res.status(400).json({error: "Subsubcategory association not found"});
        }
        return res.status(200).json({message: "Subsubcategory deleted"});
    } catch (error){
        return res.status(400).json({error: "Could not delete subsubcategory"});
    }
}

//get subsubcategory by id
exports.getSubSubCategoryById = async (req, res) => {
    try{
        const category = await CategoryModel.findOne({name: req.params.categoryName});
        if (!category){
            return res.status(400).json({error: "Category not found"});
        }
        const subCategory = await SubCategoryModel.findOne({name: req.params.subCategoryName, category: category._id});
        if (!subCategory){
            return res.status(400).json({error: "Subcategory not found"});
        }
        const subSubCategory = await SubSubCategoryModel.findOne({name: req.params.subSubCategoryName});
        if (!subSubCategory){
            return res.status(400).json({error: "Subsubcategory not found"});
        }
        const combinedData = {
            category: category._id,
            category_name: category.name,
            subcategory: subCategory._id,
            subcategory_name: subCategory.name,
            subsubcategory: subSubCategory._id,
            subsubcategory_name: subSubCategory.name
        };
        return res.status(200).json(combinedData);
    } catch (error){
        //return res.status(400).json({error: error.message});
        return res.status(400).json({error: "Could not get subsubcategory"});
    }
}

//get all subsubcategories of a subcategory
exports.listAllSubSubCategories = async (req, res) => {
    try{
        const category = await CategoryModel.findOne({name: req.params.categoryName});
        if (!category){
            return res.status(400).json({error: "Category not found"});
        }
        const subCategory = await SubCategoryModel.findOne({name: req.params.subCategoryName, category: category._id});
        if (!subCategory){
            return res.status(400).json({error: "Subcategory not found"});
        }
        const ObjectId = require('mongoose').Types.ObjectId;
        const subSubCategories = await SubSubCategoryAssociationModel.find({subCategory: new ObjectId(subCategory._id)});
        if (!subSubCategories){
            return res.status(400).json({error: "No subsubcategories found"});
        }
        const resJson = [];
        for (let i = 0; i < subSubCategories.length; i++){
            const subSubCategory = await SubSubCategoryModel.findById(subSubCategories[i].subSubCategory);
            resJson.push({
                category: category._id,
                category_name: category.name,
                subCategory: subCategory._id,
                subCategory_name: subCategory.name,
                subSubCategory: subSubCategory._id,
                subSubCategory_name: subSubCategory.name
            });
        }
        return res.status(200).json(resJson);
    } catch (error){
        return res.status(400).json({error: "Could not get subsubcategories"});
    }
}