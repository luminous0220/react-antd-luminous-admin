import { useEffect, useRef } from "react";
import { Card } from "antd";
import Artplayer from "artplayer";

const DEMO_VIDEO = {
	url: "x x x x",
	poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
	title: "Big Buck Bunny - 高清演示",
};

const VideoPage: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<Artplayer | null>(null);

	useEffect(() => {
		if (!containerRef.current || playerRef.current) return;

		const art = new Artplayer({
			container: containerRef.current,
			url: DEMO_VIDEO.url,
			poster: DEMO_VIDEO.poster,
			volume: 0.7,
			autoplay: false,
			loop: false,
			muted: false,
			autoSize: true,
			autoMini: true,
			fullscreen: true,
			fullscreenWeb: true,
			subtitleOffset: true,
			miniProgressBar: true,
			playsInline: true,
			lock: true,
			pip: true,
			screenshot: true,
			hotkey: true,
			airplay: true,
			fastForward: true,
			flip: true,
			playbackRate: true,
			aspectRatio: true,
			setting: true,
			mutex: true,
			backdrop: true,
			gesture: true,
			autoPlayback: true,
			autoOrientation: true,
			theme: "#3b82f6",
			lang: "zh-cn",
			moreVideoAttr: {
				crossOrigin: "anonymous",
			},
		});

		playerRef.current = art;

		return () => {
			art.destroy(false);
			playerRef.current = null;
		};
	}, []);

	return (
		<div className="flex justify-center p-6">
			<Card className="w-full max-w-4xl" title={DEMO_VIDEO.title}>
				<div ref={containerRef} className="w-full" style={{ aspectRatio: "16/9" }} />
			</Card>
		</div>
	);
};

export default VideoPage;
