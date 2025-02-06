import { useState } from "../../../libs/core/useState";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section className="counter">
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount((count) => count + 1)}>증가</button>
    </section>
  );
}
