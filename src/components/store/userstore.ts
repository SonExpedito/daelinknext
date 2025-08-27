import { create } from "zustand";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/api/firebase";
import { logout as firebaseLogout } from "@/src/api/Auth";

type UserProfile = { id?: string; nome?: string;[key: string]: any };

interface UserState {
  userType: string | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  setLoading: (state: boolean) => void;  // <-- método adicionado
  fetchUser: () => Promise<void>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  userType: null,
  userProfile: null,
  loading: false,
  error: null,

  setLoading: (state: boolean) => set({ loading: state }),

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<{ userType: string; userProfile: UserProfile }>(
        "http://localhost:3000/me",
        { withCredentials: true }
      );
      const { userType, userProfile } = response.data;
      set({ userType, userProfile, loading: false });
    } catch (err: any) {
      console.error("Erro ao buscar usuário:", err);
      let errorMsg = "Erro ao buscar usuário";
      if (err.response && err.response.status === 401) {
        errorMsg = "Sessão expirada. Faça login novamente.";
      }
      set({ userType: null, userProfile: null, loading: false, error: errorMsg });
    }
  },

  loginUser: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      await axios.post(
        "http://localhost:3000/session",
        { token: idToken },
        { withCredentials: true }
      );

      await useUserStore.getState().fetchUser();

      set({ loading: false });
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      set({ loading: false, error: "Credenciais inválidas" });
      return false;
    }
  },

  logout: async () => {
    try {
      await firebaseLogout();
      await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
    } catch (e) {
      console.warn("Erro ao fazer logout:", e);
    }
    set({ userType: null, userProfile: null });
  },
}));
