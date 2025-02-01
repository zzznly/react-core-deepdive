import App from "./App.jsx";
import render from "../libs/core/render.ts";

const root = document.getElementById("root");

function rerender() {
  const appElement = App();

  console.log("appElement: ", appElement);
  console.log("root before rendering: ", root, root?.firstElementChild);

  render(appElement, root);

  console.log("root after rendering: ", root?.firstElementChild);
}

rerender();

export default rerender;
