import { Avatar, Card, Image } from "antd";
import type { MediaCardProps } from "../types.d";

const { Meta } = Card;

const CARD_STYLE = {
	borderRadius: 12,
	border: "1px solid #f0f0f0",
	boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

export const MediaCard: React.FC<MediaCardProps> = ({
	cover,
	avatar,
	title,
	description,
	actions,
}) => {
	return (
		<Card
			className="group hover:scale-[1.02] hover:!shadow-lg transition-transform duration-200"
			style={CARD_STYLE}
			cover={
				cover ? (
					<div className="overflow-hidden rounded-tl-lg rounded-tr-lg">
						<Image
							className="object-cover transition-transform duration-200 group-hover:scale-[1.1]"
							width={380}
							height={360}
							alt={title}
							src={cover}
						/>
					</div>
				) : undefined
			}
			actions={actions}
		>
			<Meta
				avatar={avatar ? <Avatar src={avatar} /> : undefined}
				title={title}
				description={description}
			/>
		</Card>
	);
};

