import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	Form,
	message,
	Button,
	Space,
	Col,
	Modal,
	Row,
	Checkbox,
	Steps,
	Spin,
} from "antd";
import { useHistory } from "react-router-dom";
import CusFormItemLabel from "@/components/CusFormItemLabel";
import CusFormItemInput from "@/components/CusFormItemInput";
import CusFormItemSelect from "@/components/CusFormItemSelect";
import CusFormItemUpload from "@/components/CusFormItemUpload";
import AuditResult from "./components/AuditResult";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import InfoTitle from "@/components/common/InfoTitle";
import { connect } from "react-redux";
import ServiceAgreement from "./components/ServiceAgreement";

import styles from "./index.module.scss";
import { Switch, Route, Redirect } from "react-router-dom";
import PrivateRouter from "@/components/PrivateRouter";
// import Roles from './pages/Roles'
// import Members from './pages/Members'
// import InviteMembers from './pages/Members/components/InviteMembers'
import authcod from "@/asset/img/authcod.png";
import idcard from "@/asset/img/idcard.png";
import letter from "@/asset/img/letter.png";
import {
	GET_TENANT_DETAIL_API,
	GET_OPTIONS_INITINFO_API,
	UPLOAD_TENANT_CERTIFICATION_INFO_API,
	SEND_VERIFY_CODE_API,
	CHECK_VERIFY_CODE_API,
} from "@/api/enterpriseApi";
import "./index.scss";
import { breadcrumbsPath } from "@/router/constant.js";
const { Step } = Steps;
// 组织架构
const ApplyCertification = (props) => {
	const history = useHistory();
	const [cStep, setCStep] = useState(0);
	const [audit, setAudit] = useState(0); //当前认证状态

	const [orgFormFields, setOrgFormFields] = useState([]);
	const [adminFormFields, setAdminFormFields] = useState([]);
	const [codeFormFields, setCodeFormFields] = useState([]);

	const [letterFormFields, setLetterFormFields] = useState([
		{
			name: "missive",
			required: true,
			label: "上传认证公函",
			rules: [{ required: true, message: "请上传认证公函" }],
			field: (
				<CusFormItemUpload
					typeReg={/\.(jpg|png|jpeg|bmp)$/}
					defaultImg={letter}
					tip="请下载认证公函，按要求填写所有信息需清晰可见，内容真实有效。信息需清晰可见，内容真实有效，不得做任何修改。支持 JPG、JPEG、PNG、BMP 格式，大小不超过 5 MB。"
					maxSize={5 * 1024 * 1024}
					width={390}
					extendsBtns={[
						<Button
							size="large"
							style={{
								fontSize: 14,
								color: "#666",
							}}
							onClick={(e) => downLetterTemp()}
						>
							下载公函模板
						</Button>,
						<Button
							size="large"
							style={{
								fontSize: 14,
								color: "#666",
							}}
							onClick={(e) => checkLetterTemp()}
						>
							查看示例图片
						</Button>,
					]}
				/>
			),
		},
	]);
	const [iSee, setIsee] = useState(false);
	const [agreementVisible, setAgreementVisible] = useState(false);

	const [loading, setLoading] = useState(false);
	const [orgType, setOrgType] = useState([]);
	const [codeTip, setCodeTip] = useState("发送验证码");
	const [sendOk, setSendOk] = useState(false);
	const [validateInfo, setValidateInfo] = useState({
		validateStatus: null,
		help: "",
	});

	const [orgform] = Form.useForm(); //组织
	const [adminform] = Form.useForm(); //管理员
	const [letterform] = Form.useForm(); //公函
	const [codeform] = Form.useForm(); //验证码
	const [agreeform] = Form.useForm(); //验证码

	const countDownRef = useRef(null);
	const countDownNumRef = useRef(60);
	const extendIdRef = useRef(null);

	useEffect(() => {
		getTenantCertificationInfo();
		getOrgTypeAndScale();
	}, []);
	useEffect(() => {
		if (audit === 0) {
			setCStep(0);
		}
		if (audit === 1) {
			setCStep(1);
		}
		if (audit === 2 || audit === 3) {
			setCStep(2);
		}
	}, [audit]);
	useEffect(() => {
		if (sendOk) {
			countDown();
		}
	}, [sendOk]);
	useEffect(() => {
		setCodeFormFields([...initCodeFormFields(codeTip, validateInfo)]);
	}, [codeTip]);
	useEffect(() => {
		setCodeFormFields([...initCodeFormFields(codeTip, validateInfo)]);
	}, [validateInfo]);
	useEffect(() => {
		setOrgFormFields([...initFormFields(orgType)]);
		setAdminFormFields([...initAdminFormFields()]);
	}, [orgType]);
	const downLetterTemp = (params) => {};
	const checkLetterTemp = (params) => {};
	// 获取企业认证信息
	const getTenantCertificationInfo = async () => {
		try {
			setLoading(true);
			let res = await GET_TENANT_DETAIL_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			const { audit, jjskTenantInfo, jjskTenantCertification } =
				res?.data;
			setAudit(audit);
			extendIdRef.current = jjskTenantInfo?.id ?? "";

			const { jjskTenantInfoExtend } = jjskTenantInfo ?? {};

			orgform.setFieldsValue({
				organizationType:
					jjskTenantInfo && jjskTenantInfoExtend.organizationType
						? jjskTenantInfoExtend.organizationType + ""
						: "",
				authCode: jjskTenantCertification?.authCode ?? "",
				businessLicense: jjskTenantCertification?.businessLicense ?? "",
			});
			adminform.setFieldsValue({
				adminName: jjskTenantInfoExtend?.adminName ?? "",
				adminIdCard: jjskTenantInfoExtend?.adminIdCard ?? "",
				adminCardPic: jjskTenantInfoExtend?.adminCardPic ?? "",
			});
			letterform.setFieldsValue({
				missive: jjskTenantInfoExtend?.missive ?? "",
			});

			// form.setFieldsValue({
			// 	name: tenantName || "",
			// 	type: tenantType?.split(",") ?? [],
			// 	contacts: contacts,
			// 	phone: telephone,
			// 	scale: scale,
			// });
			// displayForm.setFieldsValue({
			// 	name: tenantName || "",
			// 	type: tenantType?.split(",") ?? [],
			// 	contacts: contacts || "",
			// 	phone: telephone || "",
			// 	scale: scaleName || "",
			// });
			// setTypes([...(res?.data ?? [])]);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
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
	const onStepChange = (params) => {};
	const getOrgTypeAndScale = async () => {
		try {
			const res = await GET_OPTIONS_INITINFO_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			if (
				res.data &&
				res.data.organizationType &&
				res.data.organizationType.length
			) {
				setOrgType([
					...res.data.organizationType.map((item) => ({
						id: item.id,
						label: item.value,
						value: item.id,
					})),
				]);
			}
			// setTypes([...(res?.data ?? [])]);
		} catch (error) {
			console.log(error);
		} finally {
			// setSubmitLoading(false);
		}
	};
	// 渲染表单元素
	const renderFormItem = (items) => {
		return (
			items &&
			items.map((item) => {
				return (
					<Col span={item.span ? item.span : 24} key={item.name}>
						<Form.Item
							name={item.name}
							labelCol={{
								span: item.block
									? 1
									: item.labelSpan
									? item.labelSpan
									: 4,
							}}
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
	const initFormFields = (orgTypeOptions) => {
		return [
			{
				name: "organizationType",
				required: true,
				label: "组织类型",
				rules: [{ required: true, message: "请选择组织类型" }],
				field: (
					<CusFormItemSelect options={orgTypeOptions} width={390} />
				),
			},
			{
				name: "authCode",
				required: true,
				label: "统一社会信用代码",
				rules: [
					{ required: true, message: "请输入统一社会信用代码" },
					{
						pattern: /^[0-9A-Z]{2}\d{6}[0-9A-Z]{10}$/,
						message: "请输入正确的统一社会信用代码",
					},
				],
				field: (
					<CusFormItemInput
						placeholder="请输入统一社会信用代码"
						maxLength={18}
						width={390}
					/>
				),
			},
			{
				name: "businessLicense",
				required: true,
				label: "单位/企业营业执照",
				rules: [{ required: true, message: "请上传单位/企业营业执照" }],
				field: (
					<CusFormItemUpload
						typeReg={/\.(jpg|png|jpeg|bmp)$/}
						defaultImg={authcod}
						tip="请上传营业执照原件照片，文字清晰可辨认，支持jpg、png、jpeg、bmp格式，大小不超过5M"
						maxSize={5 * 1024 * 1024}
						width={390}
					/>
				),
			},
		];
	};
	const initAdminFormFields = (orgTypeOptions) => {
		return [
			{
				name: "adminName",
				required: true,
				label: "姓名",
				rules: [{ required: true, message: "请输入管理员姓名" }],
				field: (
					<CusFormItemInput
						placeholder="请输入管理员姓名"
						maxLength={20}
						width={390}
					/>
				),
			},
			{
				name: "adminIdCard",
				required: true,
				label: "身份证号码",
				rules: [
					{ required: true, message: "请输入统一社会信用代码" },
					{
						pattern:
							/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
						message: "请输入正确的统一社会信用代码",
					},
				],
				field: (
					<CusFormItemInput
						placeholder="请输入统一社会信用代码"
						maxLength={20}
						width={390}
					/>
				),
			},
			{
				name: "adminCardPic",
				required: true,
				label: "上传手持身份证照片",
				rules: [{ required: true, message: "请上传手持身份证照片" }],
				field: (
					<CusFormItemUpload
						typeReg={/\.(jpg|png|jpeg|bmp)$/}
						defaultImg={idcard}
						tip="请上传手持身份证照片，文字清晰可辨认，支持jpg、png、jpeg、bmp格式，大小不超过5M"
						maxSize={5 * 1024 * 1024}
						width={390}
					/>
				),
			},
		];
	};
	// 渲染表单元素
	const renderCodeFormItem = (items) => {
		return (
			items &&
			items.map((item) => {
				return item.cusValidate ? (
					<Col span={item.span ? item.span : 24} key={item.name}>
						<Form.Item
							name={item.name}
							labelCol={{
								span: item.block
									? 1
									: item.labelSpan
									? item.labelSpan
									: 4,
							}}
							validateStatus={item.validateStatus}
							help={item.help}
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
				) : (
					<Col span={item.span ? item.span : 24} key={item.name}>
						<Form.Item
							name={item.name}
							labelCol={{
								span: item.block
									? 1
									: item.labelSpan
									? item.labelSpan
									: 4,
							}}
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
	const initCodeFormFields = (codeTip, validateInfo) => {
		return [
			{
				name: "phone",
				required: true,
				label: "联系电话",
				rules: [{ required: true, message: "请输入管理员联系电话" }],
				span: 11,
				labelSpan: 9,
				field: (
					<CusFormItemInput
						placeholder="联系电话"
						maxLength={15}
						width={390}
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
			{
				name: "code",
				required: true,
				label: "短信验证码",
				span: 13,
				labelSpan: 3,
				validateStatus: validateInfo.validateStatus,
				help: validateInfo.help,
				rules: [
					{ required: true, message: "请输入验证码" },
					// ({ getFieldValue }) => ({
					// 	validator: async (_, value) => {
					// 		if (value) {
					// 			try {
					// 				const params = {
					// 					phone: getFieldValue("phone"),
					// 					smsCode: getFieldValue("code"),
					// 				};
					// 				if (!getFieldValue("phone")) {
					// 					return Promise.reject(
					// 						new Error("手机号错误")
					// 					);
					// 				}
					// 				const res = await CHECK_VERIFY_CODE_API(
					// 					params
					// 				);
					// 				if (!res) {
					// 					return Promise.reject(
					// 						new Error("验证码错误")
					// 					);
					// 				}
					// 				return Promise.resolve();
					// 			} catch (error) {
					// 				return Promise.reject(
					// 					new Error("验证码错误")
					// 				);
					// 			}
					// 		}
					// 	},
					// }),
				],
				field: (
					<CusFormItemInput
						placeholder="请输入验证码"
						maxLength={6}
						width={150}
					/>
				),
			},
		];
	};
	const sendMessage = async () => {
		const phone = codeform.getFieldValue("phone");
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

	const onFormOneChange = (params) => {};
	const onFormTwoChange = (params) => {};
	const onFormThreeChange = (params) => {};
	const onFormCodeChange = (params) => {
		console.log(">>>>>>", params);
		if (params.code !== undefined) {
			if (!params.code) {
				setValidateInfo({
					validateStatus: "error",
					help: "请输入验证码",
				});
			} else {
				setValidateInfo({
					validateStatus: "waiting",
					help: "",
				});
			}
		}
	};
	const cancle = (params) => {
		history.go(-1);
	};
	// 提交认证信息
	const submit = async () => {
		try {
			const orgValues = await orgform.validateFields();
			const adminValues = await adminform.validateFields();
			const codeValuse = await codeform.validateFields();
			const letterValues = await letterform.validateFields();
			const agreeValues = await agreeform.validateFields();

			const params = {
				phone: codeValuse.phone,
				smsCode: codeValuse.code,
			};
			const res = await CHECK_VERIFY_CODE_API(params);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			setValidateInfo({
				validateStatus: "success",
				help: "",
			});
			// 提交认证信息
			const data = {
				...adminValues,
				...letterValues,
				...orgValues,
			};
			const submitRes = await UPLOAD_TENANT_CERTIFICATION_INFO_API(data);
			if (!submitRes) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			// 提交认证信息成功，刷新页面
			getTenantCertificationInfo();
			setIsee(false);
		} catch (error) {
			if (codeform.getFieldValue("phone")) {
				setValidateInfo({
					validateStatus: "error",
					help: "验证码错误",
				});
			} else {
				setValidateInfo({
					validateStatus: "error",
					help: "请输入验证码",
				});
			}
		}
	};
	// 打开同意协议
	const openAgreementModal = (e) => {
		e.stopPropagation();

		setAgreementVisible(true);
	};
	// 审核结果页面按钮点击
	const handleISee = (bool) => {
		setIsee(true);
		getTenantCertificationInfo();
	};
	const closeAgreementModal = (params) => {
		setAgreementVisible(false);
	};

	return (
		<div className={`${styles.applyCertificationPage} apply-page`}>
			<PageBreadcrumb
				pathArr={breadcrumbsPath.apply}
				title="申请认证"
			></PageBreadcrumb>
			<div className={styles.content}>
				{loading ? (
					<Spin
						style={{
							width: "100%",
							height: "100%",
							marginTop: "200px",
						}}
						spinning={loading}
						tip="数据加载中..."
					/>
				) : (
					<div className={styles.applyinfoWrap}>
						<div className={styles.stepsWrapper}>
							<Steps
								type="navigation"
								current={cStep}
								onChange={onStepChange}
								className={styles.cusStepStyle}
								size="small"
							>
								<Step
									status={cStep <= 0 ? "process" : "wait"}
									title="填写资料"
								/>
								<Step
									status={
										cStep < 1
											? "finish"
											: cStep === 1
											? "process"
											: "wait"
									}
									title="提交审核"
								/>
								<Step
									status={
										cStep < 2
											? "finish"
											: cStep === 2
											? "process"
											: "wait"
									}
									title="完成审核"
								/>
							</Steps>
						</div>
						{audit === 0 || iSee ? (
							<>
								<InfoTitle title="组织信息" />
								<Form
									key="1"
									form={orgform}
									// {...formItemLayout}
									labelCol={{ span: 4 }}
									wrapperCol={{
										xs: { span: 20 },
										sm: { span: 20 },
									}}
									colon={false}
									requiredMark={false}
									name="org_form"
									// onFinish={props.onFinish}
									initialValues={{
										organizationType: "",
									}}
									// layout="vertical"
									onValuesChange={onFormOneChange}
								>
									<Row gutter={24}>
										{renderFormItem(orgFormFields)}
									</Row>
								</Form>
								<InfoTitle title="管理员信息" />
								<Form
									key="2"
									form={adminform}
									// {...formItemLayout}
									labelCol={{ span: 4 }}
									wrapperCol={{
										xs: { span: 20 },
										sm: { span: 20 },
									}}
									colon={false}
									requiredMark={false}
									name="admin_form"
									// onFinish={props.onFinish}
									initialValues={null}
									// layout="vertical"
									onValuesChange={onFormTwoChange}
								>
									<Row gutter={24}>
										{renderFormItem(adminFormFields)}
									</Row>
								</Form>
								<Form
									key="4"
									form={codeform}
									// {...formItemLayout}
									labelCol={{ span: 4 }}
									wrapperCol={{
										xs: { span: 20 },
										sm: { span: 20 },
									}}
									colon={false}
									requiredMark={false}
									name="code_form"
									// onFinish={props.onFinish}
									initialValues={{
										phone: props?.userInfo?.phone ?? "",
									}}
									// layout="vertical"
									onValuesChange={onFormCodeChange}
								>
									<Row gutter={24}>
										{renderCodeFormItem(codeFormFields)}
									</Row>
								</Form>
								<InfoTitle title="认证公函" />
								<Form
									key="3"
									form={letterform}
									// {...formItemLayout}
									labelCol={{ span: 4 }}
									wrapperCol={{
										xs: { span: 20 },
										sm: { span: 20 },
									}}
									colon={false}
									requiredMark={false}
									name="letter_form"
									// onFinish={props.onFinish}
									initialValues={{
										type: [],
									}}
									// layout="vertical"
									onValuesChange={onFormThreeChange}
								>
									<Row gutter={24}>
										{renderFormItem(letterFormFields)}
									</Row>
								</Form>
							</>
						) : audit === 1 ? (
							<AuditResult audit={audit} />
						) : audit === 2 ? (
							<AuditResult
								audit={audit}
								button={
									<Button
										size="large"
										style={{
											fontSize: 14,
											color: "#2b2b2b",
											width: "120px",
										}}
										onClick={(e) => handleISee(true)}
									>
										知道了
									</Button>
								}
							/>
						) : audit === 3 ? (
							<AuditResult
								button={
									<Button
										type="primary"
										size="large"
										style={{
											fontSize: 14,
											// color: "#2b2b2b",
											width: "120px",
										}}
										onClick={(e) => handleISee(true)}
									>
										去修改
									</Button>
								}
								audit={audit}
							/>
						) : null}
					</div>
				)}
			</div>
			{audit === 0 || iSee ? (
				<div className={styles.footer}>
					<Form
						key="5"
						form={agreeform}
						// {...formItemLayout}
						// labelCol={{ span: 4 }}
						wrapperCol={{
							xs: { span: 24 },
							sm: { span: 24 },
						}}
						colon={false}
						requiredMark={false}
						name="agree_form"
						// onFinish={props.onFinish}
						initialValues={null}
						// layout="vertical"
					>
						<Form.Item
							name="agree"
							label={null}
							valuePropName="checked"
							rules={[
								({ getFieldValue }) => ({
									validator: (_, value) => {
										if (!value) {
											return Promise.reject(
												new Error(
													"请勾选我已阅读并同意《公路云企业认证隐私协议》"
												)
											);
										}
										return Promise.resolve();
									},
								}),
							]}
						>
							<div>
								<Checkbox className={styles.agree}>
									我已阅读并同意
								</Checkbox>
								《{" "}
								<span
									onClick={(e) => openAgreementModal(e)}
									className={styles.agreement}
								>
									公路云企业认证隐私协议
								</span>
								》
							</div>
						</Form.Item>
					</Form>
					<Space>
						<Button
							size="large"
							style={{
								width: "104px",
								fontSize: 14,
								color: "#666",
							}}
							disabled={loading}
							onClick={(e) => cancle()}
						>
							取消
						</Button>
						<Button
							size="large"
							disabled={loading}
							style={{
								width: "104px",
								fontSize: 14,
								color: "#fff",
								backgroundColor: "#ec6941",
							}}
							type="primary"
							danger
							onClick={(e) => submit()}
						>
							提交审核
						</Button>
					</Space>
				</div>
			) : null}
			<Modal
				title={null}
				visible={agreementVisible}
				width={815}
				centered
				modalRender={() => (
					<ServiceAgreement close={closeAgreementModal} />
				)}
				footer={null}
			></Modal>
		</div>
	);
};

export default connect((state) => ({
	userInfo: state.userInfo,
}))(ApplyCertification);
