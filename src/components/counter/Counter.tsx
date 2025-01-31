import { useState } from "../../../libs/core/useState";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onclick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
