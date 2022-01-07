import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { Form, Input, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import logo from "@/asset/img/login_logo.png";
import "animate.css";
import {
	LOGIN_BY_PWD_API,
	GET_TENANT_LIST_API,
	SEND_VERIFY_CODE_API,
	UPDATE_PASSWORD_API,
} from "@/api/loginApi";
import { connect } from "react-redux";
import { userUpdateAction } from "@/store/actions/user_action";

const LoginForm = (props) => {
	const [form] = Form.useForm();
	const [codeform] = Form.useForm();
	const [codeTip, setCodeTip] = useState("发送验证码");
	const [sendOk, setSendOk] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pwdLoading, setPwdLoading] = useState(false);

	const [forgetPwd, setForgetPwd] = useState(false);
	const countDownRef = useRef(null);
	const countDownNumRef = useRef(60);
	useEffect(() => {
		if (sendOk) {
			countDown();
		}
	}, [sendOk]);
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
	const onFinish = async (values) => {
		try {
			setLoading(true);
			const params = {
				phone: values.phone,
				password: values.password,
				expireType: values.autologin ? 1 : 0,
			};
			let res = await LOGIN_BY_PWD_API(params);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			const userUpdate = {
				userToken: res?.data?.token ?? "",
				id: res?.data?.user?.id ?? "",
				nickname: res?.data?.user?.nickname ?? "",
				name: res?.data?.user?.name ?? "",
				phone: res?.data?.user?.phone ?? "",
				avatar: res?.data?.user?.avatar ?? "",
				sex: res?.data?.user?.sex ?? "2",
				personalStatus: res?.data?.user?.personalStatus ?? "",
			};
			props.userUpdateAction(userUpdate);
			let listRes = await GET_TENANT_LIST_API({ userId: userUpdate.id });
			if (!listRes) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			let projectData = [];
			listRes?.data?.forEach((v) => {
				projectData.push({
					id: v.id,
					name: v.tenantName,
					nature: v.nature,
					disable: v.disable,
				});
			});
			props.setUnitList([...projectData]);
			props.setLoggedState(true);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const onForgetFinish = async (values) => {
		try {
			setPwdLoading(true);
			let res = await UPDATE_PASSWORD_API(values);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("密码修改成功，请重新登录");
			setForgetPwd(false);
		} catch (error) {
			console.log(error);
		} finally {
			setPwdLoading(false);
		}
	};
	const handleForgetPwd = () => {
		const values = form.getFieldsValue();
		codeform.resetFields();
		codeform.setFieldsValue({ phone: values.phone });
		setForgetPwd(true);
	};
	const goBackLogin = (params) => {
		const values = codeform.getFieldsValue();
		form.resetFields();
		form.setFieldsValue({ phone: values.phone });
		setForgetPwd(false);
	};

	return (
		<div
			className={`${styles.loginFormWrap} animate__animated animate__fadeInRight`}
		>
			<img src={logo} alt="" />
			<span className={styles.title}>公路云企业管理后台</span>
			{forgetPwd ? (
				<>
					<Form
						key="formOne"
						form={codeform}
						name="code_form"
						style={{ width: "100%" }}
						initialValues={null}
						onFinish={onForgetFinish}
					>
						<Form.Item noStyle>
							<Form.Item
								className={styles.formItemWrap}
								name="phone"
								rules={[
									{
										required: true,
										message: "请输入手机号码!",
									},
									{
										pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
										message: "请输入正确的手机号码",
									},
								]}
							>
								<Input
									autoComplete="off"
									className={styles.formItemInput}
									maxLength={11}
									prefix={
										<>
											<span>+86</span>
											<span style={{ color: "#b4b4b4" }}>
												&nbsp;&nbsp;|&nbsp;&nbsp;
											</span>
										</>
									}
									// className="cus-nomal-input"
									bordered={false}
									placeholder="请输入手机号码"
								/>
							</Form.Item>
							{/* <div className="phone-zone">中国+86</div> */}
						</Form.Item>
						<Form.Item className={styles.formItemWrap}>
							<Form.Item
								// className={styles.formItemWrap}
								name="code"
								rules={[
									{
										required: true,
										message: "请输入验证码!",
									},
								]}
							>
								<Input
									autoComplete="off"
									className={styles.formItemInputPassword}
									bordered={false}
									maxLength={6}
									placeholder="请输入验证码"
								/>
							</Form.Item>
							<div className={styles.cusSuffix}>
								<span>|&nbsp;&nbsp;&nbsp;&nbsp;</span>
								<span onClick={sendMessage}>{codeTip}</span>
							</div>
						</Form.Item>
						{/* <Form.Item className={styles.formItemWrap}> */}
						<Form.Item
							autoComplete="off"
							className={styles.formItemWrap}
							name="password"
							rules={[
								{
									required: true,
									message: "请输入密码!",
								},
							]}
						>
							<Input.Password
								className={styles.formItemInput}
								bordered={false}
								autoComplete="off"
								placeholder="设置登录密码（8-20位，包含字母和数字）"
								iconRender={(visible) =>
									visible ? (
										<EyeTwoTone />
									) : (
										<EyeInvisibleOutlined />
									)
								}
							/>
						</Form.Item>
						<Form.Item style={{ marginBottom: 10 }}>
							<Button
								loading={pwdLoading}
								block
								// size="large"
								type="primary"
								htmlType="submit"
								className={styles.cusBtn}
							>
								修改密码
							</Button>
						</Form.Item>
						<div className={styles.goBack}>
							已有账号?{" "}
							<span onClick={(e) => goBackLogin()}>直接登录</span>
						</div>
					</Form>
				</>
			) : (
				<Form
					form={form}
					key="formTwo"
					name="login_form"
					style={{ width: "100%" }}
					initialValues={{
						remember: true,
					}}
					onFinish={onFinish}
				>
					<Form.Item noStyle>
						<Form.Item
							className={styles.formItemWrap}
							name="phone"
							rules={[
								{
									required: true,
									message: "请输入手机号码!",
								},
								{
									pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
									message: "请输入正确的手机号码",
								},
							]}
						>
							<Input
								autoComplete="off"
								className={styles.formItemInput}
								maxLength={11}
								prefix={
									<>
										<span>+86</span>
										<span style={{ color: "#b4b4b4" }}>
											&nbsp;&nbsp;|&nbsp;&nbsp;
										</span>
									</>
								}
								// className="cus-nomal-input"
								bordered={false}
								placeholder="请输入手机号码"
							/>
						</Form.Item>
						{/* <div className="phone-zone">中国+86</div> */}
					</Form.Item>
					<Form.Item className={styles.formItemWrap}>
						<Form.Item
							className={styles.formItemWrap}
							name="password"
							rules={[
								{
									required: true,
									message: "请输入密码!",
								},
							]}
						>
							<Input.Password
								className={styles.formItemInputPassword}
								bordered={false}
								placeholder="请输入登录密码"
								// suffix={<span>| 忘记密码</span>}
								iconRender={(visible) =>
									visible ? (
										<EyeTwoTone />
									) : (
										<EyeInvisibleOutlined />
									)
								}
							/>
						</Form.Item>
						<div className={styles.cusSuffix}>
							<span>|&nbsp;&nbsp;&nbsp;&nbsp;</span>
							<span
								onClick={(e) => {
									handleForgetPwd();
								}}
							>
								忘记密码
							</span>
						</div>
					</Form.Item>
					{/* <Form.Item className="cus-form-checkbox-item">
                <Form.Item name="autologin" valuePropName="checked" noStyle>
                    <Checkbox><span style={{ color: "#999999" }}>3天内自动登录</span></Checkbox>
                </Form.Item>
                <a className="login-form-registe-btn" href="">注册账号</a>
            </Form.Item> */}
					<Form.Item style={{ marginBottom: 10 }}>
						<Button
							loading={loading}
							block
							// size="large"
							type="primary"
							htmlType="submit"
							className={styles.cusBtn}
						>
							登录
						</Button>
					</Form.Item>
				</Form>
			)}
		</div>
	);
};

export default connect(
	(state) => ({
		userInfo: state.userInfo,
	}),
	{
		userUpdateAction: userUpdateAction,
	}
)(LoginForm);
