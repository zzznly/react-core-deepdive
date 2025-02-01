import Counter from "./components/counter/Counter";
import Header from "./components/header/Header";
import Content from "./components/content/Content";

export default function App() {
  return (
    <div id="app">
      <Header />
      <Content />
      <Counter />
    </div>
  );
}
