import React, { useState, useEffect, useRef, useCallback } from "react";
import { message, Button, Space, Form, Modal, Row, Col } from "antd";
import UserSelect from "@/components/UserSelect";
import CusFormItemLabel from "@/components/CusFormItemLabel";
import CusFormItemSelectDisplay from "@/components/CusFormItemSelectDisplay";

import styles from "./index.module.scss";
import closeIcon from "@/asset/img/del.png";
import SelectUserModal from "@/components/SelectUserModal";

import {
	GET_ROLE_MEMBERS_API,
	ADD_TENANT_ADMINISTRATOR_API,
} from "@/api/enterpriseApi";

const AddAdminModal = (props) => {
	const [formFields, setFormFields] = useState([]);
	// const [loading, setLoading] = useState(false); //确定按钮提交loading
	const [form] = Form.useForm();
	const [submitLoading, setSubmitLoading] = useState(false); //提交loading

	useEffect(() => {
		if (props.userOptions) {
			setFormFields([...initFormFields(props.userOptions)]);
		}
	}, [props.userOptions]);

	const confirm = async () => {
		const id = form.getFieldValue("id");
		if (!id) {
			message.warning("请选择要添加的管理员");
			return;
		}
		setSubmitLoading(true);
		try {
			let res = await ADD_TENANT_ADMINISTRATOR_API(id);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("添加超级管理员成功!");
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
	const initFormFields = (userOptions) => {
		return [
			{
				name: "id",
				required: false,
				label: "超级管理员",
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
					title="请选择超级管理员"
					useOldApi={false}
					// orgData={props?.orgData ?? []}
					// userOptions={props?.userOptions ?? []}
					modal={userSelectModal}
					ok={(ids) => {
						form.setFieldsValue({
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
		<div className={styles.addAdminModal}>
			<div className={styles.header}>
				<span>添加超级管理员</span>
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
					name="add_org_members_form"
					// onFinish={props.onFinish}
					initialValues={null}
					layout="vertical"
				>
					<Row gutter={24}>{renderFormItem(formFields)}</Row>
				</Form>
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
					</Space>
				</div>
			</div>
		</div>
	);
};

export default AddAdminModal;
