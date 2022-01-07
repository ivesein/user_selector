import React, { useState, useEffect, useRef, useCallback } from "react";
import { Form, message, Button, Space, Col, Modal, Row, Spin } from "antd";
// import AddRoleMember from "../AddRoleMember";
import CusFormItemLabel from "@/components/CusFormItemLabel";
import CusFormItemInput from "@/components/CusFormItemInput";
import CusFormItemSelect from "@/components/CusFormItemSelect";
import CusFormItemTextAear from "@/components/CusFormItemTextAear";
import CusFormItemSelectDisplay from "@/components/CusFormItemSelectDisplay";
import SelectOrgModal from "@/components/SelectOrgModal";
import SelectUserModal from "@/components/SelectUserModal";
import { getUserCache } from "@/utils/toolfunc";

import styles from "./index.module.scss";
import {
	GET_USER_DETAIL_API,
	EDIT_MEMBERS_API,
	// USER_ORG_LIST_API,
	// DELETE_ROLE_MEMBERS_API,
} from "@/api/permApi";
import closeIcon from "@/asset/img/del.png";

// 编辑成员
const EditMembers = (props) => {
	const [formFields, setFormFields] = useState([]);
	// const [ifSendMsg, setIfSendMsg] = useState(false); //是否发送短信
	const [recordId, setRecordId] = useState(null);
	const [submitLoading, setSubmitLoading] = useState(false); //提交loading
	const [pageLoading, setPageLoading] = useState(false); //提交loading
	const tenantUserIdRef = useRef(null);
	// const [submitContinueLoading, setSubmitContinueLoading] = useState(false); //提交并继续loading

	useEffect(() => {
		// if (props.orgInfo && props.userOptions) {
		// 	setFormFields([
		// 		...initFormFields(props.orgInfo.treeArr, props.userOptions),
		// 	]);
		// }
		setFormFields([
			...initFormFields(
				props.orgInfo.treeArr,
				props.userOptions,
				props.roleOptions,
				props.jobOptions
			),
		]);
	}, [props.orgInfo, props.userOptions, props.roleOptions, props.jobOptions]);
	useEffect(() => {
		if (props.record) {
			// 设置组织初始值
			setRecordId(props.record.id);
			tenantUserIdRef.current = props.record.userId;
		}
	}, [props.record]);
	useEffect(() => {
		if (recordId) {
			getDetailInfo(recordId);
		}
	}, [recordId]);
	// 获取详情
	const getDetailInfo = async (id) => {
		try {
			setPageLoading(true);
			let res = await GET_USER_DETAIL_API({ id });
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			const { name, depIds, leaderId, phone, job, roleIds, remark } =
				res.data;
			form.setFieldsValue({
				name: name || "",
				deptId: depIds || [],
				manageId: leaderId || "",
				phone: phone || "",
				jobId: job,
				roleId: roleIds || [],
				remark: remark,
			});
		} catch (error) {
			console.log(error);
		} finally {
			setPageLoading(false);
		}
	};

	const [form] = Form.useForm();
	// 处理提交
	const confirm = async (params) => {
		try {
			let formValues = await form.validateFields();
			const params = {
				tenantUserId: tenantUserIdRef.current,
				name: formValues.name,
				jobId: formValues?.jobId ?? "",
				roleId: formValues?.roleId?.join(","),
				deptId: formValues?.deptId?.join(","),
				manageId: formValues?.manageId ?? "",
				remark: formValues?.remark ?? "",
				phone: formValues.phone,
				tenantId: getUserCache("userInfo")?.tenantId,
			};

			setSubmitLoading(true);
			let res = await EDIT_MEMBERS_API(params);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			message.success("添加成功！");
			props.reload();
		} catch (error) {
			console.log(error);
		} finally {
			setSubmitLoading(false);
		}
	};

	const handleOnClick = (filed) => {
		// form.setFieldsValue({
		// 	...form.getFieldsValue,
		// 	depIds: ["1410478164506710016"],
		// 	leaderId: "1410478159346929664",
		// });
		if (filed === "deptId") {
			openOrgSelect();
		}
		if (filed === "manageId") {
			openUserSelect();
		}
	};
	// 打开组织对话框选择部门
	const openOrgSelect = () => {
		const orgSelectModal = Modal.confirm({
			modalRender: () => (
				<SelectOrgModal
					title="请选择部门"
					orgData={props?.orgInfo?.tree ?? []}
					modal={orgSelectModal}
					ok={(ids) => {
						form.setFieldsValue({
							...form.getFieldsValue,
							depIds: [...ids],
						});
						orgSelectModal.destroy();
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
	// 打开组织对话框选择直属上级
	const openUserSelect = () => {
		const userSelectModal = Modal.confirm({
			modalRender: () => (
				<SelectUserModal
					title="请选择直属上级"
					orgData={props?.orgInfo?.tree ?? []}
					modal={userSelectModal}
					ok={(ids) => {
						form.setFieldsValue({
							...form.getFieldsValue,
							manageId: ids && ids.length ? ids[0] : "",
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
	const initFormFields = (
		orgOptions,
		userOptions,
		roleOptions,
		jobOptions
	) => {
		return [
			{
				name: "name",
				required: true,
				label: "姓名",
				rules: [{ required: true, message: "请输入姓名" }],
				field: (
					<CusFormItemInput placeholder="请输入姓名" maxLength={20} />
				),
			},
			{
				name: "deptId",
				required: false,
				label: "组织",
				field: (
					<CusFormItemSelectDisplay
						suffixIconType="0" //suffixIconType 后缀图标  1.默认下拉箭头  2.笔  3.放大镜
						onClick={(e) => handleOnClick("deptId")}
						placeholder="请选择归属组织"
						options={orgOptions}
						mode="multiple"
					/>
				),
			},
			{
				name: "phone",
				required: true,
				label: "手机号",
				rules: [
					{ required: true, message: "请输入手机号" },
					{
						pattern:
							/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
						message: "请输入正确的手机号码",
					},
				],
				field: (
					<CusFormItemInput
						disabled
						placeholder="请输入手机号"
						maxLength={15}
					/>
				),
			},
			{
				name: "manageId",
				required: false,
				label: "直属上级",
				rules: [],
				field: (
					<CusFormItemSelectDisplay
						onClick={(e) => handleOnClick("manageId")}
						placeholder="请选择直属上级"
						options={userOptions}
					/>
				),
			},
			{
				name: "jobId",
				required: false,
				label: "岗位",
				rules: [],
				field: (
					<CusFormItemSelect
						placeholder="请选择岗位"
						options={jobOptions}
					/>
				),
			},
			{
				name: "roleId",
				required: false,
				label: "角色",
				rules: [],
				field: (
					<CusFormItemSelect
						mode="multiple"
						placeholder="请选择角色"
						options={roleOptions}
					/>
				),
			},
			{
				name: "remark",
				required: false,
				label: "备注",
				span: 24,
				rules: [],
				field: <CusFormItemTextAear />,
			},
		];
	};
	const close = (params) => {
		props.modal.destroy();
	};

	// 渲染表单元素
	const renderFormItem = (items) => {
		return (
			items &&
			items.map((item) => {
				return (
					<Col span={item.span || 12} key={item.name}>
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
	const onFormValuesChange = (params) => {};
	// 处理是否发送短信通知勾选
	// const onCheckboxChange = (value) => {
	// 	setIfSendMsg(value);
	// };
	return (
		<div className={styles.addOrgMembers}>
			<div className={styles.header}>
				<span>编辑成员</span>
				<img
					onClick={(e) => close()}
					className={styles.closeIcon}
					src={closeIcon}
					alt=""
				/>
			</div>
			<div className={styles.content}>
				{pageLoading ? (
					<Spin tip="数据加载中..."></Spin>
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
						name="add_org_members_form"
						// onFinish={props.onFinish}
						initialValues={null}
						layout="vertical"
						onValuesChange={onFormValuesChange}
					>
						<Row gutter={24}>{renderFormItem(formFields)}</Row>
					</Form>
				)}
			</div>
			<div className={styles.footer}>
				<div className={styles.left}>
					{/* <Checkbox
						style={{ fontSize: 14, color: "#666" }}
						checked={ifSendMsg}
						onChange={onCheckboxChange}
					>
						通过短信发送邀请
					</Checkbox> */}
				</div>
				<div className={styles.right}>
					<Space>
						<Button
							size="large"
							onClick={(e) => close()}
							className="cus-btn"
							// disabled={submitLoading || submitContinueLoading}
							disabled={submitLoading}
							style={{
								fontSize: 14,
							}}
						>
							取消
						</Button>
						<Button
							size="large"
							onClick={(e) => confirm()}
							loading={submitLoading}
							type="primary"
							className="cus-btn"
							style={{
								fontSize: 14,
							}}
							// className="cus-btn-48"
						>
							完成
						</Button>
						{/* <Button
							size="large"
							disabled={submitLoading}
							loading={submitContinueLoading}
							onClick={(e) => confirmAndContinue()}
							type="primary"
							style={{
								fontSize: 14,
							}}
							// className="cus-btn-48"
						>
							完成并继续添加
						</Button> */}
					</Space>
				</div>
			</div>
		</div>
	);
};

export default EditMembers;
