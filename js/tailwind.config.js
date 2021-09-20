const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
    mode: "jit",
    // important: true,
    purge: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: "#313638",
                blue: "#222831",
            },
            fontSize: {
                title: "15rem",
            },
            typography: {
                DEFAULT: {
                    css: {},
                },
            },
        },
    },
    variants: {
        extend: {
            borderStyle: ["responsive", "hover"],
            borderWidth: ["responsive", "hover"],
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
