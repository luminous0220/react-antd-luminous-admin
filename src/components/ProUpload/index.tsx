import { getToken, getAssetUrl } from "@/libs";
import { Upload, Button } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { IconUpload } from "@tabler/icons-react";
import { UploadProps } from "antd/lib";
import React from "react";
import axios, { AxiosProgressEvent } from "axios";
import { ProUploadProps } from "./types";

// 图片类型 MIME 对应表
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

/** 校验是否为图片类型 */
const isImageType = (file: File): boolean => {
	return IMAGE_TYPES.includes(file.type);
};

/** 压缩图片到指定大小(KB)以内 */
const compressImage = async (
	file: File,
	targetSizeKB: number,
): Promise<File> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					reject(new Error("无法创建 canvas context"));
					return;
				}

				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);

				const targetSizeBytes = targetSizeKB * 1024;

				if (file.size <= targetSizeBytes) {
					resolve(file);
					return;
				}

				let quality = 0.92;

				const tryCompress = () => {
					canvas.toBlob(
						(blob) => {
							if (!blob) {
								if (quality > 0.1) {
									quality -= 0.1;
									tryCompress();
								} else {
									reject(new Error("图片压缩失败"));
								}
								return;
							}

							if (blob.size <= targetSizeBytes || quality <= 0.1) {
								const compressedFile = new File([blob], file.name, {
									type: file.type,
								});
								resolve(compressedFile);
							} else {
								quality -= 0.1;
								tryCompress();
							}
						},
						file.type,
						quality,
					);
				};

				tryCompress();
			};

			img.onerror = () => reject(new Error("图片加载失败"));
			img.src = e.target?.result as string;
		};

		reader.onerror = () => reject(new Error("文件读取失败"));
		reader.readAsDataURL(file);
	});
};

/** 将 UploadFile[] 中的相对路径转为完整 URL（用于预览） */
const processFileList = (files: UploadFile[]): UploadFile[] =>
	files.map((item, index) => ({
		uid: item.uid || `file-${index}`,
		name: item.name || "文件",
		url: getAssetUrl(item.url),
		status: item.status || "done",
		thumbUrl: getAssetUrl(item.thumbUrl),
		response: item.response,
		percent: item.percent,
	})) as UploadFile[];

const ProUpload_ = (props: ProUploadProps) => {
	const {
		mode = "drag",
		defaultFileList = [],
		maxCount = 1,
		multiple = true,
		uploadText = "点击上传",
		maxSize = 3,
		description,
		compressSize,
		fileList,
		onChange,
		...restProps
	} = props;

	if (!Array.isArray(defaultFileList)) {
		console.error("defaultFileList 必须是数组");
		return "defaultFileList 必须是数组";
	}

	// Form.Item 通过 valuePropName 传递 fileList 时为受控模式，否则使用 defaultFileList
	const isControlled = fileList !== undefined;

	const uploadProps: UploadProps = {
		action: import.meta.env.VITE_BASE_URL + "/upload",
		name: "file",
		headers: { Authorization: "Bearer " + getToken() },
		multiple,
		maxCount,
		listType: "picture",
		...(isControlled
			? { fileList: processFileList(fileList) }
			: { defaultFileList: processFileList(defaultFileList) }),
		onChange,
		beforeUpload: async (file) => {
			const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
			if (!isLtMaxSize) {
				window.$message.error(`文件大小不能超过 ${maxSize}MB!`);
				return Upload.LIST_IGNORE;
			}

			// 图片压缩功能（仅对图片有效）
			if (compressSize && isImageType(file)) {
				try {
					const compressedFile = await compressImage(file, compressSize);
					const originalSizeKB = Math.round(file.size / 1024);
					const compressedSizeKB = Math.round(compressedFile.size / 1024);

					(file as any).compressedFile = compressedFile;
					(file as any).compressedSize = compressedSizeKB;
					(file as any).originalSize = originalSizeKB;

					if (compressedSizeKB < originalSizeKB) {
						console.log(
							`[图片压缩] ${file.name}: ${originalSizeKB}KB -> ${compressedSizeKB}KB (节省 ${Math.round(
								((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100,
							)}%)`,
						);
					}
				} catch (error) {
					console.error("图片压缩失败，将使用原图上传:", error);
				}
			}

			return true;
		},

		customRequest: (options) => {
			const {
				action,
				file,
				filename,
				headers,
				onProgress,
				onSuccess,
				onError,
			} = options;

			const uploadFile = (file as any).compressedFile || file;
			const formData = new FormData();
			formData.append(filename || "file", uploadFile);

			const controller = new AbortController();

			axios
				.post(action as string, formData, {
					headers: {
						...headers,
						"Content-Type": "multipart/form-data",
					},
					signal: controller.signal,
					onUploadProgress: (progressEvent: AxiosProgressEvent) => {
						if (onProgress && progressEvent.total != null) {
							const percent = Math.round(
								(progressEvent.loaded / progressEvent.total) * 100,
							);
							onProgress({ percent });
						}
					},
				})
				.then((response) => {
					onSuccess?.(response.data);
				})
				.catch((error) => {
					if (axios.isCancel(error)) {
						return;
					}
					onError?.(error, error.response);
				});

			return {
				abort: () => {
					controller.abort();
				},
			};
		},
		...restProps,
	};

	const desc = description ? description : `仅支持上传 ${maxSize} MB的文件`;
	if (mode === "button") {
		return (
			<Upload {...uploadProps}>
				<div className="flex-center gap-2">
					<Button icon={<IconUpload />}>{uploadText}</Button>
					<span>{desc}</span>
				</div>
			</Upload>
		);
	} else if (mode === "drag") {
		return (
			<Upload.Dragger {...uploadProps}>
				<div className="flex-center flex-col">
					<IconUpload className="size-8 text-[#4CC9F0]" />
					<span className="mt-2">点击或者拖拽文件到进行上传</span>
					<div className="mt-2 text-gray-400">注意：{desc}</div>
				</div>
			</Upload.Dragger>
		);
	}
};

export const ProUpload = React.memo(ProUpload_);
export * from "./types";
