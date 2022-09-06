import View from "./View.js";
import icons from 'url:../../img/icons.svg';
import previewView from "./previewView.js";


class ResultsView extends View{
    _parentElement = document.querySelector('.results');
    _errMsg = 'No Recipes Found for the Entered Product! Please Try Again';
    _message = '';

    _generateMarkup(){
        return this._data.map(bookmarks => previewView.render(bookmarks, false)).join('');

        // Since it is an array of many objects we will join them in the end as one string
    }

}
export default new ResultsView();