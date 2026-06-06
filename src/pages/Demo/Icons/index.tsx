import { useState, useCallback } from "react";
import { Card, Typography, message, Button } from "antd";
import { IconSelect } from "@/components/IconSelect";
import { IconMap, TablerIconMap } from "@/libs/iconMap";

const { Title, Text } = Typography;

const iconEntries = Object.entries(IconMap);
const tablerIconEntries = Object.entries(TablerIconMap);

const IconsPage: React.FC = () => {
	const [selectedIcon, setSelectedIcon] = useState<string>();

	const handleCopy = useCallback(async (name: string) => {
		await navigator.clipboard.writeText(name);
		message.success(`已复制: ${name}`);
	}, []);

	return (
		<div className="p-6 flex flex-col gap-6">
			<div>
				<Title level={3} className="!mb-1">
					图标选择器
				</Title>
				<Text type="secondary">基于 @ant-design/icons 的图标选择与展示</Text>
			</div>

			{/* 示例一：图标选择器 */}
			<Card title="图标选择器">
				<div className="flex items-center gap-4">
					<IconSelect
						value={selectedIcon}
						onChange={setSelectedIcon}
						allowClear
						className="w-72"
					/>
					{selectedIcon && (
						<div className="flex items-center gap-2">
							<Text type="secondary">已选:</Text>
							<span className="text-xl">{IconMap[selectedIcon]}</span>
						</div>
					)}
				</div>
			</Card>

			{/* 示例二：Ant Design 图标集 */}
			<Card title={`@ant-design/icons 图标集 (${iconEntries.length})`}>
				<div className="grid grid-cols-8 gap-3">
					{iconEntries.map(([name, node]) => (
						<Button
							key={name}
							className="flex flex-col h-fit items-center px-4 py-2"
							onClick={() => handleCopy(name)}
						>
							<span className="text-2xl flex items-center justify-center w-10 h-10">
								{node}
							</span>
							<span
								className="text-xs text-gray-500 text-center leading-tight break-all"
								style={{ fontSize: 11 }}
							>
								{name}
							</span>
						</Button>
					))}
				</div>
			</Card>

			{/* 示例三：Tabler 图标集 */}
			<Card title={`@tabler/icons-react 图标集 (${tablerIconEntries.length})`}>
				<div className="grid grid-cols-8 gap-3">
					{tablerIconEntries.map(([name, node]) => (
						<Button
							key={name}
							className="flex flex-col h-fit items-center px-4 py-2"
							onClick={() => handleCopy(name)}
						>
							<span className="text-2xl flex items-center justify-center w-10 h-10">
								{node}
							</span>
							<span
								className="text-xs text-gray-500 text-center leading-tight break-all"
								style={{ fontSize: 11 }}
							>
								{name}
							</span>
						</Button>
					))}
				</div>
			</Card>
		</div>
	);
};

export default IconsPage;
