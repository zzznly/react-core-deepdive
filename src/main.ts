import App from "./App.jsx";
import { render, rerender } from "../libs/core/render.ts";

const root = document.getElementById("root");
render(root, App());
