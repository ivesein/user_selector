import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import RolePermission from "./components/RolePermission";
import RoleMembers from "./components/RoleMembers";
import { connect } from "react-redux";
import { initMenuTree } from "@/store/actions/menutree_action";
import { initOrgTree } from "@/store/actions/orgtree_action";

import { Tabs } from "antd";
import "./index.scss";
import { breadcrumbsPath } from "@/router/constant.js";

const { TabPane } = Tabs;
// 角色
const Roles = (props) => {
	const [tab, setTab] = useState("1");
	const callback = (key) => {
		setTab(key);
	};

	useEffect(() => {
		props.initMenuTree();
		props.initOrgTree();
	}, []);
	return (
		<div className={`${styles.Roles} roles-page-wrap`}>
			<PageBreadcrumb pathArr={breadcrumbsPath.role} title="角色管理" />
			<div className={styles.content}>
				<Tabs
					style={{ width: "100%", height: "100%" }}
					tabBarStyle={{ paddingLeft: 25, margin: 0 }}
					defaultActiveKey="1"
					onChange={callback}
				>
					<TabPane tab="角色权限配置" key="1">
						{tab === "1" ? <RolePermission /> : null}
					</TabPane>
					<TabPane tab="角色成员管理" key="2">
						{tab === "2" ? <RoleMembers /> : null}
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
};

export default connect(
	(state) => ({
		userInfo: state.userInfo,
	}),
	{
		initMenuTree: initMenuTree,
		initOrgTree: initOrgTree,
	}
)(Roles);
