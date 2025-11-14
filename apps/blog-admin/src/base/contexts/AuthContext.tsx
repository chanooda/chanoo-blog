import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, removeCookie, setCookie } from "utils";

interface AuthContextType {
	isAuthenticated: boolean;
	token: string | null;
	login: (token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	// 초기 로드 시 cookie에서 token 확인
	useEffect(() => {
		const savedToken = getCookie(TOKEN_KEY);
		if (savedToken) {
			setToken(savedToken);
			setIsAuthenticated(true);
		}
	}, []);

	const login = (newToken: string) => {
		setCookie(TOKEN_KEY, newToken);
		setToken(newToken);
		setIsAuthenticated(true);
		navigate("/");
	};

	const logout = () => {
		removeCookie(TOKEN_KEY);
		setToken(null);
		setIsAuthenticated(false);
		navigate("/");
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
