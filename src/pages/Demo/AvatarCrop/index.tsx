import { useState, useRef, useEffect } from "react";
import { Button, Card, Modal, Slider, Typography, Upload } from "antd";
import {
	UploadOutlined,
	UserOutlined,
	ArrowRightOutlined,
	MinusOutlined,
	PlusOutlined,
	DeleteOutlined,
} from "@ant-design/icons";
import Cropper, { type Point, type Area } from "react-easy-crop";

/** 从 URL 创建 Image 对象 */
const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous");
		image.src = url;
	});

/** 使用 Canvas 从原图中提取裁剪区域的 Data URL */
const getCroppedImg = async (
	imageSrc: string,
	pixelCrop: Area,
): Promise<string> => {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d")!;

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	);

	return canvas.toDataURL("image/jpeg", 0.95);
};

const AvatarCrop: React.FC = () => {
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// 组件卸载时清理定时器
	useEffect(() => {
		return () => {
			if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
		};
	}, []);

	/** 选择图片后读取为 Data URL 并打开裁剪弹窗 */
	const handleBeforeUpload = (file: File) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			setImageSrc(reader.result as string);
			setCroppedImage(null);
			setPreviewImage(null);
			setCrop({ x: 0, y: 0 });
			setZoom(1);
			setCroppedAreaPixels(null);
			setModalOpen(true);
		});
		reader.readAsDataURL(file);
		return Upload.LIST_IGNORE;
	};

	/** 裁剪区域变化时存储像素坐标，并防抖更新实时预览 */
	const handleCropAreaChange = (_: Area, croppedPixels: Area) => {
		setCroppedAreaPixels(croppedPixels);

		if (!imageSrc || croppedPixels.width === 0 || croppedPixels.height === 0)
			return;

		if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
		previewTimerRef.current = setTimeout(async () => {
			try {
				const preview = await getCroppedImg(imageSrc!, croppedPixels);
				setPreviewImage(preview);
			} catch {
				/* 预览更新失败不提示 */
			}
		}, 80);
	};

	/** 确认裁剪，生成最终结果 */
	const handleConfirm = async () => {
		if (!imageSrc || !croppedAreaPixels) return;
		try {
			const result = await getCroppedImg(imageSrc, croppedAreaPixels);
			setCroppedImage(result);
		} catch {
			window.$message.error("图片裁剪失败，请重试");
		}
		setModalOpen(false);
		setImageSrc(null);
		setPreviewImage(null);
	};

	/** 取消裁剪，重置状态 */
	const handleCancel = () => {
		setModalOpen(false);
		setImageSrc(null);
		setPreviewImage(null);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(null);
	};

	/** 清除已裁剪结果 */
	const handleClear = () => {
		setCroppedImage(null);
		setCroppedAreaPixels(null);
	};

	return (
		<div className="min-h-full p-6">
			<div className="max-w-[720px] mx-auto">
				{/* 页面标题 */}
				<div className="text-center mb-8">
					<Typography.Title level={3} className="!mb-2">
						头像上传裁剪
					</Typography.Title>
					<Typography.Text type="secondary">
						上传图片，自由裁剪，实时预览圆形头像效果
					</Typography.Text>
				</div>

				{/* 主操作卡片 */}
				<Card className="mb-6">
					<div className="flex items-center justify-center gap-10 flex-wrap py-6">
						{/* 上传按钮区域 */}
						<div className="flex flex-col items-center gap-3">
							<Upload
								accept="image/*"
								showUploadList={false}
								beforeUpload={handleBeforeUpload}
							>
								<Button type="primary" icon={<UploadOutlined />} size="large">
									选择图片
								</Button>
							</Upload>
							<Typography.Text type="secondary" className="text-sm">
								支持 JPG、PNG 格式
							</Typography.Text>
						</div>

						{/* 中间箭头 */}
						<ArrowRightOutlined className="hidden sm:block text-2xl text-gray-400" />

						{/* 最终结果预览 */}
						<div className="flex flex-col items-center gap-3">
							{croppedImage ? (
								<img
									src={croppedImage}
									alt="裁剪后的头像"
									className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900 shadow-lg"
								/>
							) : (
								<div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
									<UserOutlined className="text-4xl text-gray-400" />
								</div>
							)}
							<div className="flex items-center gap-2">
								<Typography.Text type="secondary" className="text-sm">
									{croppedImage ? "裁剪结果" : "暂无图片"}
								</Typography.Text>
								{croppedImage && (
									<Button
										type="text"
										danger
										size="small"
										icon={<DeleteOutlined />}
										onClick={handleClear}
									/>
								)}
							</div>
						</div>
					</div>
				</Card>

				{/* 裁剪弹窗 */}
				<Modal
					title="裁剪头像"
					open={modalOpen}
					onCancel={handleCancel}
					width={680}
					footer={
						<div className="flex justify-end gap-3">
							<Button onClick={handleCancel}>取消</Button>
							<Button type="primary" onClick={handleConfirm}>
								确认
							</Button>
						</div>
					}
					destroyOnHidden
					centered
				>
					<div className="flex gap-4">
						{/* 左侧：裁剪器 */}
						<div className="flex-1 min-w-0 flex flex-col">
							<div className="relative w-full h-[380px] bg-gray-100 dark:bg-gray-950 rounded-lg overflow-hidden">
								{imageSrc && (
									<Cropper
										image={imageSrc}
										crop={crop}
										zoom={zoom}
										rotation={0}
										aspect={1}
										cropShape="rect"
										showGrid
										onCropChange={setCrop}
										onZoomChange={setZoom}
										onCropAreaChange={handleCropAreaChange}
										style={{
											cropAreaStyle: {
												boxShadow:
													"0 0 0 9999px rgba(0, 0, 0, 0.25)",
											},
										}}
									/>
								)}
							</div>
						</div>

						{/* 右侧：实时预览 */}
						<div className="w-[140px] flex-shrink-0 flex flex-col items-center gap-3 pt-2">
							<Typography.Text
								type="secondary"
								className="text-xs font-medium tracking-wide"
							>
								实时预览
							</Typography.Text>

							{/* 大圆预览 */}
							<div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900 shadow-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
								{previewImage ? (
									<img
										src={previewImage}
										alt="实时预览"
										className="w-full h-full object-cover"
									/>
								) : (
									<UserOutlined className="text-3xl text-gray-400" />
								)}
							</div>

							{/* 小圆预览 (列表效果) */}
							<div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
								{previewImage ? (
									<img
										src={previewImage}
										alt="小尺寸预览"
										className="w-full h-full object-cover"
									/>
								) : (
									<UserOutlined className="text-xs text-gray-400" />
								)}
							</div>

							<Typography.Text
								type="secondary"
								className="text-xs text-center leading-relaxed"
							>
								拖拽调整位置
								<br />
								滚轮或滑块缩放
							</Typography.Text>
						</div>
					</div>

					{/* 缩放控制 */}
					<div className="flex items-center gap-4 mt-4 px-2">
						<MinusOutlined className="text-gray-500" />
						<Slider
							min={1}
							max={3}
							step={0.01}
							value={zoom}
							onChange={setZoom}
							className="flex-1"
						/>
						<PlusOutlined className="text-gray-500" />
					</div>
				</Modal>
			</div>
		</div>
	);
};

export default AvatarCrop;
