'use client'

import Footer from "../components/elements/footer/footer";
import Navbar from "../components/elements/navbar/navbar";
import HomePage from "../pages/Comum/Home/page";
import HomePCD from "../pages/PCDs/Home/page";
import { useUserStore } from "../components/store/userstore";

export default function Home() {
  // Usa o estado global do zustand
  const userType = useUserStore((state) => state.userType);

  const paginaatual =
    userType === "PCD"
      ? <HomePCD />
        : <HomePage />;

  return (
    <>
      <Navbar />
      {paginaatual}
      <Footer />
    </>
  );
}