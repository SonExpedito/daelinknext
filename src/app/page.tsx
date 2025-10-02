'use client'

import Footer from "../components/elements/footer/footer";
import Navbar from "../components/elements/navbar/navbar";
import HomePage from "../pages/Comum/Home/page";
import HomePCD from "../pages/PCDs/Home/page";
import { useRouter } from "next/navigation";
import { useUserStore } from "../components/store/userstore";


export default function Home() {
  // Usa o estado global do zustand
  const userType = useUserStore((state) => state.userType);
  const router = useRouter();

  let paginaatual;

  if (userType === "PCD") {
    paginaatual = <HomePCD />;
  } else if (userType === "Empresa") {
    router.push("/dashboard");
    paginaatual = null;
  } else {
    paginaatual = <HomePage />;
  }

  return (
    <>
      <Navbar />
      {paginaatual}
      <Footer />
    </>
  );
}