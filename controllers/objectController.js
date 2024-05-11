const { LostObjectModel, FoundObjectModel, CategoryModel, ObjSubCategoryModel, SubCategoryModel } = require('../models/Object');
const { UserModel, OwnerModel, PoliceOfficerModel } = require('../models/User');
const { jwtDecode } = require("jwt-decode");
const axios = require('axios');
const DANDILION_API = process.env.DANDILION_API_KEY;

// Middleware de tratamento de erros
const errorHandler = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
};

//================================================================================================================================================================
exports.test =  async (req, res) => {
  const response = await axios.get("https://api.dandelion.eu/datatxt/sim/v1/", { 
    params: {
      text1: "Cameron wins the Oscar",
      text2: "All nominees for the Academy Awards",
      token: DANDILION_API,
      bow: "always" 
    }
});
  res.status(200).json(response.data);
}
//================================================================================================================================================================

//------------------------------------------------------------------Lost Object Functions ---------------------------------------------------------------------
// Create a new LostObject
exports.createLostObject = async (req, res) => {
  try {
    const token = jwtDecode(req.body.owner);
    const ownerId  = token["userId"];
    
    const newOwnerId = await OwnerModel.findOne({ user: ownerId });
    const userIdCheck = await UserModel.findById(ownerId);
    if (!newOwnerId && userIdCheck) {
      const newOwnerId = new OwnerModel({ user: ownerId });
      await newOwnerId.save();
      req.body.owner = newOwnerId._id;
    }
    else if(newOwnerId){
      req.body.owner = newOwnerId;
    }

    const category = await CategoryModel.findOne({ name: req.body.category });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const subCategory = req.body.subCategory;
    const newLostObjectArgs = {
      owner: req.body.owner,
      category: category._id,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      price: req.body.price,
      lostDate: req.body.lostDate,
      status: req.body.status,
      objectImage: req.body.objectImage
    };
    const newLostObjectFiltered = new LostObjectModel(newLostObjectArgs);

    for (const key in subCategory) {
      const subCategoryCheck = await SubCategoryModel.findOne({ name: subCategory[key].name, category: category._id });
      if (!subCategoryCheck) {
        return res.status(404).json({ error: 'SubCategory: ' + subCategory[i] + ' not found' });
      }

      const subCategoryArgs = {
        object: newLostObjectFiltered._id,
        subCategory: subCategoryCheck._id,
        description: req.body.description
      };
      const subCategoryFiltered = new ObjSubCategoryModel(subCategoryArgs);
      await subCategoryFiltered.save();
    }

    await newLostObjectFiltered.save();
    res.status(201).json({ message: 'LostObject created successfully' });
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get all LostObjects
exports.getAllLostObjects = async (req, res) => {
  try {
    const resArray = [];
    const lostObjects = await LostObjectModel.find();
    if (!lostObjects) {
      return res.status(404).json({ error: 'LostObjects not found' });
    }

    for (const item of lostObjects) {
      const resJson = {};
      const categoryName = await CategoryModel.findById(item.category);
      resJson.object_id = item._id;
      resJson.owner = item.owner;
      resJson.title = item.title;
      resJson.description = item.description;
      resJson.location = item.location;
      resJson.price = item.price;
      resJson.lostDate = item.lostDate;
      resJson.status = item.status;
      resJson.objectImage = item.objectImage;
      resJson.category_id = categoryName._id;
      resJson.category = categoryName.name;

      const subCategories = await ObjSubCategoryModel.find({ object: item._id });
      const subCategoriesArray = [];
      for (const item of subCategories) {
        const subCategoryJson = {};
        const subCategory = await SubCategoryModel.findById(item.subCategory);
        subCategoryJson.objSubCategory_id = item._id;
        subCategoryJson.subCategory_id = subCategory._id;
        subCategoryJson.subCategory = subCategory.name;
        subCategoryJson.description = item.description;
        subCategoriesArray.push(subCategoryJson);
      }
      resJson.subCategories = subCategoriesArray;
      resArray.push(resJson);
    }
    res.status(200).json(resArray);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get a LostObject by ID
exports.getLostObjectById = async (req, res) => {
  try {
    const resJson = {};
    const lostObjectId = req.params.lostObjectId;
    const lostObject = await LostObjectModel.findById(lostObjectId);
    if (!lostObject) {
      return res.status(404).json({ error: 'LostObject not found' });
    }
    const categoryName = await CategoryModel.findById(lostObject.category);
    resJson.object_id = lostObject._id;
    resJson.owner = lostObject.owner;
    resJson.title = lostObject.title;
    resJson.description = lostObject.description;
    resJson.location = lostObject.location;
    resJson.price = lostObject.price;
    resJson.lostDate = lostObject.lostDate;
    resJson.status = lostObject.status;
    resJson.objectImage = lostObject.objectImage;
    resJson.category_id = categoryName._id;
    resJson.category = categoryName.name;

    const subCategories = await ObjSubCategoryModel.find({ object: lostObjectId });
    const subCategoriesArray = [];
    for (const item of subCategories) {
      const subCategoryJson = {};
      const subCategory = await SubCategoryModel.findById(item.subCategory);
      subCategoryJson.objSubCategory_id = item._id;
      subCategoryJson.subCategory_id = subCategory._id;
      subCategoryJson.subCategory = subCategory.name;
      subCategoryJson.description = item.description;
      subCategoriesArray.push(subCategoryJson);
    }
    resJson.subCategories = subCategoriesArray;
    res.status(200).json(resJson);
  } catch (error) {
    errorHandler(res, error);
  }
};

// *Update a LostObject see Its needed another endpoint to update the subcategories
exports.updateLostObject = async (req, res) => {
  try {
    const lostObjectId = req.params.lostObjectId;
    const updatedLostObject = await LostObjectModel.findByIdAndUpdate(lostObjectId, req.body, { new: true });
    if (!updatedLostObject) {
      return res.status(404).json({ error: 'LostObject not found' });
    }
    res.status(200).json(updatedLostObject);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Delete a LostObject
exports.deleteLostObject = async (req, res) => {
  try {
    const lostObjectId = req.params.lostObjectId;
    const deletedLostObject = await LostObjectModel.findByIdAndDelete(lostObjectId);
    if (!deletedLostObject) {
      return res.status(404).json({ error: 'LostObject not found' });
    }

    const ObjectId = require('mongoose').Types.ObjectId;
    const deletedSubCategories = await ObjSubCategoryModel.find({ object: new ObjectId(lostObjectId) });
    for (const item of deletedSubCategories) {
      await ObjSubCategoryModel.findByIdAndDelete(item._id);
    }

    res.status(200).json({ message: 'LostObject deleted successfully' });
  } catch (error) {
    errorHandler(res, error);
  }
};

//*
exports.getLostMatch = async (req, res) => {
  try {
    const jsonFilter = req.body;
    const foundObjects = await FoundObjectModel.find(jsonFilter);
    if (!foundObjects) {
      return res.status(404).json({ error: 'No match found' });
    }
    res.status(200).json(foundObjects);
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getLostObjectByUserId = async (req, res) => {
  try {
    const resJson = {};
    const userIdToken = req.params.id;
    const userId = jwtDecode(userIdToken)["userId"];
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const owner = await OwnerModel.findOne({ user: userId });
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    const lostObjects = await LostObjectModel.find({ owner: owner._id });
    if (!lostObjects) {
      return res.status(404).json({ error: 'LostObjects not found' });
    }

    const categoryName = await CategoryModel.findById(lostObject.category);
    resJson.object_id = lostObject._id;
    resJson.owner = lostObject.owner;
    resJson.title = lostObject.title;
    resJson.description = lostObject.description;
    resJson.location = lostObject.location;
    resJson.price = lostObject.price;
    resJson.lostDate = lostObject.lostDate;
    resJson.status = lostObject.status;
    resJson.objectImage = lostObject.objectImage;
    resJson.category_id = categoryName._id;
    resJson.category = categoryName.name;

    const subCategories = await ObjSubCategoryModel.find({ object: lostObjectId });
    const subCategoriesArray = [];
    for (const item of subCategories) {
      const subCategoryJson = {};
      const subCategory = await SubCategoryModel.findById(item.subCategory);
      subCategoryJson.objSubCategory_id = item._id;
      subCategoryJson.subCategory_id = subCategory._id;
      subCategoryJson.subCategory = subCategory.name;
      subCategoryJson.description = item.description;
      subCategoriesArray.push(subCategoryJson);
    }
    resJson.subCategories = subCategoriesArray;

    res.status(200).json(resJson);
  } catch (error) {
    errorHandler(res, error);
  }
};


//------------------------------------------------------------------Found Object Functions ---------------------------------------------------------------------

// Create a new FoundObject
exports.createFoundObject = async (req, res) => {
  try {
    const resJson = {};
    const newFoundObjectData = {
      userWhoFound: req.body.userWhoFound,
      policeOfficerThatReceived: req.body.policeOfficerThatReceived,
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      price: req.body.price,
      status: req.body.status,
      claimant: req.body.claimant,
      foundDate: req.body.foundDate,
      endDate: req.body.endDate,
      objectImage: req.body.objectImage
    };

    const dateParts1 = newFoundObjectData.foundDate.split('/');
    const day1 = parseInt(dateParts1[0], 10);
    const month1 = parseInt(dateParts1[1], 10) - 1; 
    const year1 = parseInt(dateParts1[2], 10);
    const dateObject1 = new Date(year1, month1, day1);

    const dateParts2 = newFoundObjectData.endDate.split('/');
    const day2 = parseInt(dateParts2[0], 10);
    const month2 = parseInt(dateParts2[1], 10) - 1;
    const year2 = parseInt(dateParts2[2], 10);
    const dateObject2 = new Date(year2, month2, day2);

    if (dateObject1.getTime() > dateObject2.getTime()){
      return res.status(400).json({ error: 'Invalid dates' });
    }

    const userWhoFound = await UserModel.findById(newFoundObjectData.userWhoFound);
    if (!userWhoFound) {
      return res.status(404).json({ error: 'UserWhoFound not found' });
    }
    const policeOfficerThatReceived = await PoliceOfficerModel.findById(newFoundObjectData.policeOfficerThatReceived);
    if (!policeOfficerThatReceived) {
      return res.status(404).json({ error: 'PoliceOfficerThatReceived not found' });
    }
    const category = await CategoryModel.findOne({ name: newFoundObjectData.category });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    newFoundObjectData.category = category._id;
    const subCategory = req.body.subCategory;
    const newFoundObject = new FoundObjectModel(newFoundObjectData);
    for (const key in subCategory) {
      const subCategoryCheck = await SubCategoryModel.findOne({ name: subCategory[key].name, category: category._id });
      if (!subCategoryCheck) {
        return res.status(404).json({ error: 'SubCategory: ' + subCategory[i] + ' not found' });
      }

      const subCategoryArgs = {
        object: newFoundObject._id,
        subCategory: subCategoryCheck._id,
        description: req.body.description
      };
      const subCategoryFiltered = new ObjSubCategoryModel(subCategoryArgs);
      await subCategoryFiltered.save();
    }

    await newFoundObject.save();
    res.status(201).json({ message: 'FoundObject created successfully' });
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get all FoundObjects
exports.getAllFoundObjects = async (req, res) => {
  try {
    const foundObjects = await FoundObjectModel.find();
    if (!foundObjects) {
      return res.status(404).json({ error: 'FoundObjects not found' });
    }
    const resArray = [];
    for (const item of foundObjects) {
      const resJson = {};
      const categoryName = await CategoryModel.findById(item.category);
      resJson.object_id = item._id;
      resJson.userWhoFound = item.userWhoFound;
      resJson.policeOfficerThatReceived = item.policeOfficerThatReceived;
      resJson.title = item.title;
      resJson.description = item.description;
      resJson.location = item.location;
      resJson.price = item.price;
      resJson.foundDate = item.foundDate;
      resJson.endDate = item.endDate;
      resJson.status = item.status;
      resJson.objectImage = item.objectImage;
      resJson.category_id = categoryName._id;
      resJson.category = categoryName.name;

      const subCategories = await ObjSubCategoryModel.find({ object: item._id });
      const subCategoriesArray = [];
      for (const item of subCategories) {
        const subCategoryJson = {};
        const subCategory = await SubCategoryModel.findById(item.subCategory);
        subCategoryJson.objSubCategory_id = item._id;
        subCategoryJson.subCategory_id = subCategory._id;
        subCategoryJson.subCategory = subCategory.name;
        subCategoryJson.description = item.description;
        subCategoriesArray.push(subCategoryJson);
      }
      resJson.subCategories = subCategoriesArray;
      resArray.push(resJson);
    }
    res.status(200).json(resArray);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get a FoundObject by ID
exports.getFoundObjectById = async (req, res) => {
  try {
    const foundObjectId = req.params.foundObjectId;
    const foundObject = await FoundObjectModel.findById(foundObjectId);
    if (!foundObject) {
      return res.status(404).json({ error: 'FoundObject not found' });
    }

    const resJson = {};
    const categoryName = await CategoryModel.findById(foundObject.category);
    resJson.object_id = foundObject._id;
    resJson.userWhoFound = foundObject.userWhoFound;
    resJson.policeOfficerThatReceived = foundObject.policeOfficerThatReceived;
    resJson.title = foundObject.title;
    resJson.description = foundObject.description;
    resJson.location = foundObject.location;
    resJson.price = foundObject.price;
    resJson.foundDate = foundObject.foundDate;
    resJson.endDate = foundObject.endDate;
    resJson.status = foundObject.status;
    resJson.objectImage = foundObject.objectImage;
    resJson.category_id = categoryName._id;
    resJson.category = categoryName.name;

    const subCategories = await ObjSubCategoryModel.find({ object: foundObject._id });
    const subCategoriesArray = [];
    for (const item of subCategories) {
      const subCategoryJson = {};
      const subCategory = await SubCategoryModel.findById(item.subCategory);
      subCategoryJson.objSubCategory_id = item._id;
      subCategoryJson.subCategory_id = subCategory._id;
      subCategoryJson.subCategory = subCategory.name;
      subCategoryJson.description = item.description;
      subCategoriesArray.push(subCategoryJson);
    }
    resJson.subCategories = subCategoriesArray;    

    res.status(200).json(resJson);
  } catch (error) {
    errorHandler(res, error);
  }
};

// *Update a FoundObject
exports.updateFoundObject = async (req, res) => {
  try {
    const foundObjectId = req.params.foundObjectId;
    const updatedFoundObject = await FoundObjectModel.findByIdAndUpdate(foundObjectId, req.body, { new: true });
    if (!updatedFoundObject) {
      return res.status(404).json({ error: 'FoundObject not found' });
    }
    res.status(200).json(updatedFoundObject);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Delete a FoundObject
exports.deleteFoundObject = async (req, res) => {
  try {
    const foundObjectId = req.params.foundObjectId;
    const ObjectId = require('mongoose').Types.ObjectId;
    const deletedSubCategories = await ObjSubCategoryModel.find({ object: new ObjectId(foundObjectId) });

    for (const item of deletedSubCategories) {
      await ObjSubCategoryModel.findByIdAndDelete(item._id);
    }
    const deletedFoundObject = await FoundObjectModel.findByIdAndDelete(foundObjectId);
    if (!deletedFoundObject) {
      return res.status(404).json({ error: 'FoundObject not found' });
    }
    res.status(200).json({ message: 'FoundObject deleted successfully' });
  } catch (error) {
    errorHandler(res, error);
  }
};
