const mongoose = require('mongoose');
const { LostObjectModel, FoundObjectModel, CategoryModel, ObjSubCategoryModel, SubCategoryModel } = require('../models/Object');
const { UserModel, OwnerModel, PoliceOfficerModel } = require('../models/User');
// Função para contar usuários por função
const getUsersCountByRole = async () => {
  return UserModel.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ]);
};

// Função para contar policiais por estação
const getPoliceOfficersByStation = async () => {
  return PoliceOfficerModel.aggregate([
    { $group: { _id: "$station", count: { $sum: 1 } } },
    { $lookup: { from: "policestations", localField: "_id", foreignField: "_id", as: "stationDetails" } },
    { $unwind: "$stationDetails" },
    { $project: { name: "$stationDetails.name", count: 1 } }
  ]);
};

// Função para contar objetos perdidos por categoria
const getLostObjectsByCategory = async () => {
  return LostObjectModel.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "categoryDetails" } },
    { $unwind: "$categoryDetails" },
    { $project: { name: "$categoryDetails.name", count: 1 } }
  ]);
};

// Função para contar objetos encontrados por categoria
const getFoundObjectsByCategory = async () => {
  return FoundObjectModel.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "categoryDetails" } },
    { $unwind: "$categoryDetails" },
    { $project: { name: "$categoryDetails.name", count: 1 } }
  ]);
};

// Função para contar usuários por gênero
const getUsersCountByGender = async () => {
  return UserModel.aggregate([
    { $group: { _id: "$gender", count: { $sum: 1 } } }
  ]);
};

// Função para contar usuários por status
const getUsersCountByStatus = async () => {
  return UserModel.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
};

exports.getStatistics = async (req, res) => {
  try {
    const usersByRole = await getUsersCountByRole();
    const policeOfficersByStation = await getPoliceOfficersByStation();
    const lostObjectsByCategory = await getLostObjectsByCategory();
    const foundObjectsByCategory = await getFoundObjectsByCategory();
    const usersByGender = await getUsersCountByGender();
    const usersByStatus = await getUsersCountByStatus();

    res.status(200).json({
      usersByRole,
      policeOfficersByStation,
      lostObjectsByCategory,
      foundObjectsByCategory,
      usersByGender,
      usersByStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
