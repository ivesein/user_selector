import React, { useEffect } from "react";
import styles from "./index.module.scss";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import MembersManagement from "./components/MembersManagement";
import OrgManagement from "./components/OrgManagement";
import { connect } from "react-redux";
// import { initMenuTree } from "@/store/actions/menutree_action";
// import { initOrgTree } from "@/store/actions/orgtree_action";
import { breadcrumbsPath } from "@/router/constant.js";

import { Tabs } from "antd";
import "../Roles/index.scss";
const { TabPane } = Tabs;
// 角色
const Members = (props) => {
	const callback = (params) => {};

	// useEffect(() => {
	// 	props.initMenuTree();
	// 	props.initOrgTree();
	// }, []);
	return (
		<div className={`${styles.Members} role-page-wrap`}>
			<PageBreadcrumb pathArr={breadcrumbsPath.member} title="成员管理" />
			<div className={styles.content}>
				<MembersManagement />
				{/* <Tabs
					style={{ width: "100%", height: "100%" }}
					tabBarStyle={{ paddingLeft: 25, margin: 0 }}
					defaultActiveKey="1"
					onChange={callback}
				>
					<TabPane tab="成员" key="1">
						<MembersManagement />
					</TabPane>
					<TabPane tab="组织" key="2">
						<OrgManagement />
					</TabPane>
				</Tabs> */}
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
)(Members);
