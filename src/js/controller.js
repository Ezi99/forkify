import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  const id = window.location.hash.slice(1);

  if (!id) return;

  try {
    recipeView.renderSpinner();
    resultsView.update(model.getRecipesForPage());
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    resultsView.renderSpinner();

    if (!query) return;

    await model.loadSearchResults(query);
    resultsView.render(model.getRecipesForPage());

    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getRecipesForPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (servingsNum) {
  model.updateServings(servingsNum);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerRender(controlPagination);
};

init();
