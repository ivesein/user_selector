import React, { useState } from "react";

import { Upload, Button, message, Space } from "antd";
import styles from "./index.module.scss";
import searchImg from "@/asset/img/sousuo.png";
import { PlusOutlined } from "@ant-design/icons";
import { UPLOAD_FILE_API } from "@/api/enterpriseApi";

const CusFormItemUpload = (props) => {
	const [loading, setLoading] = useState(false); //显示导入新成员
	// 处理上传逻辑
	const beforeUpload = (file) => {
		// const typeReg = /\.(xls|xlsx)$/;
		console.log(file);
		if (!props.typeReg.test(file.name)) {
			message.warning(`文件：${file.name}类型不符合上传要求`);
			return;
		}
		if (props.maxSize) {
			if (file.size > props.maxSize) {
				message.warning(`文件：${file.name}大小不符合上传要求`);
				return;
			}
		}
		// setFileList([file]);
		uploadFile(file);
		return false;
	};
	const uploadFile = async (file) => {
		let formData = new FormData();
		formData.append("file", file);
		try {
			setLoading(true);
			let res = await UPLOAD_FILE_API(formData);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			props.onChange(res?.result?.previewUrl ?? "");
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.cusFormItemUpload}>
			<img
				src={props.value || props.defaultImg}
				alt=""
				className={styles.previewImg}
			/>
			<Space size="large">
				<Upload
					beforeUpload={beforeUpload}
					// action="http://192.168.11.118:30071/file/no_token/file/upload"
					maxCount={1}
					multiple={false}
					showUploadList={false}
				>
					<Button
						loading={loading}
						size="large"
						style={{
							fontSize: 14,
							width: 190,
							// color: "#666",
						}}
						type="primary"
						icon={<PlusOutlined />}
					>
						选择文件
					</Button>
				</Upload>
				{props.extendsBtns ? props.extendsBtns : null}
			</Space>

			<span className={styles.tip}>{props.tip}</span>
		</div>
	);
};

export default CusFormItemUpload;
