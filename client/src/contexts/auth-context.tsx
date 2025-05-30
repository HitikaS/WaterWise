import React, { createContext, useContext } from "react";

// John Doe sample user
const johnDoe = {
  id: "1",
  username: "John Doe",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  profileImageUrl: undefined,
  waterSaved: 950,
  actionsCount: 6,
};

const AuthContext = createContext({
  user: johnDoe,
  isLoading: false,
  isAuthenticated: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: johnDoe,
        isLoading: false,
        isAuthenticated: true,
        login: async () => {},
        register: async () => {},
        logout: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 