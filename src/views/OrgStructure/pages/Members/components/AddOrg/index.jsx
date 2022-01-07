import React, { useState, useEffect, useRef, useCallback } from "react";
import { Form, message, Button, Space, Col, Modal, Row, Checkbox } from "antd";
// import AddRoleMember from "../AddRoleMember";
import CusFormItemLabel from "@/components/CusFormItemLabel";
import CusFormItemInput from "@/components/CusFormItemInput";
import CusFormItemTextAear from "@/components/CusFormItemTextAear";
import CusFormItemSelectDisplay from "@/components/CusFormItemSelectDisplay";
import CusFormItemSelectIcon from "@/components/CusFormItemSelectIcon";
import SelectOrgModal from "@/components/SelectOrgModal";
import SelectUserModal from "@/components/SelectUserModal";
import { getUserCache } from "@/utils/toolfunc";

import styles from "./index.module.scss";
import {
	ADD_ORG_API,
	GET_ORG_DETAIL_API,
	EDIT_ORG_API,
	// USER_ORG_LIST_API,
	// DELETE_ROLE_MEMBERS_API,
} from "@/api/permApi";
import closeIcon from "@/asset/img/del.png";

// 添加组织成员
const AddOrg = (props) => {
	const [recordId, setRecordId] = useState(null);
	const [formFields, setFormFields] = useState([]);
	const [submitLoading, setSubmitLoading] = useState(false); //提交loading
	const cIconRef = useRef(null);
	useEffect(() => {
		if (
			props.orgInfo &&
			props.userOptions &&
			props.userOptions.length &&
			props.iconList &&
			props.iconList.length
		) {
			setFormFields([
				...initFormFields(
					props.orgInfo.treeArr,
					props.userOptions,
					props.iconList
				),
			]);
			cIconRef.current = props.iconList[0];
		}
	}, [props.orgInfo, props.userOptions, props.iconList]);
	useEffect(() => {
		if (props.parentOrgId) {
			// 设置组织初始值
			form.setFieldsValue({
				...form.getFieldsValue,
				parentId: [props.parentOrgId],
			});
		}
	}, [props.parentOrgId]);
	useEffect(() => {
		if (props.editing && props.nodeId) {
			// 设置组织初始值
			setRecordId(props.nodeId);
		}
	}, [props.editing]);
	useEffect(() => {
		if (recordId) {
			getNodeDetailInfo(recordId);
		}
	}, [recordId]);
	const [form] = Form.useForm();
	// 获取详情
	const getNodeDetailInfo = async (id) => {
		try {
			// setPageLoading(true);
			let res = await GET_ORG_DETAIL_API({ id });
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}

			console.log(res);
			const { name, parentId, icon, leaderId, remark } = res.data.detail;
			// const { uid } = res.data.leader;
			form.setFieldsValue({
				name: name || "",
				parentId: parentId ? [parentId] : [],
				leaderId: leaderId || "",
				icon: icon || "",
				remark: remark || "",
			});
		} catch (error) {
			console.log(error);
		} finally {
			// setPageLoading(false);
		}
	};

	// 处理提交
	const confirm = async (params) => {
		try {
			let formValues = await form.validateFields();
			const params = {
				name: formValues.name,
				parentId:
					formValues.parentId && formValues.parentId.length
						? formValues.parentId[0]
						: "",
				leaderId: formValues.leaderId,
				remark: formValues.remark,
				icon: cIconRef.current.iconBase,
				tenantId: getUserCache("userInfo")?.tenantId,
			};
			setSubmitLoading(true);
			let res = null;
			if (props.editing) {
				// 执行编辑提交操作
				params.id = recordId;
				res = await EDIT_ORG_API(params);
			} else {
				res = await ADD_ORG_API(params);
			}
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			message.success(props.editing ? "编辑组织成功" : "新增组织成功！");
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
		// 	deptId: ["1410478164506710016"],
		// 	manageId: "1410478159346929664",
		// });
		if (filed === "parentId") {
			openOrgSelect();
		}
		if (filed === "leaderId") {
			openUserSelect();
		}
	};
	// 打开组织对话框选择部门
	const openOrgSelect = () => {
		const orgSelectModal = Modal.confirm({
			modalRender: () => (
				<SelectOrgModal
					title="请选择上级组织"
					orgData={props?.orgInfo?.tree ?? []}
					modal={orgSelectModal}
					single={true}
					ok={(ids) => {
						form.setFieldsValue({
							...form.getFieldsValue,
							parentId: ids,
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
					title="请选择部门主管"
					orgData={props?.orgInfo?.tree ?? []}
					modal={userSelectModal}
					ok={(ids) => {
						form.setFieldsValue({
							...form.getFieldsValue,
							leaderId: ids && ids.length ? ids[0] : "",
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
	const initFormFields = (orgOptions, userOptions, iconList) => {
		return [
			{
				name: "name",
				required: true,
				label: "组织名称",
				rules: [{ required: true, message: "请输入组织名称" }],
				field: <CusFormItemInput maxLength={20} />,
			},
			{
				name: "parentId",
				required: true,
				label: "上级组织",
				rules: [{ required: true, message: "请选择上级组织" }],
				field: (
					<CusFormItemSelectDisplay
						suffixIconType="0" //suffixIconType 后缀图标  1.默认下拉箭头  2.笔  3.放大镜
						onClick={(e) => handleOnClick("parentId")}
						placeholder="请选择上级组织"
						options={orgOptions}
						// mode="multiple"
					/>
				),
			},
			{
				name: "leaderId",
				required: false,
				label: "主管",
				rules: [],
				field: (
					<CusFormItemSelectDisplay
						onClick={(e) => handleOnClick("leaderId")}
						placeholder="请选择部门主管"
						options={userOptions}
					/>
				),
			},
			{
				name: "icon",
				required: true,
				label: "组织图标",
				rules: [{ required: true, message: "请选择组织图标" }],
				field: (
					<CusFormItemSelectIcon
						onChange={(icon) => handleIconOnChange(icon)}
						icons={iconList}
					/>
				),
			},
			{
				name: "remark",
				required: false,
				label: "备注",
				rules: [],
				field: <CusFormItemTextAear maxLength={200} />,
			},
		];
	};
	const handleIconOnChange = (icon) => {
		cIconRef.current = icon;
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
	const onFormValuesChange = (params) => {};

	return (
		<div className={styles.addOrg}>
			<div className={styles.header}>
				<span>{props.editing ? "编辑组织" : "新增组织"}</span>
				<img
					onClick={(e) => close()}
					className={styles.closeIcon}
					src={closeIcon}
					alt=""
				/>
			</div>
			<div className={styles.content}>
				<Form
					form={form}
					// {...formItemLayout}
					wrapperCol={{
						xs: { span: 24 },
						sm: { span: 24 },
					}}
					colon={false}
					requiredMark={false}
					name="add_org_form"
					// onFinish={props.onFinish}
					initialValues={null}
					layout="vertical"
					onValuesChange={onFormValuesChange}
				>
					<Row gutter={24}>{renderFormItem(formFields)}</Row>
				</Form>
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
							style={{
								fontSize: 14,
							}}
							type="primary"
							// className="cus-btn-48"
						>
							完成
						</Button>
					</Space>
				</div>
			</div>
		</div>
	);
};

export default AddOrg;
