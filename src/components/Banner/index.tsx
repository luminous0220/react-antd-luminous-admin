import { Button } from "antd";
import { useThemeStore } from "@/stores";
import "./index.scss";
import { BannerProps } from "./types.d";
import { PRESETS } from "./utils";

export const Banner: React.FC<BannerProps> = ({
	type = "blue",
	title,
	description,
	buttonText,
	img,
	className,
	onButtonClick,
}) => {
	const isDark = useThemeStore((s) => s.isDark);
	const scheme = PRESETS[type][isDark ? "dark" : "light"];

	return (
		<div
			className={`relative overflow-hidden rounded-2xl h-[220px] flex items-center cursor-pointer shadow-sm duration-300 transition-all hover:!shadow-md hover:scale-[1.03] ${className}`}
			style={{
				background: scheme.gradient,
			}}
		>
			{/* Arc decorations */}
			<div
				className="absolute -right-16 -top-20 w-72 h-72 rounded-full opacity-40"
				style={{
					background: `radial-gradient(circle, ${scheme.arcColor} 0%, transparent 70%)`,
					animation:
						"bannerArc1 8s ease-in-out infinite alternate, bannerPulse 4s ease-in-out infinite",
				}}
			/>
			<div
				className="absolute -right-8 -bottom-24 w-64 h-64 rounded-full opacity-30"
				style={{
					background: `radial-gradient(circle, ${scheme.arcColor2} 0%, transparent 60%)`,
					animation:
						"bannerArc2 10s ease-in-out infinite alternate, bannerPulse 5s ease-in-out infinite reverse",
				}}
			/>

			{/* Left content */}
			<div className="relative z-10 flex-1 px-10 py-8 flex flex-col justify-center">
				{title && (
					<h2
						className="text-xl font-bold mb-3 tracking-tight"
						style={{ color: scheme.textColor }}
					>
						{title}
					</h2>
				)}
				{description && (
					<p
						className="text-sm mb-8 leading-relaxed max-w-[85%]"
						style={{ color: scheme.textColor, opacity: 0.65 }}
					>
						{description}
					</p>
				)}
				{buttonText && (
					<div>
						<Button
							type="primary"
							size="middle"
							className="banner-gradient-btn"
							style={{
								borderRadius: 8,
								fontWeight: 500,
								boxShadow: "none",
								// @ts-ignore CSS custom property
								"--btn-gradient": `linear-gradient(90deg, ${scheme.buttonBg} 0%, ${scheme.buttonHighlight} 35%, ${scheme.buttonHighlight} 65%, ${scheme.buttonBg} 100%)`,
							}}
							onClick={onButtonClick}
						>
							{buttonText}
						</Button>
					</div>
				)}
			</div>

			{/* Right illustration */}
			{img && (
				<div className="relative z-10 flex-shrink-0 pr-6 flex items-center justify-center">
					<img
						src={img}
						alt={title ?? ""}
						className="w-[140px] h-[140px] object-contain drop-shadow-sm"
						style={{
							filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
							animation: "bannerFloat 1.5s ease-in-out infinite alternate",
						}}
					/>
				</div>
			)}
		</div>
	);
};

export * from "./types.d";
