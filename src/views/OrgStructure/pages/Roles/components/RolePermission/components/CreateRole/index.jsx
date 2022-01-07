import React, { useState, useEffect, useRef } from "react";
import { Space, Button, Form, Row, Col, Tabs, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import CusFormItemLabel from "@/components/CusFormItemLabel";
import CusFormItemInput from "@/components/CusFormItemInput";
import CusFormItemTextAear from "@/components/CusFormItemTextAear";
import FuncPermission from "../FuncPermission";
import DataPermission from "../DataPermission";

import {
	traverseTreeSetProps,
	// checkBtnPerm,
	// filterTree,
	treeFilterToArr,
} from "@/utils/toolfunc";
import { CREATE_ROLE_API } from "@/api/permApi";
import styles from "./index.module.scss";
const { TabPane } = Tabs;

// 新建自定义角色
const CreateRole = (props) => {
	const [form] = Form.useForm();
	const [confirmLoading, setConfirmLoading] = useState(false);

	const [menuList, setMenuList] = useState([]);
	const [orgTree, setOrgTree] = useState([]);

	const [leafNodes, setLeafNodes] = useState();
	const [pNodes, setPNodes] = useState();
	const funcPermRef = useRef(null);
	const dataPermRef = useRef(null);

	useEffect(() => {
		if (props.menuTree && props.menuTree.length > 0) {
			let tree = traverseTreeSetProps(props.menuTree, {
				title: "menuName",
				value: "id",
				key: "id",
			});
			console.log(tree);
			let leafNodes = treeFilterToArr(
				tree,
				(node) =>
					node.children.length === 0 ||
					node.children.filter((node) => node.type === "1").length ===
						node.children.length
				// &&node.type !== "1"
			);
			let pNodes = treeFilterToArr(
				tree,
				(node) => node.children && node.children.length > 0
			);
			console.log(leafNodes);
			console.log(pNodes);

			setLeafNodes(leafNodes || []);
			setPNodes(pNodes || []);
			setMenuList([...(tree || [])]);
		}
	}, [props.menuTree]);
	useEffect(() => {
		if (props.orgTree && props.orgTree.length > 0) {
			let tree = traverseTreeSetProps(props.orgTree, {
				title: "name",
				value: "id",
				key: "id",
			});
			setOrgTree(tree);
		}
	}, [props.orgTree]);
	const formFields = [
		{
			name: "name",
			required: true,
			label: "角色名称",
			rules: [{ required: true, message: "请输入角色名称" }],
			field: (
				<CusFormItemInput placeholder="请输入角色名称" maxLength={20} />
			),
		},
		{
			name: "describe",
			required: false,
			label: "角色描述",
			rules: [],
			field: <CusFormItemTextAear maxLength={200} />,
		},
	];
	const close = () => {
		if (confirmLoading) return;
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
	const onTabChange = (params) => {};

	const confirm = async () => {
		try {
			setConfirmLoading(true);
			const formValuse = await form.validateFields();
			// 获取功能权限数据
			const funcPerm = funcPermRef?.current?.getFuncPerm() ?? null;
			// 获取数据权限数据
			const dataPerm =
				dataPermRef.current && dataPermRef.current.getDataPerm
					? dataPermRef.current.getDataPerm()
					: null;
			console.log(funcPerm, dataPerm);
			const params = {
				jjskTenantRole: {
					...formValuse,
					tenantId: props?.userInfo?.tenantId ?? "",
					permissionType: dataPerm?.type ?? 0,
					departmentId: dataPerm?.checkedKeys?.join(",") ?? "",
				},
				jjskTenantRoleMenus: funcPerm.ifChanged
					? [
							...funcPerm?.checkedIds?.map((item) => ({
								menuId: item,
								tenantId: props?.userInfo?.tenantId ?? "",
							})),
							...funcPerm?.halfKeys?.map((item) => ({
								isLeaf: false,
								menuId: item,
								tenantId: props?.userInfo?.tenantId ?? "",
							})),
					  ]
					: [],
			};
			console.log(params);
			const res = await CREATE_ROLE_API(params);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			message.success("添加角色成功！");
			props.reload();
		} catch (error) {
			console.log(error);
		} finally {
			setConfirmLoading(false);
		}
	};

	return (
		<div className={styles.createRolePage}>
			<div className={styles.titleWrap}>
				<span>新增自定义角色</span>
				<CloseOutlined onClick={close} />
			</div>
			<div className={styles.content}>
				<div className={styles.formWrap}>
					<Form
						form={form}
						// {...formItemLayout}
						wrapperCol={{
							xs: { span: 24 },
							sm: { span: 24 },
						}}
						colon={false}
						requiredMark={false}
						name="role_form"
						initialValues={{}}
						onValuesChange={() => {}}
					>
						<Row gutter={24}>{renderFormItem(formFields)}</Row>
					</Form>
				</div>

				<div className={styles.permWrap}>
					{/* <CusFormItemLabel label="角色权限" required={false} /> */}
					<Tabs
						style={{ width: "100%", height: "100%" }}
						tabBarStyle={{ margin: 0 }}
						defaultActiveKey="1"
						onChange={onTabChange}
					>
						<TabPane
							tab="功能权限"
							key="1"
							style={{ width: "100%", height: "100%" }}
						>
							<FuncPermission
								ref={funcPermRef}
								menuList={menuList}
							/>
						</TabPane>
						<TabPane
							tab="数据权限"
							key="2"
							style={{ width: "100%", height: "100%" }}
						>
							<DataPermission
								ref={dataPermRef}
								treeData={orgTree}
							/>
						</TabPane>
						{/* <TabPane tab="成员" key="3">
              <div>成员</div>
            </TabPane> */}
					</Tabs>
				</div>
			</div>
			<div className={styles.footer}>
				<Space>
					<Button
						disable={confirmLoading}
						onClick={close}
						className="cus-btn-48"
					>
						取消
					</Button>
					<Button
						loading={confirmLoading}
						className="cus-btn-48"
						type="primary"
						onClick={() => confirm()}
					>
						确定
					</Button>
				</Space>
			</div>
		</div>
	);
};

export default CreateRole;
