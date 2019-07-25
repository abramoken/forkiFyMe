const key = '1ba4a9588b86821d40cb865f4af5efe8';
/** Controller Begin */
//All elements in DOM
//let cub = import("./try.js");
//import Me from './try.js';
import index, { Fraction } from '../../node_modules/fractional/index.js';
import List from './List.js';
import Likes from './Likes.js';
//import("./try.js");

const elements = {
  searchForm: document.querySelector('.search'),
  searchInPut: document.querySelector('.search__field'),
  searchResLoader: document.querySelector('.results'),
  searchResList: document.querySelector('.results__list'),
  searchResPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  likesMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list')
};

const elementStrings = {
  loader: 'loader'
};

//Loader
const renderLoader = parent => {
  const loader = `
        <div class="${elementStrings.loader}">
            <svg class="">
                <use href="dist/img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    loader.parentElement.removeChild(loader);
  }
};

/** Controller End */

//Search View
const getInput = () => elements.searchInPut.value;
//Clearing the input field
const clearInput = () => {
  elements.searchInPut.value = '';
};
//Clearing the search results
const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

const clearRecipes = () => {
  elements.recipe.innerHTML = '';
};

//Shortening the recipe titles to one line
/* E.g pasta with tomata and spinach
    acc: 0 / acc + cur.length = 5 / newTitle = ['pasta']
    acc: 5 / acc + cur.length = 9 / newTitle = ['pasta','with']
    acc: 9 / acc + cur.length = 15 / newTitle = ['pasta','with', 'tomato']
    acc: 15 / acc + cur.length = 18 / newTitle = ['pasta','with', 'tomato']
    acc: 18 / acc + cur.length = 24 / newTitle = ['pasta','with', 'tomato']
*/
const limitRecipeTitle = (titles, limit = 17) => {
  const newTitle = [];
  if (titles.length > limit) {
    titles.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    //return the result
    return `${newTitle.join(' ')} ...`;
  }
  return titles;
};
/* UI CONTROLLER Begin*/
//Rendering the html
const renderRecipe = recipe => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const highLightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach(el => {
    el.classList.remove('results__link--active');
  });
  document
    .querySelector(`.results__link[href*="${id}"]`)
    .classList.add('results__link--active');
};

const formatCount = count => {
  if (count) {
    //count = 2.5 --> 2 1/2
    //count = 0.5 --> 1/2
    const newCount = Math.round(count * 100) / 100;
    const [int, dec] = newCount
      .toString()
      .split('.')
      .map(el => parseInt(el, 10));
    if (!dec) return newCount;
    if (int === 0) {
      const fr = new Fraction(newCount);
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      //const a = newCount - int;
      const fr = new Fraction(newCount - int);
      return `${int} ${fr.numerator}/${fr.denominator}`;
    }
  }
  return '?';
};
const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  document
    .querySelector('.recipe__love use')
    .setAttribute('href', `dist/img/icons.svg#${iconString}`);
  //icons.svg#icon-heart-outlined
};
const toggleLikeMenu = numLikes => {
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};
const renderLike = like => {
  const markup = `
         <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
  elements.likesList.insertAdjacentHTML('beforeend', markup);
};
const deleteLike = id => {
  const el = document.querySelector(`.likes__link[href*="${id}"]`)
    .parentElement;
  if (el) el.parentElement.removeChild(el);
};
const createIngredient = ingredient => `
        <li class="recipe__item">
            <svg class="recipe__icon">
                <use href="dist/img/icons.svg#icon-check"></use>
            </svg>
        <div class="recipe__count">${formatCount(
          ingredient.count
        )}</div> <!-- Edit Here with formatCount(ingredient.count) --> 
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
        </li>
`;
const renderRecipe2 = (recipe, isLiked) => {
  const markup = `
            <figure class="recipe__fig">
                <img src="${recipe.img}" alt="${
    recipe.title
  }" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="dist/img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${
                      recipe.time
                    }</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="dist/img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${
                      recipe.servings
                    }</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="dist/img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="dist/img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="dist/img/icons.svg#icon-heart${
                          isLiked ? '' : '-outlined'
                        }"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(el => createIngredient(el)).join('')}
                   

                </ul>

                <button class="btn-small recipe__btn recipe__btn-add">
                    <svg class="search__icon">
                        <use href="dist/img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${
                      recipe.author
                    }</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${
                  recipe.url
                }" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="dist/img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>
    `;
  elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

const updateServingsIngredients = recipe => {
  //Update servings
  document.querySelector('.recipe__info-data--people').textContent =
    recipe.servings;
  //Update Ingredients
  const countElements = Array.from(document.querySelectorAll('.recipe__count'));
  countElements.forEach((el, i) => {
    el.textContent = formatCount(recipe.ingredients[i].count); //Edit Here
  });
};

//const l = new List();
window.l = new List();

const renderItem = item => {
  const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${
    item.count
  }" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="dist/img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
  elements.shopping.insertAdjacentHTML('beforeend', markup);
};

const deleteItem = id => {
  const item = document.querySelector(`[data-itemid="${id}"]`);
  item.parentElement.removeChild(item);
};

/* UI CONTROLLER End*/
//type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="../dist/img/icons.svg#icon-triangle-${
              type === 'prev' ? 'left' : 'right'
            }"></use>
        </svg>
    </button>
`;
//Rendering buttons for pages
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    //Only button to go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    //Both buttons for next and previous
    button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
            `;
  } else if (page === pages && pages > 1) {
    //Only button to go to previous page
    button = createButton(page, 'prev');
  }
  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};
const renderResults = (recipes, page = 1, resPerPage = 10) => {
  //render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);
  //render pagination button
  renderButtons(page, recipes.length, resPerPage);
};

//Recipe Search Model
class Search {
  constructor(query) {
    this.query = query;
  }
  async getRequest() {
    try {
      const res = await axios(
        `https://www.food2fork.com/api/search?key=${key}&q=${this.query}`
      );
      this.result = res.data.recipes;
      //console.log(this.result);
    } catch (error) {
      //console.log(error);
      alert('Something is wrong with the request...');
    }
  }
}

//Recipe Search Controller
/** Global state of the app
 * -search object
 * -current recipe object
 * -shopping list object
 * -liked recipes
 */
const state = {};
const controlSearch = async () => {
  //1. Get query from view
  const query = getInput(); //later
  if (query) {
    //2. New search object and add to state
    state.search = new Search(query);
    //3. Prepare UI for results
    clearInput();
    clearResults();
    renderLoader(elements.searchResLoader);
    try {
      //4. Search for recipes
      await state.search.getRequest();
      //5. Render results on UI
      clearLoader();
      renderResults(state.search.result);
    } catch (error) {
      //console.log(error);
      alert('Something is wrong with the search...');
      clearLoader();
    }
  }
};
//search btn eventListener
elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
//Pagination btn eventListener
elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    clearResults();
    renderResults(state.search.result, goToPage);
  }
});

//Recipe Controller
/* Geting each recipe*/
class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      //console.log(error);
      alert('Something went wrong :(');
    }
  }
  calcTime() {
    //Assuming that we need 15 min for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
  parseIngredients() {
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds'
    ];
    const unitsShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound'
    ];
    const units = [...unitsShort, 'kg', 'g'];
    const newIngredients = this.ingredients.map(el => {
      //1. Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      //2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
      //3. parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
      let objIng;
      if (unitIndex > -1) {
        //There is a unit
        //Ex. 4 1/2 cups, arrCount is [4, 1/2]
        //Ex. 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrCount[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };
      } else if (parseInt(arrIng[0], 10)) {
        //There is no unit but 1st element is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        };
      } else if (unitIndex === -1) {
        //There is no unit and no number in 1st position
        objIng = {
          count: 1,
          unit: '',
          ingredient
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    //Servings
    const newServing = type === 'dec' ? this.servings - 1 : this.servings + 1;
    //Ingredients
    this.ingredients.forEach(ing => {
      ing.count *= newServing / this.servings;
    });
    this.servings = newServing;
  }
}

/** RECIPE CONTROLLER Begin */
// const r = new Recipe(46956);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
  //Get Id from URL
  const id = window.location.hash.replace('#', '');
  //console.log(id);
  if (id) {
    //Prepare UI for changes
    clearRecipes();
    renderLoader(elements.recipe);
    //Highlight selected search item
    if (state.search) highLightSelected(id);
    //Create new recipe object
    state.recipe = new Recipe(id);
    try {
      //Get recipe data and parse recipes
      await state.recipe.getRecipe();
      //console.log(state.recipe.ingredient);
      state.recipe.parseIngredients();
      //Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      //Render recipe
      clearLoader();
      renderRecipe2(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      //   console.log(error);
      alert('Error processing recipe!');
    }
  }
};
/*
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
Same as below with an ARRAY
*/
['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

/**LIST CONTROLLER */
const controlList = () => {
  //Create a new list if there is none yet
  if (!state.list) state.list = new List();
  //Add each ingredient to the list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    renderItem(item);
  });
};

//UI CONTROLER
//Handling delete and update list events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  //Handling the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    //Delete from state
    state.list.deleteItem(id);
    //Delete from UI
    deleteItem(id);
    //Handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/**LIKE CONTROLLER */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  //User has NOT yet liked the current recipe
  if (!state.likes.isLiked(currentID)) {
    //Add liked to state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle the like button
    toggleLikeBtn(true);
    //Add liked to the UI
    renderLike(newLike);

    //User HAS liked the current recipe
  } else {
    //Remove liked from state
    state.likes.deleteLike(currentID);
    //Toggle the like button
    toggleLikeBtn(false);
    //Remove liked from the UI
    deleteLike(currentID);
    // console.log(state.likes);
  }
  toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  //Restore likes that are liked
  state.likes.readStorage();
  //Toggle like menu button
  toggleLikeMenu(state.likes.getNumLikes());
  //Render the existing likes to UI
  state.likes.likes.forEach(like => renderLike(like));
});

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    //Decrease button if clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    //Increase button if clicked
    state.recipe.updateServings('inc');
    updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
    //Add ingredients to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    //Like controller
    controlLike();
  }
  //console.log(state.recipe);
});
