import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    this._insertMarkup(this._generateMarkup());
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const currElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];

      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        currEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(currEl)) {
        console.log(newEl);
        Array.from(newEl.attributes).forEach((attr) =>
          currEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _insertMarkup(markup) {
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("beforeend", markup);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._insertMarkup(markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
        <p>${message}</p>
    </div>
          `;
    this._insertMarkup(markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
         </div>
         <p>${message}</p>
    </div>
          `;
    this._insertMarkup(markup);
  }
}
