import { async } from "regenerator-runtime";
import * as config from './config.js';
import { AJAX } from './helpers.js';
import { RES_PER_PAGE } from './config.js'

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
};

const createRecipeObject = function(data){
    const {recipe} = data.data;
    return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients, //ingredients is another object with quantity, units, and description
    ...(recipe.key && { key: recipe.key }),
    };
}

export const loadRecipe = async function(id){
    try{

        const data = await AJAX(`${config.API_URL}${id}?key=${config.KEY}`);
        state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(bookmark => bookmark.id === id)){
            state.recipe.bookmarked = true;
        }else{
            state.recipe.bookmarked = false;
        }
        // if there is any bookmark with the same id as the id we just recieved then

    }catch(err){
        throw err;
    }
}

export const loadSearchResults = async function(query){
    try{
    state.search.query = query;
    const data = await AJAX(`${config.API_URL}?search=${query}&key=${config.KEY}`);

    state.search.results = data.data.recipes.map(rec => {
        return {
            id: rec.id,
            title: rec.title,
            publisher: rec.publisher,
            image: rec.image_url,
            ...(rec.key && { key: rec.key }),
        }
    });
    // rename all the objects in the array
    state.search.page = 1;
    }catch(err){
        throw err;
    }
}

export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page;

    // Requested page 1, start 0 end 10 (slice does not include last value so 9)
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
}

export const updateServings = function(numServings){
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * (numServings / state.recipe.servings);
        // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
    });

    state.recipe.servings = numServings;
}

const persistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}


export const addBookmark = function(recipe){
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

export const removeBookmark = function(id){
    // Remove bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as Not bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();

}

const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);//convert string back to object
}
init();

const clearBookmarks = function(){
    localStorage.clear('bookmarks');
};

export const uploadRecipe = async function(newRecipe){
    try{
        // convert array into object
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && 
        entry[1] !== '').map(ing => {
            const ingArr = ing[1].split(',').map(el => el.trim());

            if(ingArr.length !== 3) throw new Error('Wrong ingredient format');

            const [quantity, unit, description] = ingArr;


            return {quantity: quantity ? +quantity : null , unit, description};
        });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }
        const data = await AJAX(`${config.API_URL}?key=${config.KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);

    }catch(err){
        throw err;
    }
}
