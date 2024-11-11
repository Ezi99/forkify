import { API_URL } from "./config";
import { getJSON } from "./helpers";
import { RECIPES_PER_PAGE } from "./config";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    currentPage: 1,
    resultsPerPage: RECIPES_PER_PAGE,
  },
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

export const loadSearchResults = async function (query) {
  state.search.query = query;
  const body = await getJSON(API_URL + "/?search=" + query);

  state.search.results = body.data.recipes.map((recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
    };
  });
};

export const getRecipesForPage = function (page = state.search.currentPage) {
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  state.search.currentPage = page;

  return state.search.results.slice(start, end);
};

export const updateServings = function (servingsNum) {
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity =
      (ingredient.quantity * servingsNum) / state.recipe.servings;
  });

  state.recipe.servings = servingsNum;
};
