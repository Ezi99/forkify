import { API_URL, KEY } from "./config";
import { AJAX } from "./helpers";
import { RECIPES_PER_PAGE } from "./config";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    currentPage: 1,
    resultsPerPage: RECIPES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: false,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  const body = await AJAX(API_URL + "/" + id + "/?key=" + KEY);
  state.recipe = createRecipeObject(body);

  if (state.bookmarks.some((bookmark) => bookmark.id === id))
    state.recipe.bookmarked = true;
};

export const loadSearchResults = async function (query) {
  state.search.query = query;
  const body = await AJAX(API_URL + "/?search=" + query + "&key=" + KEY);

  state.search.currentPage = 1;
  state.search.results = body.data.recipes.map((recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      ...(recipe.key && { key: recipe.key }),
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

const presistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  presistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  presistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
    .map((ingredient) => {
      const ingredientArray = ingredient[1].split(",").map((el) => el.trim());

      if (ingredientArray.length !== 3) {
        throw new Error(
          "Wrong ingredient format, Please use the correct format"
        );
      }

      let [quantity, unit, description] = ingredientArray;
      quantity = quantity ? Number(quantity) : null;

      return { quantity, unit, description };
    });

  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: Number(newRecipe.cookingTime),
    servings: Number(newRecipe.servings),
    ingredients,
  };

  const data = await AJAX(API_URL + "/?key=" + KEY, recipe);
  state.recipe = createRecipeObject(data);
  addBookark(state.recipe);
};

const init = function () {
  const storedBookmarks = localStorage.getItem("bookmarks");

  if (storedBookmarks) {
    state.bookmarks = JSON.parse(storedBookmarks);
  }
};

init();
