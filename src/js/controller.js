import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function () {
  const id = window.location.hash.slice(1);

  if (!id) return;

  try {
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (erorr) {
    recipeView.renderError();
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};

init();
