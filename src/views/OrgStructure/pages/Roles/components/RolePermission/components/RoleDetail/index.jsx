import React, { useState, useEffect, useRef } from "react";
import { Tabs, message, Spin } from "antd";
import FuncPermission from "../FuncPermission";
import DataPermission from "../DataPermission";
import styles from "./index.module.scss";
import {
	traverseTreeSetProps,
	treeFilterToArr,
	toTree,
	filterTreeReturnTree,
} from "@/utils/toolfunc";
import { ROLE_DETAIL_API } from "@/api/permApi";

const { TabPane } = Tabs;
const RoleDetail = (props) => {
	const [loading, setLoading] = useState(false);
	const [recordId, setRecordId] = useState(null);
	const [dataPermInfo, setDataPermInfo] = useState(null);
	// const [funcPermInfo, setFuncPermInfo] = useState([]);

	const [menuList, setMenuList] = useState([]);
	const [orgTree, setOrgTree] = useState([]);

	const funcPermRef = useRef(null);
	const dataPermRef = useRef(null);
	useEffect(() => {
		if (props.role) {
			setRecordId(props.role.id);
		}
	}, [props.role]);
	useEffect(() => {
		if (recordId) {
			getDetailInfo(recordId);
		}
	}, [recordId]);

	const onTabChange = (params) => {};
	const renderDataType = (type) => {
		return type === 0
			? "全部"
			: type === 1
			? "本级"
			: type === 2
			? "本级及子级"
			: type === 3
			? "自定义"
			: "无";
	};
	const getDetailInfo = async (id) => {
		try {
			setLoading(true);
			let res = await ROLE_DETAIL_API({ id });
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			const { jjskTenantRole, jjskTenantRoleMenus } = res.data;
			setDataPermInfo({
				type: jjskTenantRole.permissionType
					? jjskTenantRole.permissionType + ""
					: "",
				orgIds: jjskTenantRole.departmentId
					? jjskTenantRole.departmentId?.split(",")
					: [],
			});
			handleDataInfo(
				jjskTenantRole.departmentId
					? jjskTenantRole.departmentId?.split(",")
					: []
			);
			// setFuncPermInfo(jjskTenantRoleMenus.map((item) => item.menuId));
			const funcPermIds = jjskTenantRoleMenus.map((item) => item.menuId);
			// 处理功能菜单数据
			handleFuncInfo(funcPermIds);
		} catch (error) {
			console.log(error);
		} finally {
			// modal.destroy();
			setLoading(false);
		}
	};
	// // 处理功能菜单数据
	const handleFuncInfo = (funcPermIds) => {
		let tree = [];
		let sourceTree = [];
		if (props.menuTree && props.menuTree.length) {
			sourceTree = traverseTreeSetProps(props.menuTree, {
				title: "menuName",
				value: "id",
				key: "id",
			});
		}
		if (props.role && props.role.original) {
			tree = sourceTree;
		} else {
			if (funcPermIds.length) {
				tree = filterTreeReturnTree(sourceTree, funcPermIds, "menuPid");
			}
		}

		setMenuList(tree);
	};
	const handleDataInfo = (dataPermIds) => {
		let tree = [];
		let sourceTree = [];
		if (props.orgTree && props.orgTree.length) {
			sourceTree = traverseTreeSetProps(props.orgTree, {
				title: "name",
				value: "id",
				key: "id",
			});
		}
		if (props.role && props.role.original) {
			tree = sourceTree;
		} else {
			if (dataPermIds.length) {
				tree = filterTreeReturnTree(
					sourceTree,
					dataPermIds,
					"parentId"
				);
			}
		}
		setOrgTree(tree);
	};
	return (
		<div className={styles.roleDetailPage}>
			{loading ? (
				<Spin
					style={{ width: "100%", height: "100%", paddingTop: 200 }}
					tip="数据加载中..."
				/>
			) : (
				<>
					<div className={styles.baseInfoWarp}>
						<div className={styles.baseInfoItem}>
							<span className={styles.title}>角色名称：</span>
							<span className={styles.value}>
								{props?.role?.name ?? ""}
							</span>
						</div>
						<div className={styles.baseInfoItem}>
							<span className={styles.title}>角色描述：</span>
							<span className={styles.value}>
								{props?.role?.describe ?? ""}
							</span>
						</div>
						<div className={styles.baseInfoItem}>
							<span className={styles.title}>角色类型：</span>
							<span className={styles.value}>
								{props?.role?.original ? "系统预置" : "自定义"}
							</span>
						</div>
						<div className={styles.baseInfoItem}>
							<span className={styles.title}>数据权限：</span>
							<span className={styles.value}>
								{renderDataType(
									props?.role?.permissionType ?? ""
								)}
							</span>
						</div>
					</div>
					<div className={styles.permTitle}>
						<span className={styles.title}>角色权限</span>
					</div>
					<div className={styles.permWrap}>
						<Tabs
							style={{ width: "100%", height: "100%" }}
							tabBarStyle={{ margin: 0 }}
							defaultActiveKey="1"
							onChange={onTabChange}
						>
							<TabPane
								tab="功能权限"
								key="1"
								style={{ height: "100%", width: "100%" }}
							>
								<FuncPermission
									ref={funcPermRef}
									readOnly={true}
									menuList={menuList}
									// filterArr={funcPermInfo}
									// filterNode={true}
								/>
							</TabPane>
							<TabPane
								tab="数据权限"
								key="2"
								style={{ height: "100%", width: "100%" }}
							>
								<DataPermission
									readOnly={true}
									ref={dataPermRef}
									dataPermInfo={dataPermInfo}
									treeData={orgTree}
								/>
							</TabPane>
						</Tabs>
					</div>
				</>
			)}
		</div>
	);
};

export default RoleDetail;
