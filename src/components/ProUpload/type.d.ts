import { UploadProps } from "antd";


/*
 * ProForm中的使用示例：
 * 1. 通过defaultFileList（Array<UploadFile>）传入初始文件列表
 * 2. 也可以通过 fileList 传入受控文件列表，必需配合onChange进行使用
 * 3. ProUpload组件默认Base url为 `import.meta.env.VITE_BASE_URL + "/upload"`,可根据需求进行修改
  {
		type: "upload",
		name: "attachment",
		label: "附件上传",
		fieldProps: {
			listType: "picture",
			maxCount: 3,
			accept: ".jpg,.jpeg,.png",
			defaultFileList: [
				{
					uid: "1",
					name: "logo.png",
					status: "done",
					url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
				},
			]
	}
*/
	

export interface ProUploadProps extends UploadProps {
	mode?: "button" | "drag";
	/** 最大上传数量，默认为1 */
	maxCount?: number;
	/** 是否支持多文件上传，默认为false */
	multiple?: boolean;
	/** 自定义上传提示文案 */
	uploadText?: string;
	/** 上传文件大小限制(MB)，默认为3 */
	maxSize?: number;
	/** 上传按钮提示 */
	description?: string;
	/** 图片压缩目标大小(KB)，设置后仅对图片有效，会在上传前压缩图片 */
	compressSize?: number;
}
