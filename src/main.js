import App from "./App.jsx";
import render from "../libs/core/render.js";

const root = document.getElementById("root");

function rerender() {
  root.innerHTML = "";
  const appElement = App();

  render(appElement, root);
}

rerender();

export default rerender;
