const KEYS = {
    ACCESS_TOKEN: "access_token",
    REFESH_TOKEN: "refresh_token",
    USER: "user",
} as const;

export const storage = {
    getToken: () => localStorage.getItem(KEYS.ACCESS_TOKEN),
    setToken: (token: string) => localStorage.setItem(KEYS.ACCESS_TOKEN, token),

    getRefreshToken: () => localStorage.getItem(KEYS.REFESH_TOKEN),
    setRefreshToken: (token: string) => localStorage.setItem(KEYS.REFESH_TOKEN, token),

    getUser: () => {
        const raw = localStorage.getItem(KEYS.USER);
        return raw ? JSON.parse(raw) : null;
    },
    setUser: (user: unknown) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),

    clear: () => {
        localStorage.removeItem(KEYS.ACCESS_TOKEN);
        localStorage.removeItem(KEYS.REFESH_TOKEN);
        localStorage.removeItem(KEYS.USER);
    },
};
