import View from "./View.js";
import icons from 'url:../../img/icons.svg';
import previewView from "./previewView.js";


class BookmarksView extends View{
    _parentElement = document.querySelector('.bookmarks__list');
    _errMsg = 'No Bookmarks Yet!';
    _message = '';

    addHandlerRender(handler){
        window.addEventListener('load', handler);
    }

    _generateMarkup(){
        return this._data.map(bookmarks => previewView.render(bookmarks, false)).join('');

        // Since it is an array of many objects we will join them in the end as one string
    }

}
export default new BookmarksView();