"use client";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <>
      <h1>Talk your way out!!!</h1>
      <button
        style={{
          border: "2px",
          height: "40px",
          width: "100px",
          backgroundColor: "black",
          color: "white",
          borderRadius: "5px",
        }}
        onClick={() => {
          router.push("/home");
        }}>
        Start Chat
      </button>
    </>
  );
}
