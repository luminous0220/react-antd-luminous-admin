export type BannerType =
	| "blue"
	| "pink"
	| "green"
	| "purple"
	| "orange"
	| "teal"
	| "red"
	| "cyan"
	| "indigo"
	| "lime";

interface ColorScheme {
	gradient: string;
	arcColor: string;
	arcColor2: string;
	textColor: string;
	accentColor: string;
	buttonBg: string;
	buttonHighlight: string;
}

type PresetEntry = { light: ColorScheme; dark: ColorScheme };