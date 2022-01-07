import React, { useState, useEffect, useRef, useCallback } from "react";
import { Form, message, Button, Space, Col, Modal, Row, Spin } from "antd";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import styles from "./index.module.scss";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import CusFormItemLabel from "@/components/CusFormItemLabel";
import CusFormItemInput from "@/components/CusFormItemInput";
import CusFormItemCheckbox from "@/components/CusFormItemCheckbox";
import CusFormItemSelect from "@/components/CusFormItemSelect";
import CusFormItemDisplay from "@/components/CusFormItemDisplay";
import DissolveTenantModal from "./components/DissolveTenantModal";
import CusWarmPrompt from "@/components/CusWarmPrompt";
import TransferModal from "./components/TransferModal";

// import CusFormItemTextAear from "@/components/CusFormItemTextAear";
// import CusFormItemSelectDisplay from "@/components/CusFormItemSelectDisplay";
// import CusFormItemSelectIcon from "@/components/CusFormItemSelectIcon";
// import SelectOrgModal from "@/components/SelectOrgModal";
// import SelectUserModal from "@/components/SelectUserModal";
import InfoTitle from "@/components/common/InfoTitle";
// import Members from './pages/Members'
// import InviteMembers from './pages/Members/components/InviteMembers'
import {
	GET_TENANT_TYPES_API,
	GET_OPTIONS_INITINFO_API,
	GET_TENANT_DETAIL_API,
	UPDATE_TENANT_BASEINFO_API,
	CANCLE_DISSOLVE_TENTANT_API,
} from "@/api/enterpriseApi";
import { GET_TENANT_USERS_API } from "@/api/permApi";
import { breadcrumbsPath } from "@/router/constant.js";
import moment from "moment";

// 基础信息
const BaseInfo = (props) => {
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isCreator, setIsCreator] = useState(false);
	const [formFields, setFormFields] = useState([]);
	const [displayFormFields, setDisplayFormFields] = useState([]);
	const [dissolveStatus, setDissolveStatus] = useState(null); //当前认证状态

	const [types, setTypes] = useState([]);
	const [scale, setScale] = useState([]);
	const [userOptions, setUserOptions] = useState([]); //人员备选项

	const [form] = Form.useForm();
	const [displayForm] = Form.useForm();
	const auditRef = useRef(null);

	const history = useHistory();
	useEffect(() => {
		getTenantTypes();
		getOrgTypeAndScale();
		loadUsersData();
		// getTenantDetailInfo();
	}, []);
	useEffect(() => {
		setFormFields([...initFormFields(types, scale)]);
		setDisplayFormFields([...initDisplayFormFields(types)]);
		if (types.length && scale.length) {
			getTenantDetailInfo();
		}
	}, [types, scale]);
	useEffect(() => {
		let myInterval = null;
		if (dissolveStatus && dissolveStatus.remaining) {
			myInterval = setInterval(() => {
				setDissolveStatus((dissolveStatus) => ({
					...dissolveStatus,
					remaining: dissolveStatus.remaining - 1000,
				}));
			}, 1000);
		}
		return () => {
			if (myInterval) clearInterval(myInterval);
		};
	}, [dissolveStatus]);
	// 获取企业详情信息
	const getTenantDetailInfo = async (params) => {
		try {
			setLoading(true);
			let res = await GET_TENANT_DETAIL_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			const {
				contacts,
				telephone,
				tenantName,
				tenantType,
				audit,
				jjskTenantInfoExtend,
				deleteTime,
				creator,
			} = res?.data?.jjskTenantInfo ?? {};
			// 判断是否是创建者
			setIsCreator(props?.userInfo?.id === creator);
			debugger;
			if (deleteTime) {
				const time = new Date(deleteTime).valueOf();
				// const afterOneDay = time + 24 * 60 * 60 * 1000;
				const now = Date.now().valueOf();
				const remaining = time - now;

				setDissolveStatus({
					status: true,
					remaining,
				});
			} else {
				setDissolveStatus(null);
			}
			auditRef.current = audit === 1 ? true : false;
			const { scale: cscale } = jjskTenantInfoExtend ?? {};
			const scaleName =
				scale?.find((item) => item.id + "" === cscale)?.label ?? "";
			form.setFieldsValue({
				name: tenantName || "",
				type: tenantType?.split(",") ?? [],
				contacts: contacts,
				phone: telephone,
				scale: cscale,
			});
			displayForm.setFieldsValue({
				name: tenantName || "",
				type: tenantType?.split(",") ?? [],
				contacts: contacts || "",
				phone: telephone || "",
				scale: scaleName || "",
			});
			// setTypes([...(res?.data ?? [])]);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	// 获取用户列表
	const loadUsersData = useCallback(async () => {
		try {
			let res = await GET_TENANT_USERS_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}

			console.log(res);
			if (res.data && res.data.length > 0) {
				setUserOptions(
					res.data.map((item) => ({
						id: item.id,
						value: item.userId,
						label: item.name,
					}))
				);
			}
		} catch (error) {
			console.log(error);
		} finally {
		}
	}, []);
	// 跳转申请认证
	const apply = (params) => {
		history.push({
			pathname: "/admin/sys/enterprise_info/apply_certification",
		});
	};
	// 跳转转移管理员
	const transfer = (params) => {
		// history.push({
		// 	pathname: "/admin/sys/enterprise_info/transfer_administrator",
		// });
		const transferModal = Modal.confirm({
			modalRender: () => (
				<TransferModal
					// orgData={orgData}
					userInfo={props.userInfo}
					userOptions={userOptions}
					modal={transferModal}
					reload={() => {
						getTenantDetailInfo();
						transferModal.destroy();
					}}
				/>
			),
			width: 480,
			height: 320,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	// 跳转解散企业
	const dismiss = (params) => {
		const dissolveModal = Modal.confirm({
			modalRender: () => (
				<DissolveTenantModal
					userInfo={props.userInfo}
					modal={dissolveModal}
					reload={() => {
						// loadTableData();
						getTenantDetailInfo();
						dissolveModal.destroy();
					}}
				/>
			),
			width: 480,
			height: 320,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	// 取消编辑
	const cancleEdit = () => {
		setEditing(false);
	};
	// 开始编辑
	const edit = () => {
		if (auditRef.current) {
			message.warning("认证审核中，无法修改企业信息...");
			return;
		}
		setEditing(true);
	};
	// 执行编辑保存
	const save = async (params) => {
		if (auditRef.current === null || auditRef.current) {
			message.warning("认证审核中不允许修改企业信息！");
			return;
		}
		try {
			const formValues = await form.validateFields();
			const params = {
				id: props.userInfo.tenantId,
				tenantName: formValues.name,
				tenantType: formValues.type.join(","),
				contacts: formValues.contacts,
				telephone: formValues.phone,
				jjskTenantInfoExtend: { scale: formValues.scale },
			};
			const res = await UPDATE_TENANT_BASEINFO_API(params);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			message.success("修改成功！");
			getTenantDetailInfo();
			setEditing(false);
		} catch (error) {
			console.log(error);
		}
	};
	// 获取企业类型备选项
	const getTenantTypes = async () => {
		try {
			// setSubmitLoading(true);
			let res = await GET_TENANT_TYPES_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			setTypes([...(res?.data ?? [])]);
		} catch (error) {
			console.log(error);
		} finally {
			// setSubmitLoading(false);
		}
	};
	const getOrgTypeAndScale = async () => {
		try {
			const res = await GET_OPTIONS_INITINFO_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			if (res.data && res.data.scaleList && res.data.scaleList.length) {
				setScale([
					...res.data.scaleList.map((item) => ({
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
	const initFormFields = (typeOptions, scaleOptions) => {
		return [
			{
				name: "name",
				required: true,
				label: "单位/企业名称：",
				rules: [{ required: true, message: "请输入单位/企业名称" }],
				field: (
					<CusFormItemInput
						placeholder="请输入单位/企业名称"
						maxLength={200}
						width={630}
					/>
				),
			},
			{
				name: "scale",
				required: true,
				label: "规模",
				rules: [{ required: true, message: "请选择规模" }],
				field: (
					<CusFormItemSelect
						maxLength={20}
						options={scaleOptions}
						width={390}
					/>
				),
			},
			{
				name: "type",
				required: true,
				label: "单位/企业类型：",
				rules: [{ required: true, message: "请选择单位/企业类型" }],
				field: (
					<CusFormItemCheckbox
						// suffixIconType="2" //suffixIconType 后缀图标  1.默认下拉箭头  2.笔  3.放大镜
						// onClick={(e) => handleOnClick("parentId")}
						// placeholder="请选择上级组织"
						options={typeOptions}
						// mode="multiple"
					/>
				),
			},
			{
				name: "contacts",
				required: true,
				label: "联系人：",
				rules: [{ required: true, message: "请输入联系人" }],
				field: (
					<CusFormItemInput
						placeholder="请输入联系人"
						maxLength={20}
						width={390}
					/>
				),
			},
			{
				name: "phone",
				required: true,
				label: "联系电话",
				rules: [
					{ required: true, message: "请输入联系电话" },
					{
						pattern:
							/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
						message: "请输入正确的手机号码",
					},
				],
				field: (
					<CusFormItemInput
						placeholder="请输入联系电话"
						maxLength={20}
						width={390}
					/>
				),
			},
		];
	};
	const initDisplayFormFields = (typeOptions) => {
		return [
			{
				name: "name",
				required: false,
				label: "单位/企业名称",
				rules: [],
				field: <CusFormItemDisplay width={630} />,
			},
			{
				name: "scale",
				required: false,
				label: "规模",
				rules: [],
				field: <CusFormItemDisplay width={390} />,
			},
			{
				name: "type",
				required: false,
				label: "单位/企业类型",
				rules: [],
				field: (
					<CusFormItemCheckbox
						// suffixIconType="2" //suffixIconType 后缀图标  1.默认下拉箭头  2.笔  3.放大镜
						// onClick={(e) => handleOnClick("parentId")}
						// placeholder="请选择上级组织"
						readOnly={true}
						options={typeOptions}
						// mode="multiple"
					/>
				),
			},
			{
				name: "contacts",
				required: false,
				label: "联系人",
				rules: [],
				field: <CusFormItemDisplay width={390} />,
			},
			{
				name: "phone",
				required: false,
				label: "联系电话",
				rules: [],
				field: <CusFormItemDisplay width={390} />,
			},
		];
	};
	const onFormValuesChange = (params) => {};
	const renderCountDownTime = useCallback((remining) => {
		const hours = parseInt(
			(remining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = parseInt((remining % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = parseInt((remining % (1000 * 60)) / 1000).toFixed(0);

		return <span>{`${hours}小时${minutes}分${seconds}秒`}</span>;
	}, []);
	// 撤销解散企业确认弹框
	const cancleDissolve = (params) => {
		const cancleDissolve = Modal.confirm({
			modalRender: () => (
				<CusWarmPrompt
					modal={cancleDissolve}
					type="WARNING"
					infos={<span>你的企业将恢复到正常状态，确认撤销吗？</span>}
					buttons={[
						<Button
							onClick={(e) => cancleDissolve.destroy()}
							className="cus-btn"
						>
							取消
						</Button>,
						<Button
							// loading={loading}
							onClick={(e) => handleCancle(cancleDissolve)}
							className="cus-btn"
							type="primary"
						>
							确定
						</Button>,
					]}
				/>
			),
			width: 560,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	// 执行撤销解散
	const handleCancle = async (modal) => {
		modal.update((prevConfig) => ({
			...prevConfig,
			modalRender: () => (
				<CusWarmPrompt
					modal={cancleDissolve}
					type="WARNING"
					infos={<span>你的企业将恢复到正常状态，确认撤销吗？</span>}
					buttons={[
						<Button
							onClick={(e) => cancleDissolve.destroy()}
							className="cus-btn"
						>
							取消
						</Button>,
						<Button
							loading={true}
							onClick={(e) => handleCancle(cancleDissolve)}
							className="cus-btn"
							type="primary"
						>
							确定
						</Button>,
					]}
				/>
			),
		}));
		try {
			const res = await CANCLE_DISSOLVE_TENTANT_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			message.success("撤销解散成功！");
			getTenantDetailInfo();
			modal.destroy();
		} catch (error) {
			console.log(error);
		} finally {
			modal.update((prevConfig) => ({
				...prevConfig,
				modalRender: () => (
					<CusWarmPrompt
						modal={cancleDissolve}
						type="WARNING"
						infos={
							<span>你的企业将恢复到正常状态，确认撤销吗？</span>
						}
						buttons={[
							<Button
								onClick={(e) => cancleDissolve.destroy()}
								className="cus-btn"
							>
								取消
							</Button>,
							<Button
								loading={false}
								onClick={(e) => handleCancle(cancleDissolve)}
								className="cus-btn"
								type="primary"
							>
								确定
							</Button>,
						]}
					/>
				),
			}));
		}
	};

	return (
		<div className={styles.baseInfoPage}>
			<PageBreadcrumb
				pathArr={
					editing
						? [...breadcrumbsPath.baseinfo]
						: breadcrumbsPath.baseinfo.slice(0, 2)
				}
				title="企业信息"
			>
				<Space>
					<Button
						size="large"
						onClick={(e) => apply()}
						type="primary"
						style={{
							fontSize: 14,
							borderRadius: 4,
						}}
					>
						申请认证
					</Button>
					{isCreator ? (
						<>
							<Button
								size="large"
								onClick={(e) => transfer()}
								style={{
									fontSize: 14,
									borderRadius: 4,
								}}
								type="primary"
								// className="cus-btn-48"
							>
								转移创建人
							</Button>
							{dissolveStatus && dissolveStatus.status ? null : (
								<Button
									size="large"
									onClick={(e) => dismiss()}
									style={{
										fontSize: 14,
										borderRadius: 4,
									}}
									type="primary"
									danger
									// className="cus-btn-48"
								>
									解散企业
								</Button>
							)}
						</>
					) : null}
				</Space>
			</PageBreadcrumb>
			{dissolveStatus && dissolveStatus.status ? (
				<div className={styles.countDownTime}>
					<span>
						倒计时：{renderCountDownTime(dissolveStatus.remaining)}
					</span>
					<span
						onClick={(e) => cancleDissolve()}
						className={styles.cancleDissolveBtn}
					>
						撤销解散
					</span>
				</div>
			) : null}
			<div className={styles.content}>
				{loading ? (
					<Spin
						tip="数据加载中..."
						style={{
							width: "100%",
							height: "100%",
							marginTop: 200,
						}}
					></Spin>
				) : (
					<div className={styles.baseIfnoWrap}>
						<div className={styles.btns}>
							{editing ? (
								<Space>
									<Button
										size="large"
										onClick={(e) => cancleEdit()}
										style={{
											fontSize: 14,
										}}
									>
										取消
									</Button>
									<Button
										size="large"
										onClick={(e) => save()}
										style={{
											fontSize: 14,
										}}
										type="primary"
									>
										保存
									</Button>
								</Space>
							) : (
								<Button
									size="large"
									onClick={(e) => edit()}
									style={{
										fontSize: 14,
									}}
								>
									修改
								</Button>
							)}
						</div>
						<InfoTitle title="基本信息" />
						{editing ? (
							<Form
								key="1"
								form={form}
								// {...formItemLayout}
								labelCol={{ span: 4 }}
								wrapperCol={{
									xs: { span: 20 },
									sm: { span: 20 },
								}}
								colon={false}
								requiredMark={false}
								name="base_form_edit"
								// onFinish={props.onFinish}
								initialValues={{
									type: [],
								}}
								// layout="vertical"
								onValuesChange={onFormValuesChange}
							>
								<Row gutter={24}>
									{renderFormItem(formFields)}
								</Row>
							</Form>
						) : (
							<Form
								key="2"
								form={displayForm}
								// {...formItemLayout}
								labelCol={{ span: 4 }}
								wrapperCol={{
									xs: { span: 20 },
									sm: { span: 20 },
								}}
								colon={false}
								requiredMark={false}
								name="base_form_display"
								// onFinish={props.onFinish}
								initialValues={{
									type: [],
								}}
								// layout="vertical"
								// onValuesChange={onFormValuesChange}
							>
								<Row gutter={24}>
									{renderFormItem(displayFormFields)}
								</Row>
							</Form>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default connect(
	(state) => ({
		userInfo: state.userInfo,
	}),
	{
		// initMenuTree: initMenuTree,
		// initOrgTree: initOrgTree,
	}
)(BaseInfo);
