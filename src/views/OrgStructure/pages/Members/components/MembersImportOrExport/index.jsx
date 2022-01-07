import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	message,
	Upload,
	Space,
	Select,
	Button,
	Modal,
	Checkbox,
	Radio,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import closeIcon from "@/asset/img/del.png";
import { saveAs } from "file-saver";
import {
	GET_TEMPLATE_FILE_API,
	IMPORT_EXCEL_FILE_API,
	EXPORT_EXCEL_FILE_API,
} from "@/api/permApi";
import fileIcon from "@/asset/img/paperclip.png";
import delIcon from "@/asset/img/del.png";

const MembersImportOrExport = (props) => {
	const [submitLoading, setSubmitLoading] = useState(false); //提交loading
	const [downloadLoading, setDownloadLoadLoading] = useState(false); //提交loading
	const [exportLoading, setExportLoading] = useState(false); //导出按钮loading

	const [ifSendMsg, setIfSendMsg] = useState(false); //是否发送短信邀请
	const [showType, setShowType] = useState("1"); //显示导入新成员
	const [fileList, setFileList] = useState([]); //显示导入新成员
	const templateFileRef = useRef(null);
	const uploadTypeOneFileRef = useRef(null); //type1 上传的文件
	const uploadTypeTwoFileRef = useRef(null); //type2 上传的文件

	useEffect(() => {
		getTemplateFileUrl();
	}, []);
	const getTemplateFileUrl = async (params) => {
		try {
			let res = await GET_TEMPLATE_FILE_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			if (res.data && res.data.record && res.data.record.length) {
				templateFileRef.current = res.data.record[0];
			}
		} catch (error) {
			console.log(error);
		} finally {
		}
	};

	const close = (params) => {
		if (submitLoading) {
			message.warning("数据导入中，请稍后再试...");
			return;
		}
		props.modal.destroy();
	};
	const confirm = async (params) => {
		try {
			setSubmitLoading(true);
			const formData = new FormData();
			formData.append("multipartFile", fileList[0]);
			formData.append(
				"sendMessage",
				showType === "1" && ifSendMsg ? "1" : "0"
			);

			let res = await IMPORT_EXCEL_FILE_API(formData);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			// 处理导入成功后逻辑
			props.importOk([]);
			if (res.data) {
				const {
					allNumber,
					sucessNumber,
					failNumber,
					repeat,
					importExcelUserVOList,
				} = res.data;
				props.importOk({
					allNumber,
					sucessNumber,
					failNumber,
					repeat,
					list: importExcelUserVOList || [],
				});
			} else {
				props.importOk(null);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setSubmitLoading(false);
		}
	};
	const onCheckboxChange = (e) => {
		setIfSendMsg(e.target.checked);
	};
	const handleOnTypeChange = (e) => {
		setShowType(e.target.value);
		if (e.target.value === "1") {
			setFileList(
				uploadTypeOneFileRef.current
					? [uploadTypeOneFileRef.current]
					: []
			);
		} else {
			setFileList(
				uploadTypeTwoFileRef.current
					? [uploadTypeTwoFileRef.current]
					: []
			);
		}
	};
	// 处理上传逻辑
	const beforeUpload = (file, list) => {
		const typeReg = /\.(xls|xlsx)$/;
		console.log(file);
		if (!typeReg.test(file.name)) {
			message.warning(`文件：${file.name}不符合上传类型要求`);
			return;
		}
		if (showType === "1") {
			uploadTypeOneFileRef.current = file;
		} else {
			uploadTypeTwoFileRef.current = file;
		}
		setFileList([file]);
		return false;
	};
	// 下载模板文件
	const downloadFile = async () => {
		try {
			setDownloadLoadLoading(true);
			let res = await GET_TEMPLATE_FILE_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			if (res.data && res.data.records && res.data.records.length) {
				// templateFileRef.current=res.data.record[0]
				saveAs(
					res.data.records[0].fileUrl,
					res.data.records[0].fileName
				);
			} else {
				message.warning("模板未上传，请联系平台管理员上传模板文件");
			}
		} catch (error) {
			console.log(error);
		} finally {
			setDownloadLoadLoading(false);
		}
	};
	// 删除选择好待上传的文件
	const removeFile = (params) => {
		if (showType === "1") {
			uploadTypeOneFileRef.current = null;
		} else {
			uploadTypeTwoFileRef.current = null;
		}
		setFileList([]);
	};
	// 导出成员文件
	const exportMembersExcelFile = async () => {
		try {
			setExportLoading(true);
			let res = await EXPORT_EXCEL_FILE_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			if (res.data && res.data.previewUrl) {
				// templateFileRef.current=res.data.record[0]
				saveAs(res.data.previewUrl, res.data.name);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setExportLoading(false);
		}
	};
	const renderUploadComp = (fileList) => {
		return fileList && fileList.length ? (
			<>
				<div className={styles.fileList}>
					<img src={fileIcon} alt="" />
					<span className={styles.fileName}>{fileList[0].name}</span>
					<img
						onClick={removeFile}
						className={styles.removeIcon}
						src={delIcon}
						alt=""
					/>
				</div>
				<Upload
					beforeUpload={beforeUpload}
					// action="http://192.168.11.118:30071/file/no_token/file/upload"
					maxCount={1}
					multiple={false}
					showUploadList={false}
				>
					<Button
						size="large"
						style={{
							fontSize: 14,
							color: "#666",
						}}
						icon={<UploadOutlined />}
					>
						重新上传
					</Button>
				</Upload>
			</>
		) : (
			<>
				<Upload
					beforeUpload={beforeUpload}
					// action="http://192.168.11.118:30071/file/no_token/file/upload"
					maxCount={1}
					multiple={false}
					showUploadList={false}
				>
					<Button
						type="primary"
						size="large"
						style={{ fontSize: 14 }}
						icon={<UploadOutlined />}
					>
						上传文件
					</Button>
				</Upload>
				<span className={styles.stepTip}>支持格式：xls、xlsx</span>
			</>
		);
	};

	return (
		<div className={styles.membersImportOrExport}>
			<div className={styles.header}>
				<span>批量导入或导出</span>
				<img
					onClick={(e) => close()}
					className={styles.closeIcon}
					src={closeIcon}
					alt=""
				/>
			</div>
			<div className={styles.content}>
				<Radio.Group
					value={showType}
					defaultValue="1"
					size="large"
					onChange={handleOnTypeChange}
				>
					<Radio.Button
						style={{
							fontSize: 14,
							color: showType === "1" ? "#1d59fb" : "#999999",
							backgroundColor:
								showType === "1" ? "#ecf2ff" : "#fff",
						}}
						value="1"
					>
						导入新成员
					</Radio.Button>
					<Radio.Button
						style={{
							fontSize: 14,
							color: showType === "2" ? "#1d59fb" : "#999999",
							backgroundColor:
								showType === "2" ? "#ecf2ff" : "#fff",
						}}
						value="2"
					>
						导出成员信息
					</Radio.Button>
				</Radio.Group>
				<div className={styles.tabContent}>
					{showType === "1" ? (
						<div className={styles.page}>
							<div className={styles.step}>
								<span className={styles.label}>第一步：</span>
								<div className={styles.stepContent}>
									<div className={styles.stepTitleWrap}>
										<span className={styles.stepTitle}>
											下载表单模板，根据提示信息完善表格内容
										</span>
										<Button
											style={{
												fontSize: 14,
												color: "#245ff2",
												marginTop: "-15px",
												marginLeft: "20px",
												borderColor: "#245ff2",
											}}
											loading={downloadLoading}
											onClick={downloadFile}
										>
											下载模板
										</Button>
									</div>
									<span
										className={styles.stepTip}
										style={{ marginTop: 0 }}
									>
										格式要求:
										填写数据到Excel中，不得更改表头信息
									</span>
								</div>
							</div>
							<div className={styles.step}>
								<span className={styles.label}>第二步：</span>
								<div className={styles.stepContent}>
									<span className={styles.stepTitle}>
										上传完善后的表格
									</span>
									{renderUploadComp(fileList)}
								</div>
							</div>
						</div>
					) : (
						<div className={styles.page}>
							<div className={styles.step}>
								<span className={styles.label}>第一步：</span>
								<div className={styles.stepContent}>
									<span className={styles.stepTitle}>
										导出通讯录
									</span>
									<span
										className={styles.stepTip}
										style={{ marginTop: 0 }}
									>
										导出后，可在本地进行成员信息批量修改，完成后在下方再次上传
									</span>
									<Button
										onClick={exportMembersExcelFile}
										loading={exportLoading}
										style={{ fontSize: 14, color: "#666" }}
									>
										导出
									</Button>
								</div>
							</div>
							<div className={styles.step}>
								<span className={styles.label}>第二步：</span>
								<div className={styles.stepContent}>
									<span className={styles.stepTitle}>
										上传修改后的表格
									</span>
									{renderUploadComp(fileList)}
									{/* <Upload {...props}>
										<Button
											type="primary"
											size="large"
											style={{ fontSize: 14 }}
											icon={<UploadOutlined />}
										>
											上传文件
										</Button>
									</Upload>
									<span className={styles.stepTip}>
										支持格式：xls、xlsx
									</span> */}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className={styles.footer}>
				<div className={styles.left}>
					{showType === "2" ? null : (
						<Checkbox
							style={{ fontSize: 14, color: "#666" }}
							checked={ifSendMsg}
							onChange={onCheckboxChange}
						>
							通过短信发送邀请
						</Checkbox>
					)}
				</div>
				<div className={styles.right}>
					<Space>
						<Button
							size="large"
							onClick={(e) => close()}
							disabled={submitLoading || exportLoading}
							style={{
								fontSize: 14,
							}}
							className="cus-btn-48"
						>
							取消
						</Button>
						<Button
							size="large"
							onClick={(e) => confirm()}
							loading={submitLoading}
							style={{
								fontSize: 14,
							}}
							disabled={fileList.length === 0}
							className="cus-btn-48"
							type="primary"
							// className="cus-btn-48"
						>
							导入
						</Button>
					</Space>
				</div>
			</div>
		</div>
	);
};

export default MembersImportOrExport;
