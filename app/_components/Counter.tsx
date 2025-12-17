"use client";
import { useState } from "react";
import { userType } from "../cabins/page";

export default function Counter({ users }: { users: userType[] }) {
  const [count, setCount] = useState(0);

  console.log(users);

  return (
    <div>
      There are {users.length} users.
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
    </div>
  );
}
