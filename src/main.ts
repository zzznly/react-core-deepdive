import App from "./App.jsx";
import { rerender } from "@/libs/core/render.ts";

const root = document.getElementById("root");
rerender(root, App());
