import { create } from "zustand";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/src/api/firebase"; // ajuste para seu projeto
import { doc, getDoc } from "firebase/firestore";
import { logout as firebaseLogout } from "@/src/api/Auth";

type UserProfile = { id?: string; nome?: string;[key: string]: any };

interface UserState {
  userType: string | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  setUserType: (type: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userType: null,
  userProfile: null,
  loading: false,
  error: null,

  setUserType: (type) => {
    if (type) localStorage.setItem("tipo", type);
    else localStorage.removeItem("tipo");
    set({ userType: type });
  },

  logout: async () => {
    try {
      await firebaseLogout(); // faz logout no Firebase Auth
      localStorage.removeItem("tipo");
      localStorage.removeItem("userId");
      await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
    } catch (e) {
      console.warn("Erro ao fazer logout", e);
    }
    set({ userType: null, userProfile: null });
  },

  fetchUser: async () => {
    const uid = localStorage.getItem("userId");
    const tipo = localStorage.getItem("tipo");
    if (!uid || !tipo) {
      set({ userType: null, userProfile: null });
      return;
    }
    try {
      // Busca o perfil correto baseado no tipo
      const docRef = doc(db, tipo, uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({
          userType: tipo,
          userProfile: docSnap.data(),
        });
      } else {
        set({ userType: null, userProfile: null });
      }
    } catch (e) {
      set({ userType: null, userProfile: null });
    }
  },

  loginUser: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Busca nas coleções PCD e Empresa
      const [pcdDocSnap, empresaDocSnap] = await Promise.all([
        getDoc(doc(db, "PCD", uid)),
        getDoc(doc(db, "Empresa", uid)),
      ]);

      let tipo: string | null = null;
      let dados: any = null;

      if (pcdDocSnap.exists()) {
        dados = pcdDocSnap.data();
        tipo = dados?.tipo ?? "PCD";
      } else if (empresaDocSnap.exists()) {
        dados = empresaDocSnap.data();
        tipo = dados?.tipo ?? "Empresa";
      }

      if (!tipo) {
        set({ loading: false, error: "Usuário não encontrado" });
        return false;
      }

      // Chama backend para criar cookie
      try {
        await axios.post(
          "http://localhost:3000/cookie",
          { uid, tipo },
          { withCredentials: true }
        );
      } catch (e) {
        console.warn("Falha ao definir cookie no backend", e);
      }

      // Atualiza estado e persiste localmente
      localStorage.setItem("userId", uid);
      localStorage.setItem("tipo", tipo);

      set({
        userType: tipo,
        userProfile: dados,
        loading: false,
        error: null,
      });

      return true;
    } catch (error: any) {
      console.error(error);
      set({ loading: false, error: "Credenciais inválidas" });
      return false;
    }
  },
}));
