import { createContext, useContext, useReducer } from "react";

type User = {
  name: string;
  email: string;
  password: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

type AuthAction = { type: "login"; payload: User } | { type: "logout" };

type AuthContextType = AuthState & {
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAKE_USER: User = {
  name: "Amir",
  email: "user@gmail.com",
  password: "1234",
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "login":
      return { user: action.payload, isAuthenticated: true };
    case "logout":
      return { user: null, isAuthenticated: false };
    default:
      throw new Error("Invalid action");
  }
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    authReducer,
    initialState
  );

  function login(email: string, password: string) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

