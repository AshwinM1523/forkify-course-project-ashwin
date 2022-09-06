import icons from 'url:../../img/icons.svg';
// icons is simply the path to the new icons file
import View from './View.js';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    _message = 'Recipe was uploaded Successfully';

    constructor(){
        super();
        this._addHandlerShowWindow();
        // function gets called as soon as object is created
        this._addHandlerHideWindow();
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
        // toggle, will add the class if not there and remove if it is already
        // We do not put with handler b/c this would be with btn

    }

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerUpload(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();

            const dataArray = [...new FormData(this)];
            const data = Object.fromEntries(dataArray);
            handler(data);

        });
    }

    _generateMarkup(){

    }

}
export default new AddRecipeView();