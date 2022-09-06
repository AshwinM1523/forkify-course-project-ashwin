import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/SearchView.js';
import ResultsView from './views/ResultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { MODEL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
// Pollyfilling everything else
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// Pollyfilling async await

// if(module.hot){
//   module.hot.accept();
// }

///////////////////////////////////////

const controlRecipes = async function(){
  try{
    const id = window.location.hash.slice(1);
    // gives everything in the url following the hash including the has
    if(!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    ResultsView.update(model.getSearchResultsPage()); //if id is equal to url # then add selected class
    // Update Bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);
    // it is an async function which returns a promise so we must wait
    // Rendering Recipe
    recipeView.render(model.state.recipe);


  }catch(err){
    recipeView.renderError();
  }
};

const controlSearchResults = async function(){
  try{
    // Get search query
    ResultsView.renderSpinner();
    const query = SearchView.getQuery();
    if(!query) return;
    
    // Load search results
    await model.loadSearchResults(query);

    // Render Results
    ResultsView.render(model.getSearchResultsPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);

  }catch(err){
    console.log(err);
  }
}

const controlPagination = function(goToPage){
      // Render new Result
      ResultsView.render(model.getSearchResultsPage(goToPage));//updates state page value

      // Render new pagination buttons
      paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}

const controlAddBookmark = function(){

  // Add/remove bookmarks
  if(!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
  }else{
    model.removeBookmark(model.state.recipe.id);
  }
  // Update Recipe View
  recipeView.update(model.state.recipe);

  // Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
    // Spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    
    // Render Recipe
    recipeView.render(model.state.recipe);

    // Sucess msg
    addRecipeView.renderMsg();

    // Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  }catch(err){
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
}
init();

