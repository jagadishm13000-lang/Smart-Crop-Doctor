import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "../lib/i18n";

interface User {
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  isOnboarded: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("agro_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [language, setLangState] = useState(() => {
    return localStorage.getItem("agro_lang") || "en";
  });

  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem("agro_onboarded") === "true";
  });

  const setLanguage = (lang: string) => {
    setLangState(lang);
    localStorage.setItem("agro_lang", lang);
    i18n.changeLanguage(lang);
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("agro_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsOnboarded(false);
    localStorage.removeItem("agro_user");
    localStorage.removeItem("agro_onboarded");
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
    localStorage.setItem("agro_onboarded", "true");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      language, 
      setLanguage, 
      isOnboarded, 
      completeOnboarding 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
