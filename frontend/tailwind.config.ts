import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: { DEFAULT: "#2E75B6", light: "#D6E4F0", dark: "#1F3864" },
                success: { DEFAULT: "#27AE60", light: "#D5F5E3" },
                warning: { DEFAULT: "#CA6F1E", light: "#FEF9E7" },
                danger: { DEFAULT: "#C0392B", light: "#FDEDEC" },
                manager: { DEFAULT: "#1E8449", light: "#D5F5E3" },
                resident: { DEFAULT: "#CA6F1E", light: "#FEF9E7" },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;
