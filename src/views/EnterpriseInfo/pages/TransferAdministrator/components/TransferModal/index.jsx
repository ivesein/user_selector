import React, { useState, useEffect, useRef, useCallback } from "react";
import { message, Button, Space, Form, Modal, Row, Col } from "antd";
import UserSelect from "@/components/UserSelect";
import CusFormItemLabel from "@/components/CusFormItemLabel";
import CusFormItemInput from "@/components/CusFormItemInput";
import CusFormItemSelectDisplay from "@/components/CusFormItemSelectDisplay";

import styles from "./index.module.scss";
import closeIcon from "@/asset/img/del.png";
import SelectUserModal from "@/components/SelectUserModal";

import {
	GET_TENANT_DETAIL_API,
	GET_OPTIONS_INITINFO_API,
	UPLOAD_TENANT_CERTIFICATION_INFO_API,
	SEND_VERIFY_CODE_API,
	CHECK_CODE_API,
	CHANGE_CREATOR_API,
} from "@/api/enterpriseApi";

const TransferModal = (props) => {
	const [formFields, setFormFields] = useState([]);
	const [transformFields, setTransformFields] = useState([]);

	// const [loading, setLoading] = useState(false); //确定按钮提交loading
	const [form] = Form.useForm();
	const [transform] = Form.useForm();

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
	useEffect(() => {
		if (props.userOptions) {
			setTransformFields([...initTransFormFields(props.userOptions)]);
		}
	}, [props.userOptions]);
	// 验证验证码提交
	const checkConfirm = async () => {
		setSubmitLoading(true);
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
		} catch (error) {
			console.log(error);
			setCheckOk(false);
		} finally {
			setSubmitLoading(false);
		}
	};
	// 转移提交
	const confirm = async (params) => {
		const id = transform.getFieldValue("id");
		if (!id) {
			message.warning("请选择要转移的管理员");
			return;
		}
		setSubmitLoading(true);
		try {
			const res = await CHANGE_CREATOR_API(id);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("转移创建人成功");
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
	const initTransFormFields = (userOptions) => {
		return [
			{
				name: "id",
				required: false,
				label: "完成转移后，你的超级管理员权限仍被保留",
				rules: [],
				field: (
					<CusFormItemSelectDisplay
						onClick={(e) => openUserSelect()}
						placeholder="请选择直属上级"
						options={userOptions}
					/>
				),
			},
		];
	};
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
	// 打开组织对话框选择直属上级
	const openUserSelect = () => {
		const userSelectModal = Modal.confirm({
			modalRender: () => (
				<SelectUserModal
					title="选择人员"
					useOldApi={false}
					// orgData={props?.orgData ?? []}
					// userOptions={props?.userOptions ?? []}
					modal={userSelectModal}
					ok={(ids) => {
						transform.setFieldsValue({
							id: ids && ids.length ? ids[0] : "",
						});
						userSelectModal.destroy();
					}}
				/>
			),
			width: 720,
			height: 720,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	return (
		<div className={styles.transferModal}>
			<div className={styles.header}>
				<span>
					{checkOk ? "转移创建人" : "请输入验证码，确认管理员身份"}
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
						<span>请选择新的创建人</span>
						<Form
							form={transform}
							// {...formItemLayout}
							wrapperCol={{
								xs: { span: 24 },
								sm: { span: 24 },
							}}
							colon={false}
							requiredMark={false}
							name="trans_form"
							// onFinish={props.onFinish}
							initialValues={
								{
									// id: props.id,
								}
							}
							layout="vertical"
						>
							<Row gutter={24}>
								{renderFormItem(transformFields)}
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

export default TransferModal;
