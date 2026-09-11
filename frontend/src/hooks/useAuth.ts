import { useEffect, useState } from "react";
import { clearToken, getCurrentUser, getToken, type User } from "../services/api";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(Boolean(getToken()));

	useEffect(() => {
		if (!getToken()) {
			return;
		}

		getCurrentUser()
			.then(({ user: currentUser }) => setUser(currentUser))
			.catch(() => clearToken())
			.finally(() => setLoading(false));
	}, []);

	return {
		user,
		loading,
		isAuthenticated: Boolean(user),
		logout: () => {
			clearToken();
			setUser(null);
		}
	};
}
