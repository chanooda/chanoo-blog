import { createTheme } from "@mui/material";

export const theme = createTheme({
	palette: {
		background: {
			default: "#f8f9fa",
		},
		primary: {
			main: "#d32f2f",
			"100": "#ffcdd2",
			"200": "#ef9a9a",
			"300": "#e57373",
			"400": "#ef5350",
			"500": "#f44336",
			"600": "#e53935",
			"700": "#d32f2f",
			"800": "#c62828",
			"900": "#b71c1c",
		},
	},
	typography: {
		fontFamily: ["Noto Sans KR", "sans-serif"].join(","),
	},
});
