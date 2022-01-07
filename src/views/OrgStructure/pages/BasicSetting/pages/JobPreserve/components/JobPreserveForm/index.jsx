import React, { useState, useEffect, useRef } from "react";
import { message, Button, Space, Form, Row, Col } from "antd";
import CusFormItemLabel from "@/components/CusFormItemLabel";
import CusFormItemInput from "@/components/CusFormItemInput";
import styles from "./index.module.scss";
import closeIcon from "@/asset/img/del.png";
import { SAVE_BASIC_INFO_API, UPDATE_BASIC_INFO_API } from "@/api/permApi";
import { TYPE_JOB } from "../../../config";

const JobPreserveForm = (props) => {
	const [loading, setLoading] = useState(false); //确定按钮提交loading
	const [form] = Form.useForm();
	const idRef = useRef(null);
	useEffect(() => {
		if (props.record) {
			form.setFieldsValue({
				name: props?.record?.name ?? "",
				describe: props?.record?.describe ?? "",
			});
			idRef.current = props.record?.id ?? null;
		}
	}, [props.record]);
	const initFormFields = [
		{
			name: "name",
			required: true,
			label: "岗位名称",
			rules: [{ required: true, message: "请输入岗位名称" }],
			field: (
				<CusFormItemInput
					placeholder="请输入岗位名称"
					maxLength={100}
				/>
			),
		},
		{
			name: "describe",
			required: false,
			label: "备注",
			field: <CusFormItemInput maxLength={200} />,
		},
	];
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
	const confirm = async () => {
		setLoading(true);
		try {
			const formValues = await form.validateFields();
			const params = {
				...formValues,
				type: TYPE_JOB,
			};
			let res = null; //
			if (props.record) {
				params.id = props.record.id;
				res = await UPDATE_BASIC_INFO_API(params);
			} else {
				res = await SAVE_BASIC_INFO_API(params);
			}
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success(props.record ? "编辑成功!" : "添加成功!");
			props.reload();
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const close = (params) => {
		props.modal.destroy();
	};

	return (
		<div className={styles.jobPreserveForm}>
			<div className={styles.title}>
				<span>{props.record ? "编辑" : "新增"}</span>
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
					name="add_form"
					// onFinish={props.onFinish}
					initialValues={null}
					layout="vertical"
				>
					<Row gutter={24}>{renderFormItem(initFormFields)}</Row>
				</Form>
			</div>
			<div className={styles.footer}>
				<Space>
					<Button
						// type="primary"
						disabled={loading}
						onClick={() => close()}
						size="large"
						className="cus-btn-48"
					>
						取消
					</Button>
					<Button
						type="primary"
						size="large"
						loading={loading}
						onClick={() => confirm()}
						className="cus-btn-48"
					>
						确定
					</Button>
				</Space>
			</div>
		</div>
	);
};

export default JobPreserveForm;
