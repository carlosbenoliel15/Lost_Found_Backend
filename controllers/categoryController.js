const {CategoryModel} = require('../models/Object');

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