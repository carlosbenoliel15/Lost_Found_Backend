const { LostObjectModel, FoundObjectModel, CategoryModel, ObjSubCategoryModel, SubCategoryModel, SubSubCategoryModel, SubSubCategoryAssociationModel} = require('../models/Object');
const { UserModel, OwnerModel, PoliceOfficerModel } = require('../models/User');
const {AuctionModel, BidModel} = require('../models/Auction');
const {PoliceStationModel} = require('../models/Police');
const { jwtDecode } = require("jwt-decode");
const axios = require('axios');
const cloudinaryService = require("../services/cloudinaryService");
const DANDILION_API = process.env.DANDILION_API_KEY;
const ObjectId = require('mongoose').Types.ObjectId;
const nodemailer = require('nodemailer');

// Middleware de tratamento de erros
const errorHandler = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
};

//Upload de várias imagens
const uploadImages = async (images) => {
  let imagesArray=[]
  for (const image in images){
    const result = await cloudinaryService.uploadImage(images[image].filename, 'objectImages');
    imagesArray.push(result.public_id.replace('objectImages/', ''))
  }
  return imagesArray;
}

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

    let objectImages= []
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
    if (req.files) {
      objectImages= await uploadImages(req.files);
    }

    const subCategory = JSON.parse(req.body.subCategory);
    const newLostObjectArgs = {
      owner: req.body.owner,
      category: category._id,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      price: req.body.price,
      lostDate: req.body.lostDate,
      status: req.body.status,
      objectImage: objectImages,
      coordinates: req.body.coordinates
    };
    const newLostObjectFiltered = new LostObjectModel(newLostObjectArgs);

    for (const key in subCategory) {
      const subCategoryCheck = await SubCategoryModel.findOne({ name: subCategory[key].name, category: new ObjectId(category._id) });
      if (!subCategoryCheck) {
        return res.status(404).json({ error: 'SubCategory: ' + subCategory[key].name + ' not found' });
      }

      const subSubCategoryCheck = await SubSubCategoryModel.findOne({ name: subCategory[key].subSubCategory});
      if (!subSubCategoryCheck) {
        return res.status(404).json({ error: 'SubSubCategory: ' + subCategory[key].subCategory + ' not found' });
      }

      const subSubCategoryAssociationCheck = await SubSubCategoryAssociationModel.findOne({ subCategory: new ObjectId(subCategoryCheck._id), subSubCategory: new ObjectId(subSubCategoryCheck._id) });
      if (!subSubCategoryAssociationCheck) {
        return res.status(404).json({ error: 'SubCategory ' + subCategory[key].name + ' and subSubCategory ' + subCategory[key].subSubCategory + ' not associated'});
      }

      const subCategoryArgs = {
        object: newLostObjectFiltered._id,
        subCategory: subCategoryCheck._id,
        subSubCategory: subSubCategoryCheck._id
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
      resJson.objectImage = item.objectImage.length===0 ? ["default_obj_ht0fde"] : item.objectImage;
      resJson.category_id = categoryName._id;
      resJson.category = categoryName.name;
      resJson.coordinates = item.coordinates;

      const subCategories = await ObjSubCategoryModel.find({ object: item._id });
      const subCategoriesArray = [];
      for (const item of subCategories) {
        const subCategoryJson = {};
        const subCategory = await SubCategoryModel.findById(item.subCategory);
        subCategoryJson.objSubCategory_id = item._id;
        subCategoryJson.subCategory_id = subCategory._id;
        subCategoryJson.subCategory = subCategory.name;
        subCategoryJson.subSubCategories = item.subSubCategory;
        const subSubCategory = await SubSubCategoryModel.findById(item.subSubCategory);
        subCategoryJson.subSubCategoryName = subSubCategory.name;
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
    resJson.objectImage = lostObject.objectImage.length===0 ? ["default_obj_ht0fde"] : lostObject.objectImage;
    resJson.category_id = categoryName._id;
    resJson.category = categoryName.name;
    resJson.coordinates = lostObject.coordinates;

    const subCategories = await ObjSubCategoryModel.find({ object: lostObjectId });
    const subCategoriesArray = [];
    for (const item of subCategories) {
      const subCategoryJson = {};
      const subCategory = await SubCategoryModel.findById(item.subCategory);
      subCategoryJson.objSubCategory_id = item._id;
      subCategoryJson.subCategory_id = subCategory._id;
      subCategoryJson.subCategory = subCategory.name;
      subCategoryJson.subSubCategories = item.subSubCategory;
      const subSubCategory = await SubSubCategoryModel.findById(item.subSubCategory);
      subCategoryJson.subSubCategoryName = subSubCategory.name;

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

// Match 
exports.getLostMatch = async (req, res) => {
  try {

    //get the lost object information
    const lostJsonObject = {};
    const lostObject = await LostObjectModel.findById(req.body.lostObjectId);
    if (!lostObject) {
      return res.status(404).json({ error: 'LostObject not found' });
    }
    const categoryName = await CategoryModel.findById(lostObject.category);
    lostJsonObject.object_id = lostObject._id;
    lostJsonObject.owner = lostObject.owner;
    lostJsonObject.title = lostObject.title;
    lostJsonObject.description = lostObject.description;
    lostJsonObject.location = lostObject.location;
    lostJsonObject.price = lostObject.price;
    lostJsonObject.lostDate = lostObject.lostDate;
    lostJsonObject.status = lostObject.status;
    lostJsonObject.objectImage = lostObject.objectImage.length===0 ? ["default_obj_ht0fde"] : lostObject.objectImage;
    lostJsonObject.category_id = categoryName._id;
    lostJsonObject.category = categoryName.name;

    const subCategories = await ObjSubCategoryModel.find({ object: req.body.lostObjectId });
    const subCategoriesArray = [];

    for (const item of subCategories) {
      const subCategoryJson = {};
      const subCategory = await SubCategoryModel.findById(item.subCategory);
      subCategoryJson.objSubCategory_id = item._id;
      subCategoryJson.subCategory_id = subCategory._id;
      subCategoryJson.subCategory = subCategory.name;
      subCategoryJson.subSubCategories = item.subSubCategory;
      const subSubCategory = await SubSubCategoryModel.findById(item.subSubCategory);
      subCategoryJson.subSubCategoryName = subSubCategory.name;
      subCategoriesArray.push(subCategoryJson);
    }
    lostJsonObject.subCategories = subCategoriesArray;

    //get the found object information
    const foundObjects = await FoundObjectModel.find();
    if (!foundObjects) {
      return res.status(404).json({ error: 'FoundObjects not found' });
    }
    const foundArray = [];
    for (const item of foundObjects) {
      const foundJson = {};
      const categoryName = await CategoryModel.findById(item.category);
      foundJson.object_id = item._id;
      foundJson.userWhoFound = item.userWhoFound;
      foundJson.policeOfficerThatReceived = item.policeOfficerThatReceived;
      foundJson.title = item.title;
      foundJson.description = item.description;
      foundJson.location = item.location;
      foundJson.price = item.price;
      foundJson.foundDate = item.foundDate;
      foundJson.endDate = item.endDate;
      foundJson.status = item.status;
      foundJson.objectImage = item.objectImage.length===0 ? ["default_obj_ht0fde"] : item.objectImage;
      foundJson.category_id = categoryName._id;
      foundJson.category = categoryName.name;

      const subCategoriesFound = await ObjSubCategoryModel.find({ object: item._id });
      const subCategoriesArrayFound = [];
      for (const item2 of subCategoriesFound) {
        const subCategoryJson2 = {};
        const subCategory = await SubCategoryModel.findById(item2.subCategory);
        subCategoryJson2.objSubCategory_id = item2._id;
        subCategoryJson2.subCategory_id = subCategory._id;
        subCategoryJson2.subCategory = subCategory.name;
        subCategoryJson2.subSubCategories = item2.subSubCategory;
        const subSubCategory = await SubSubCategoryModel.findById(item2.subSubCategory);
        subCategoryJson2.subSubCategoryName = subSubCategory.name;
        subCategoriesArrayFound.push(subCategoryJson2);
      }
      foundJson.subCategories = subCategoriesArrayFound;
      foundArray.push(foundJson);
    }
    //copy the found array to another result array
    const resultArray = [];

    //compare the lost object with the found objects
    //Define the weights for each field
    const categoryWeight = 40;
    const titleWeight = 20;
    const descriptionWeight = 13;
    const locationWeight = 12;
    const subCategoryWeight = 10;
    const priceWeight = 5;

    //Analyse the fields
    for (var i=0; i<foundArray.length; i++){
      //compare the category
      var categorySimilarity = 0; 
      if (lostJsonObject.category === foundArray[i].category){
        categorySimilarity = categoryWeight;
      }

      //compare the title
      const responseTitle = await axios.get("https://api.dandelion.eu/datatxt/sim/v1/", { 
        params: {
          text1: lostJsonObject.title,
          text2: foundArray[i].title,
          lang: "en",
          token: DANDILION_API,
          bow: "always" 
        }
      });
      const titleSimilarity = responseTitle.data.similarity * titleWeight;

      //compare the description
      const responseDesc = await axios.get("https://api.dandelion.eu/datatxt/sim/v1/", { 
        params: {
          text1: lostJsonObject.description,
          text2: foundArray[i].description,
          lang: "en",
          token: DANDILION_API,
          bow: "always" 
        }
      });
      const descriptionSimilarity = responseDesc.data.similarity * descriptionWeight;

      //compare the location
      var locationSimilarity = 0;
      if (lostJsonObject.location === foundArray[i].location){
        locationSimilarity = locationWeight;
      }

      //compare the subcategories
      const subCategoriesLost = lostJsonObject.subCategories;
      const subCategoriesFound = foundArray[i].subCategories;
      var subCategoryEqualNumber = 0;
      var subCategorySimilarity = 0;

      console.log(subCategoriesFound);
      if (subCategoriesFound.length != 0){
        for (var j=0; j < subCategoriesLost.length; j++){
          if (subCategoriesLost[j].subCategory === subCategoriesFound[j].subCategory){
            subCategoryEqualNumber++;
            var subSimilarity = 0;
            if (subCategoriesLost[j].subSubCategoryName.toLowerCase() === subCategoriesFound[j].subSubCategoryName.toLowerCase()){
              subSimilarity = 1;
            }
            subCategorySimilarity += subSimilarity;
          }
        }
        subCategorySimilarity = (subCategorySimilarity/subCategoryEqualNumber) * subCategoryWeight;
      }

      //compare the price
      var priceSimilarity = 0;
      const p1 = lostJsonObject.price;
      const p2 = foundArray[i].price;
      const maxPrice = Math.max(p1, p2);
      priceSimilarity = (1/(1+(10*(Math.abs(p1-p2))/maxPrice)))*priceWeight;
      

      //calculate the total similarity
      const totalSimilarity = ((categorySimilarity + titleSimilarity + descriptionSimilarity + locationSimilarity + subCategorySimilarity + priceSimilarity)/(categoryWeight +titleWeight + descriptionWeight + locationWeight + subCategoryWeight + priceWeight)) * 100;
      foundArray[i].similarity = totalSimilarity;
      foundArray[i].similarityItems = {
        category: categorySimilarity,
        title: titleSimilarity,
        description: descriptionSimilarity,
        location: locationSimilarity,
        subCategory: subCategorySimilarity,
        price: priceSimilarity
      }

      //reject the found objects that have a similarity less than 1%
      if (totalSimilarity >= 1){
        resultArray.push(foundArray[i]);
      }
    }
    res.status(200).json(resultArray);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get LostObjects by User ID
exports.getLostObjectByUserId = async (req, res) => {
  try {
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
    
    const lostObject = await LostObjectModel.find({ owner:  owner._id });
    if (!lostObject) {
      return res.status(404).json({ error: 'LostObjects not found' });
    }
    
    const resArray = [];
    for (const item of lostObject) {
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
      resJson.objectImage = item.objectImage.length===0 ? ["default_obj_ht0fde"] : item.objectImage;
      resJson.category_id = categoryName._id;
      resJson.category = categoryName.name;
      resJson.coordinates = item.coordinates;

      const subCategories = await ObjSubCategoryModel.find({ object: item._id });
      const subCategoriesArray = [];
      for (const item1 of subCategories) {
        const subCategoryJson = {};
        const subCategory = await SubCategoryModel.findById(item1.subCategory);
        subCategoryJson.subCategory_id = subCategory._id;
        subCategoryJson.subCategory = subCategory.name;
        subCategoryJson.subSubCategory_id = item1.subSubCategory;
        const subSubCategory = await SubSubCategoryModel.findById(item1.subSubCategory);
        subCategoryJson.subSubCategoryName = subSubCategory.name;
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

// Get LostObjects by Description
exports.getLostObjectByDescription = async (req, res) => {
  try {
    const description = req.body.description;
    const lostObject = await LostObjectModel.find();

    const resArray = [];
    for (const item of lostObject) {
      const response = await axios.get("https://api.dandelion.eu/datatxt/sim/v1", { 
        params: {
          text1: description,
          text2: item.description,
          token: DANDILION_API,
          bow: "always",
          lang: "en" 
        }
      });
      if (response.data.similarity > 0.1){
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
        resJson.objectImage = item.objectImage.length===0 ? ["default_obj_ht0fde"] : item.objectImage;
        resJson.similarity = response.data.similarity;
        resJson.category_id = categoryName._id;
        resJson.category = categoryName.name;
        resJson.coordinates = item.coordinates;

        const subCategories = await ObjSubCategoryModel.find({ object: item._id });
        const subCategoriesArray = [];

        for (const item of subCategories) {
          const subCategoryJson = {};
          const subCategory = await SubCategoryModel.findById(item.subCategory);
          subCategoryJson.objSubCategory_id = item._id;
          subCategoryJson.subCategory_id = subCategory._id;
          subCategoryJson.subCategory = subCategory.name;
          subCategoryJson.subSubCategories = item.subSubCategory;
          const subSubCategory = await SubSubCategoryModel.findById(item.subSubCategory);
          subCategoryJson.subSubCategoryName = subSubCategory.name;
          subCategoriesArray.push(subCategoryJson);
        }

        resJson.subCategories = subCategoriesArray;
        resArray.push(resJson);
      }
    }

    if (!lostObject) {
      return res.status(404).json({ error: 'LostObjects not found' });
    }
    res.status(200).json(resArray);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get LostObjects by categories
exports.getLostObjectByCats = async (req, res) => {
  try {
    const catId = req.params.catId;
    const subCatId = req.params.subCatId;
    const subSubCatId = req.params.subSubCatId;

    let commonObjects = [];
    let objIds = [];
  
    const objlist1 = await LostObjectModel.find({ category: catId }).lean(); 

    if (subCatId && subSubCatId && subCatId !== "null" && subSubCatId !== "null") {
      
      const objCatlist = await ObjSubCategoryModel.find({ subCategory: subCatId, subSubCategory: subSubCatId }).lean();
      objIds = objCatlist.map(item => item.object.toString()); 
      commonObjects = objlist1.filter(obj => objIds.includes(obj._id.toString()));

    } else {
      commonObjects = objlist1;
    }

    const resArray = [];
    for (const item of commonObjects) {
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
      resJson.objectImage = item.objectImage.length===0 ? ["default_obj_ht0fde"] : item.objectImage;
      resJson.category_id = categoryName._id;
      resJson.category = categoryName.name;
      resJson.coordinates = item.coordinates;

      const subCategories = await ObjSubCategoryModel.find({ object: item._id }).lean();
      const subCategoriesArray = [];
      for (const item1 of subCategories) {
        const subCategoryJson = {};
        const subCategory = await SubCategoryModel.findById(item1.subCategory);
        subCategoryJson.subCategory_id = subCategory._id;
        subCategoryJson.subCategory = subCategory.name;
        subCategoryJson.subSubCategory_id = item1.subSubCategory;
        const subSubCategory = await SubSubCategoryModel.findById(item1.subSubCategory);
        subCategoryJson.subSubCategoryName = subSubCategory.name;
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

// Accept (not tested)
exports.acceptLostMatch = async (req, res) => {
  try {
    const lostObjectId = req.body.lostObjectId;
    const foundObjectId = req.body.foundObjectId;
    const lostObject = await LostObjectModel.findById(lostObjectId);
    if (!lostObject) {
      return res.status(404).json({ error: 'LostObject not found' });
    }
    const foundObject = await FoundObjectModel.findById(foundObjectId);
    if (!foundObject) {
      return res.status(404).json({ error: 'FoundObject not found' });
    }
    lostObject.status = 'accepted';
    foundObject.status = 'accepted';
    foundObject.claimant = lostObject.owner;
    await lostObject.save();
    await foundObject.save();

    const owner = await OwnerModel.findById(lostObject.owner);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    const user = await UserModel.findById(owner.user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const policeOfficer = await PoliceOfficerModel.findById(foundObject.policeOfficerThatReceived);
    if (!policeOfficer) {
      return res.status(404).json({ error: 'PoliceOfficer not found' });
    }
    const policeStation = await PoliceStationModel.findById(policeOfficer.station);
    if (!policeStation) {
      return res.status(404).json({ error: 'PoliceStation not found' });
    }
    
    //send an email to the owner of the lost object
    let transporter = nodemailer.createTransport({
      service: 'gmail', // or use another email service
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    var text = `Hi ${user.first_name} ${user.last_name},\n You accepected the match with delivered object ${foundObject.title}.\nGo to ${policeStation.name}, ${policeStation.address}, ${policeStation.zip_code} to get your object back. Present this codes: \nFound Object: ${foundObject._id}\nLost Object: ${lostObject._id}`;  
    var line1 = `Hi ${user.first_name} ${user.last_name},`
    var line2 = `You accepected the match with delivered object ${foundObject.title}.`
    var line3 = `Go to ${policeStation.name}, ${policeStation.address}, ${policeStation.zip_code} to get your object back.`
    var line4 = `Present this codes:`
    var line5 = `Found Object: ${foundObject._id}`
    var line6 = `Lost Object: ${lostObject._id}`

    let mailOptions = {
      from: "no-reply@bidfinder.ddns.net",
      to: user.email,
      subject: "Match accepted",
      text: text,
      html: `
      <p>${line1}</p>
      <p>${line2}</p>
      <p>${line3}</p>
      <p>${line4}</p>
      <p>${line5}</p>
      <p>${line6}</p>
      <img src="cid:unique@icon.cid" alt="Icon" />`,
      attachments: [
          {
              filename: 'icon.png',
              path: 'logo.png',
              cid: 'unique@icon.cid'
          }
      ]
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Match accepted successfully an email was sent to you with the information of the object'});
  } catch (error) {
    errorHandler(res, error);
  }
};

// List Claimed Lost Objects (not tested)
exports.getClaimedLostObject = async (req, res) => {
  try {
    const ownerId = req.params.ownerid;
    const owner = await OwnerModel.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    const claimedLostObjects = await LostObjectModel.find({ owner: owner._id, status: 'Claimed' });
    if (!claimedLostObjects) {
      return res.status(404).json({ error: 'Claimed LostObjects not found' });
    }
    const resArray = [];
    for (const item of claimedLostObjects) {
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
      resJson.objectImage = item.objectImage.length===0 ? ["default_obj_ht0fde"] : item.objectImage;
      resJson.category_id = categoryName._id;
      resJson.category = categoryName.name;
      resJson.coordinates = item.coordinates;
      
      const subCategories = await ObjSubCategoryModel.find({ object: item._id });
      const subCategoriesArray = [];
      for (const item of subCategories) {
        const subCategoryJson = {};
        const subCategory = await SubCategoryModel.findById(item.subCategory);
        subCategoryJson.objSubCategory_id = item._id;
        subCategoryJson.subCategory_id = subCategory._id;
        subCategoryJson.subCategory = subCategory.name;
        subCategoryJson.subSubCategories = item.subSubCategory;
        const subSubCategory = await SubSubCategoryModel.findById(item.subSubCategory);
        subCategoryJson.subSubCategoryName = subSubCategory.name;
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

//------------------------------------------------------------------Found Object Functions ---------------------------------------------------------------------

// Create a new FoundObject
exports.createFoundObject = async (req, res) => {
  try {
    const resJson = {};

    let objectImages=[];
    if (req.files) {
      objectImages= await uploadImages(req.files);
    }
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
      objectImage: objectImages,
      coordinates: req.body.coordinates
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
      const subCategoryCheck = await SubCategoryModel.findOne({ name: subCategory[key].name, category: new ObjectId(category._id) });
      if (!subCategoryCheck) {
        return res.status(404).json({ error: 'SubCategory: ' + subCategory[key].name + ' not found' });
      }

      const subSubCategoryCheck = await SubSubCategoryModel.findOne({ name: subCategory[key].subSubCategory});
      if (!subSubCategoryCheck) {
        return res.status(404).json({ error: 'SubSubCategory: ' + subCategory[key].subCategory + ' not found' });
      }

      const subSubCategoryAssociationCheck = await SubSubCategoryAssociationModel.findOne({ subCategory: new ObjectId(subCategoryCheck._id), subSubCategory: new ObjectId(subSubCategoryCheck._id) });
      if (!subSubCategoryAssociationCheck) {
        return res.status(404).json({ error: 'SubCategory ' + subCategory[key].name + ' and SubSubCategory ' + subCategory[key].subCategory + ' not associated'});
      }

      const subCategoryArgs = {
        object: newFoundObject._id,
        subCategory: subCategoryCheck._id,
        subSubCategory: subSubCategoryCheck._id
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
      resJson.objectImage = item.objectImage.length===0 ? ["default_obj_ht0fde"] : item.objectImage;
      resJson.category_id = categoryName._id;
      resJson.category = categoryName.name;
      resJson.coordinates = item.coordinates;

      const subCategories = await ObjSubCategoryModel.find({ object: item._id });
      const subCategoriesArray = [];
      for (const item of subCategories) {
        const subCategoryJson = {};
        const subCategory = await SubCategoryModel.findById(item.subCategory);
        subCategoryJson.objSubCategory_id = item._id;
        subCategoryJson.subCategory_id = subCategory._id;
        subCategoryJson.subCategory = subCategory.name;
        subCategoryJson.subSubCategories = item.subSubCategory;
        const subSubCategory = await SubSubCategoryModel.findById(item.subSubCategory);
        subCategoryJson.subSubCategoryName = subSubCategory.name;
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
    resJson.objectImage = foundObject.objectImage.length==0 ? ["default_obj_ht0fde"] : foundObject.objectImage;
    resJson.category_id = categoryName._id;
    resJson.category = categoryName.name;
    resJson.coordinates = foundObject.coordinates;

    const subCategories = await ObjSubCategoryModel.find({ object: foundObject._id });
    const subCategoriesArray = [];
    for (const item of subCategories) {
      const subCategoryJson = {};
      const subCategory = await SubCategoryModel.findById(item.subCategory);
      subCategoryJson.objSubCategory_id = item._id;
      subCategoryJson.subCategory_id = subCategory._id;
      subCategoryJson.subCategory = subCategory.name;
      subCategoryJson.subSubCategories = item.subSubCategory;
      const subSubCategory = await SubSubCategoryModel.findById(item.subSubCategory);
      subCategoryJson.subSubCategoryName = subSubCategory.name;
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

    const auctionsFound = await AuctionModel.find({ foundObject: new ObjectId(foundObjectId) });
    for (const item of auctionsFound) {
      await AuctionModel.findByIdAndDelete(item._id);
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
