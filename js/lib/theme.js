import { createTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createTheme({
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
    palette: {
        background: {
            default: "#222831",
        },
        text: {
            primary: "#fff",
        },
        primary: { main: "#fff" },
    },
});

export default theme;
