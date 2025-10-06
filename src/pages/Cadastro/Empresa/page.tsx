"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/src/components/store/modalstore";
import { ChevronLeft, Building2, IdCardIcon } from "lucide-react";
import { useUserStore } from "@/src/components/store/userstore";
import axios from "axios";

import PerfilEtapa from "./etapas/perfil";
import CredenciaisEtapa from "./etapas/credenciais";
import Button from "@/src/components/elements/buttons/button";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";

export type Empresa = {
  id?: string;
  name?: string;
  cnpj?: string;
  area?: string;
  descricao?: string;
  sobre?: string;
  sobreimg?: File | null;

  email?: string;
  telefone?: string;
  cep?: string;

  imageUrl?: File | null; // logo
  imageProfile?: File | null; // banner
};

// 🔹 Validação simples de CNPJ
function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14) return false;

  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}

export default function EmpresaCadastroPage() {
  const router = useRouter();
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const setLoading = useUserStore((state) => state.setLoading);

  const cadastroEmpresaImgs = [
    "/cadastro/empresa1.jpg",
    "/cadastro/empresa2.jpg",
    "/cadastro/empresa3.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [etapa, setEtapa] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    area: "",
    sobre: "",
    descricao: "",
    cnpj: "",
    telefone: "",
    endereco: "",
    cep: "",
    sobreimg: null as File | null,

    password: "",
    confirmPassword: "",

    imageProfile: null as File | null,
    imageUrl: null as File | null,
  });

  const isEmpty = (value?: string | null) =>
    !value || (typeof value === "string" && value.trim().length === 0);

  const validatePerfilEtapa = () => {
    if (isEmpty(formData.name)) {
      openModal("Nome da empresa é obrigatório.");
      return false;
    }

    if (isEmpty(formData.email)) {
      openModal("E-mail é obrigatório.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      openModal("Informe um e-mail válido.");
      return false;
    }

    if (isEmpty(formData.area)) {
      openModal("Área de atuação é obrigatória.");
      return false;
    }

    if (isEmpty(formData.sobre)) {
      openModal("Campo 'Sobre' é obrigatório.");
      return false;
    }

        if (isEmpty(formData.cnpj)) {
      openModal("CNPJ é obrigatório.");
      return false;
    }

    if (!validarCNPJ(formData.cnpj)) {
      openModal("CNPJ inválido.");
      return false;
    }

    if (isEmpty(formData.telefone)) {
      openModal("Telefone é obrigatório.");
      return false;
    }

    if (formData.telefone.replace(/\D/g, "").length < 10) {
      openModal("Informe um telefone válido.");
      return false;
    }

    return true;
  };

  const validateCredenciaisEtapa = () => {
    if (isEmpty(formData.password)) {
      openModal("Senha é obrigatória.");
      return false;
    }

    if ((formData.password ?? "").length < 6) {
      openModal("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    if (isEmpty(formData.confirmPassword)) {
      openModal("Confirme sua senha.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      openModal("As senhas não coincidem.");
      return false;
    }

    if (isEmpty(formData.cep)) {
      openModal("CEP é obrigatório.");
      return false;
    }

    return true;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cadastroEmpresaImgs.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNextEtapa = () => {
    if (validatePerfilEtapa()) {
      setEtapa((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    const isPerfilValid = validatePerfilEtapa();
    const isCredenciaisValid = validateCredenciaisEtapa();

    if (!isPerfilValid || !isCredenciaisValid) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const email = formData.email?.trim();
      const password = formData.password;
      let uid = "";

      if (!email || !password) {
        openModal("E-mail e senha são obrigatórios.");
        setLoading(false);
        setIsSubmitting(false);
        return;
      }

      // 🔹 1. Cria ou autentica usuário
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        uid = userCredential.user.uid;
      } catch (e: any) {
        if (e?.code === "auth/email-already-in-use") {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          uid = userCredential.user.uid;
        } else {
          throw e;
        }
      }

      // 🔹 2. Token e sessão
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        await axios.post("/session", { token }, { withCredentials: true });
      }

      // 🔹 3. FormData com UID
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "password" || key === "confirmPassword") return;
        if (value !== null) data.append(key, value as any);
      });
      data.append("uid", uid);

      // 🔹 4. Envia cadastro empresa
      const res = await axios.post<{ message?: string }>(
        "/cadastro-empresa",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      openModal(res.data.message || "Cadastro realizado com sucesso!");
      router.replace("/perfil");
      setTimeout(() => router.refresh(), 1500);
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      openModal(err.response?.data?.error || "Erro no cadastro.");
      setTimeout(() => closeModal(), 1500);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  const renderEtapa = () => {
    switch (etapa) {
      case 0:
        return <PerfilEtapa data={formData} setData={setFormData} />;
      case 1:
        return <CredenciaisEtapa data={formData} setData={setFormData} />;
      default:
        return null;
    }
  };

  const renderBotoes = () => (
    <div className="flex items-center justify-center w-full gap-4">
      {etapa > 0 && (
        <Button
          label="Voltar"
          onClick={() => setEtapa((prev) => prev - 1)}
          className="bg-gray-500"
        />
      )}
      {etapa < 1 ? (
        <Button
          label="Próximo"
          onClick={handleNextEtapa}
          className="background-green"
        />
      ) : (
        <Button
          label={"Finalizar"}
          onClick={handleSubmit}
          className="background-blue"
          disabled={isSubmitting}
        />
      )}
    </div>
  );

  const tituloEtapa = [
    { label: "PERFIL", icon: <Building2 size={42} /> },
    { label: "CREDENCIAIS", icon: <IdCardIcon size={46} /> },
  ];

  return (
    <motion.div
      data-theme="light"
      className="w-screen h-screen flex items-center justify-center overflow-hidden bg-white-primary-mockup"
    >
      <div className="h-full w-[60%] flex flex-col items-center justify-center gap-4">
        {/* Botão voltar */}
        <button
          onClick={router.back}
          className="flex items-center gap-2 cursor-pointer self-start ml-8 font-bold text-white background-green pr-4 py-1 rounded-full border border-white/30 shadow-md backdrop-blur-xl hover:scale-105 hover:opacity-90 transition-all"
        >
          <ChevronLeft size={28} />
          <p className="text-lg">Voltar</p>
        </button>

        {/* Título */}
        <h1 className="text-4xl font-bold flex gap-4 justify-center items-center text-color mb-8">
          {tituloEtapa[etapa].label} {tituloEtapa[etapa].icon}
        </h1>

        {/* Conteúdo */}
        <div className="w-full h-[70%] flex flex-col items-center justify-center gap-6">
          {renderEtapa()}
          {renderBotoes()}
        </div>
      </div>

      {/* Imagem lateral */}
      <div className="h-full w-[40%] relative z-10 p-2">
        <motion.div
          className="h-full w-full flex flex-col gap-8 items-center justify-center rounded-3xl overflow-hidden px-4 relative"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(150%)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -inset-[100%] animate-liquidGlass bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
          </div>

          <div className="absolute inset-0 z-0">
            <img
              src={cadastroEmpresaImgs[currentIndex]}
              alt="reflexo"
              className="w-full h-full object-cover object-center opacity-30 blur-xl scale-110 transition-opacity duration-1000 ease-in-out"
            />
          </div>

          <div className="relative w-3/4 h-4/5 flex items-center justify-center">
            {cadastroEmpresaImgs.map((img, index) => (
              <img
                key={img}
                src={img}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover rounded-3xl transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          <img src="/logo.png" className="h-12 object-contain z-20" alt="Logo" />
        </motion.div>
      </div>
    </motion.div>
  );
}
