import icons from 'url:../../img/icons.svg';
// icons is simply the path to the new icons file
import View from './View.js';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');//looking for the btn that was clicked
            if(!btn) return;
            const goToPage = +btn.dataset.goto;

            handler(goToPage);
        })
    }

    _generateMarkup(){
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        // Page 1 and there are other pages
        const curPage = this._data.page;
        if(curPage === 1 && numPages > 1){
            return `<button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>`;
        }
        // Last page
        if(curPage === numPages && numPages > 1){
            return `<button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>`;
        }
        // Other page
        if(curPage < numPages){
            return `<button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                        <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                        </svg>
                        <span>Page ${curPage - 1}</span>
                    </button><button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>`;
        }

        // Page 1 and no other pages
        return ''
    }

}
export default new PaginationView();