import View from "./View";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currPage = this._data.currentPage;
    let markup;

    if (currPage === 1 && numPages > 1) {
      markup = this._generatePageButton(currPage + 1, "next");
    } else if (currPage === numPages && numPages > 1) {
      markup = this._generatePageButton(currPage - 1, "prev");
    } else if (numPages > 1) {
      markup =
        this._generatePageButton(currPage - 1, "prev") +
        this._generatePageButton(currPage + 1, "next");
    } else {
      markup = "";
    }

    return markup;
  }

  _generatePageButton(page, buttonType) {
    const arrowType = buttonType === "prev" ? "left" : "right";
    return `
        <button data-goto="${page}" class="btn--inline pagination__btn--${buttonType}">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-${arrowType}"></use>
            </svg>
            <span>Page ${page}</span>
        </button>
    `;
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener("click", function (event) {
      const btn = event.target.closest(".btn--inline");

      if (btn) {
        const goToPage = Number(btn.dataset.goto);
        handler(goToPage);
      }
    });
  }
}

export default new PaginationView();
