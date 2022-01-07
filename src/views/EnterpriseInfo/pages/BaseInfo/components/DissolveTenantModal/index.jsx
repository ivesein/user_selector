import React, { useState, useEffect, useRef, useCallback } from "react";
import { message, Button, Space, Form, Modal, Row, Col } from "antd";
import UserSelect from "@/components/UserSelect";
import CusFormItemLabel from "@/components/CusFormItemLabel";
import CusFormItemInput from "@/components/CusFormItemInput";
import CusFormItemSelectDisplay from "@/components/CusFormItemSelectDisplay";

import styles from "./index.module.scss";
import closeIcon from "@/asset/img/del.png";
import SelectUserModal from "@/components/SelectUserModal";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
	GET_TENANT_DETAIL_API,
	GET_OPTIONS_INITINFO_API,
	DISSOLVE_TENTANT_API,
	SEND_VERIFY_CODE_API,
	CHECK_CODE_API,
} from "@/api/enterpriseApi";

const DissolveTenantModal = (props) => {
	const [formFields, setFormFields] = useState([]);
	// const [dissolveformFields, setDissolveformFields] = useState([]);

	// const [loading, setLoading] = useState(false); //确定按钮提交loading
	const [form] = Form.useForm();
	const [dissolveform] = Form.useForm();

	const [submitLoading, setSubmitLoading] = useState(false); //提交loading
	const [codeTip, setCodeTip] = useState("发送验证码");
	const [sendOk, setSendOk] = useState(false);
	const [checkOk, setCheckOk] = useState(false);

	const countDownRef = useRef(null);
	const countDownNumRef = useRef(60);
	useEffect(() => {
		if (sendOk) {
			countDown();
		}
	}, [sendOk]);
	useEffect(() => {
		setFormFields([...initFormFields(codeTip)]);
	}, [codeTip]);
	// useEffect(() => {
	// 	if (props.userOptions) {
	// 		setDissolveformFields([...initDissolveFormFields(props.userOptions)]);
	// 	}
	// }, [props.userOptions]);
	// 验证验证码提交
	const checkConfirm = async () => {
		// const id = form.getFieldValue("id");
		// if (!id) {
		// 	message.warning("请选择要添加的管理员");
		// 	return;
		// }
		// setSubmitLoading(true);
		const formValues = form.getFieldsValue();
		if (!formValues.code) {
			message.waring("请输入验证码");
			return;
		}
		try {
			const params = {
				phone: formValues.phone,
				code: formValues.code,
			};
			const res = await CHECK_CODE_API(params);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			setCheckOk(true);
			// 	let res = await ADD_TENANT_ADMINISTRATOR_API(id);
			// 	if (!res) {
			// 		message.error("服务器繁忙，请稍后再试...");
			// 		return;
			// 	}
			// 	message.success("添加超级管理员成功!");
			// 	props.reload();
		} catch (error) {
			console.log(error);
			setCheckOk(false);
		} finally {
			setSubmitLoading(false);
		}
	};
	// 转移提交
	const confirm = async (params) => {
		const name = dissolveform.getFieldValue("name");
		if (!name) {
			message.warning("请输入完整的企业名称");
			return;
		}
		setSubmitLoading(true);
		try {
			const res = await DISSOLVE_TENTANT_API(name);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("解散企业成功");
			props.reload();
		} catch (error) {
			console.log(error);
		} finally {
			setSubmitLoading(false);
		}
	};

	const close = (params) => {
		props.modal.destroy();
	};
	const initFormFields = (codeTip) => {
		return [
			{
				name: "phone",
				required: false,
				label: "手机号",
				rules: [],
				field: <CusFormItemInput disabled />,
			},
			{
				name: "code",
				required: false,
				label: "验证码",
				rules: [],
				field: (
					<CusFormItemInput
						maxLength={6}
						placeholder="请输入验证码"
						suffix={
							<div
								className={styles.sendMsgBtn}
								onClick={(e) => sendMessage()}
							>
								{codeTip}
							</div>
						}
					/>
				),
			},
		];
	};
	const dissolveFormFields = [
		{
			name: "name",
			required: false,
			label: "请再次确认需要解散的企业",
			rules: [],
			field: (
				<CusFormItemInput
					maxLength={200}
					placeholder="请输入完整的企业名称"
				/>
			),
		},
	];
	// 执行倒计时
	const countDown = () => {
		countDownRef.current = setInterval(() => {
			if (countDownRef.current && countDownNumRef.current > 0) {
				countDownNumRef.current = countDownNumRef.current - 1;
				setCodeTip(countDownNumRef.current);
			}
			if (countDownNumRef.current === 0) {
				clearInterval(countDownRef.current);
				countDownRef.current = null;
				setSendOk(false);
				setCodeTip("重新发送");
				countDownNumRef.current = 60;
			}
		}, 1000);
	};
	const sendMessage = async () => {
		const phone = form.getFieldValue("phone");
		if (!phone) {
			message.warning("请输入手机号码");
			return;
		}
		try {
			if (codeTip === "发送验证码" || codeTip === "重新发送") {
				const res = await SEND_VERIFY_CODE_API({ phone });
				if (!res) {
					message.error("服务器繁忙，请稍后再试...");
					return;
				}
				setSendOk(true);
			} else {
				return;
			}
		} catch (error) {
			setSendOk(false);
		}
	};
	// 渲染表单元素
	const renderFormItem = (items) => {
		return (
			items &&
			items.map((item) => {
				return (
					<Col span={24} key={item.name}>
						<Form.Item
							name={item.name}
							// labelCol={{ span: item.block ? 1 : 4 }}
							label={
								<CusFormItemLabel
									label={item.label}
									required={item.required}
								/>
							}
							required={item.required}
							rules={item.rules}
						>
							{item.field}
						</Form.Item>
					</Col>
				);
			})
		);
	};

	return (
		<div
			style={{
				width: checkOk ? "720px" : "480px",
				height: checkOk ? "550px" : "400px",
			}}
			className={styles.dissolveModal}
		>
			<div className={styles.header}>
				<span>
					{checkOk ? "确认解散企业" : "请输入验证码，确认管理员身份"}
				</span>
				<img
					onClick={(e) => close()}
					className={styles.closeIcon}
					src={closeIcon}
					alt=""
				/>
			</div>
			<div className={styles.content}>
				{checkOk ? (
					<div>
						<div className={styles.wariningTip}>
							<ExclamationCircleFilled
								className={styles.waringIcon}
							/>
							<span className={styles.tip}>点击确认解散后</span>
						</div>
						<div className={styles.wariningTipExtend}>
							<span className={styles.extendInfoOne}>
								你的企业将于 24 小时后自动解散，24
								小时内可撤销操作
							</span>
							<span className={styles.extendInfoTwo}>
								解散后将删除所有成员帐号、通讯录联系人、云文档及知识库类等数据。一旦删除，将无法找回。此操作不可逆，请谨慎操作
							</span>
						</div>
						<Form
							form={dissolveform}
							// {...formItemLayout}
							wrapperCol={{
								xs: { span: 24 },
								sm: { span: 24 },
							}}
							colon={false}
							requiredMark={false}
							name="dissolve_form"
							// onFinish={props.onFinish}
							initialValues={{
								id: props.id,
							}}
							layout="vertical"
						>
							<Row gutter={24}>
								{renderFormItem(dissolveFormFields)}
							</Row>
						</Form>
					</div>
				) : (
					<Form
						form={form}
						// {...formItemLayout}
						wrapperCol={{
							xs: { span: 24 },
							sm: { span: 24 },
						}}
						colon={false}
						requiredMark={false}
						name="check_form"
						// onFinish={props.onFinish}
						initialValues={{
							phone: props?.userInfo?.phone ?? "",
						}}
						layout="vertical"
					>
						<Row gutter={24}>{renderFormItem(formFields)}</Row>
					</Form>
				)}
			</div>
			<div className={styles.footer}>
				<div className={styles.left}></div>
				<div className={styles.right}>
					<Space>
						<Button
							size="large"
							onClick={(e) => close()}
							disabled={submitLoading}
							style={{
								fontSize: 14,
								color: "#777",
								width: "120px",
								height: "48px",
							}}
						>
							取消
						</Button>
						{checkOk ? (
							<Button
								size="large"
								type="primary"
								onClick={(e) => confirm()}
								loading={submitLoading}
								style={{
									fontSize: 14,
									width: "120px",
									height: "48px",
								}}
								// className="cus-btn-48"
							>
								确定
							</Button>
						) : (
							<Button
								size="large"
								type="primary"
								onClick={(e) => checkConfirm()}
								loading={submitLoading}
								style={{
									fontSize: 14,
									width: "120px",
									height: "48px",
								}}
								// className="cus-btn-48"
							>
								确定
							</Button>
						)}
					</Space>
				</div>
			</div>
		</div>
	);
};

export default DissolveTenantModal;
