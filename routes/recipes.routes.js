import express from "express";
import RecipeModel from "../models/Recipe.model.js";
import recipesFromJson from "../data.json" assert { type: "json" };

const recipesRoutes = express.Router();

recipesRoutes.get("/all", async (req, res) => {
  try {
    const receitas = await RecipeModel.find();
    return res.status(200).json(receitas);
  } catch (e) {
    console.log(e);
    return res.status(500).json("Erro ao realizar a consulta!");
  }
});

recipesRoutes.post("/create", async (req, res) => {
  try {
    const receita = { ...req.body };
    const newReceita = await RecipeModel.create(receita);
    return res.status(201).json(newReceita);
  } catch (e) {
    console.log(e);
    return res.status(500).json("Erro ao criar a receita.");
  }
});

recipesRoutes.post("/import", async (req, res) => {
  try {
    await RecipeModel.insertMany(recipesFromJson);
    const filter = {};
    const projections = { title: 1 };
    const receitas = await RecipeModel.find(filter, projections);
    return res.status(201).json(receitas);
  } catch (e) {
    console.log(e);
    return res.status(500).json("Erro ao importar as receitas.");
  }
});

recipesRoutes.put("/update/:field/:value", async (req, res) => {
  const { field, value } = req.params;
  let filter = {};
  filter[field] = value.replaceAll("+", " ");
  const update = { ...req.body };
  try {
    const updRecipe = await RecipeModel.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json(updRecipe);
  } catch (e) {
    console.log(e);
    return res.status(500).json("Erro na atualização da receita.");
  }
});

recipesRoutes.delete("/delete/:field/:value", async (req, res) => {
  const { field, value } = req.params;
  let filter = {};
  filter[field] = value.replaceAll("+", " ");
  try {
    const delRecipe = await RecipeModel.deleteOne(filter);
    return res.status(200).json(delRecipe);
  } catch (e) {
    console.log(e);
    return res.status(500).json("Não foi possível apagar a receita.");
  }
});

export default recipesRoutes;
