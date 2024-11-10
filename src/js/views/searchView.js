import View from "./View";

class SearchView extends View {
  _parentElement = document.querySelector(".search");

  getQuery() {
    const query = this._parentElement.querySelector(".search__field").value;
    this._parentElement.querySelector(".search__field").value = "";
    return query;
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener("submit", function (event) {
      event.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
