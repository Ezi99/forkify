import { API_URL } from "./config";
import { getJSON } from "./helpers";

export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  const body = await getJSON(API_URL + "/" + id);
  let { recipe } = body.data;
  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
  };
};
