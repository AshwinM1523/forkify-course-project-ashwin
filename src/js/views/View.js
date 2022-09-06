// Parent class view file
import icons from 'url:../../img/icons.svg';

export default class View{
    _data;

    render(data, render = true){
        if(!data || (Array.isArray(data)) && data.length === 0) return this.renderError();
        this._data = data;
        const markup = this._generateMarkup();

        if(!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);

    }

    update(data){
        if(!data) return this.renderError();
        this._data = data;
        const newMarkup = this._generateMarkup();
        // We only change attributes that have been changed from the old html

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        // Convert the string into read DOM node objects, not really living on the page but in the memory
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));


        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            
            // Updates changed text
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
                curEl.textContent = newEl.textContent;
            }
            // Updates changed Attributes
            if(!newEl.isEqualNode(curEl)){
                // Will return the objects of all attributes that have changed
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
                // Replace all the attributes in curEl from newEl
            }
        })
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }
    
    renderSpinner(parentEl){
        const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
      
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this._errMsg){
        const markup = `<div class="error">
            <div>
            <svg>
                <use href="${icons}#icon-alert-triangle"></use>
            </svg>
            </div>
            <p>${message}</p>
             </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);

    }

    renderMsg(message = this._message){
        const markup = `<div class="message">
            <div>
            <svg>
                <use href="${icons}#icon-smile"></use>
            </svg>
            </div>
            <p>${message}</p>
             </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);

    }
}