import React, { useEffect } from "react";
import styles from "./index.module.scss";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import JobPreserve from "./pages/JobPreserve";
import RankProfessional from "./pages/RankProfessional";
import ProfessionalTitleLevel from "./pages/ProfessionalTitleLevel";

// import RoleMembers from "./components/RoleMembers";
import { connect } from "react-redux";

import { Tabs } from "antd";
import "./index.scss";
import { breadcrumbsPath } from "@/router/constant.js";

const { TabPane } = Tabs;
// 角色
const BasicSetting = (props) => {
	const callback = (params) => {};

	useEffect(() => {}, []);
	return (
		<div className={`${styles.basicSetting} basicsetting-page-wrap`}>
			<PageBreadcrumb
				pathArr={breadcrumbsPath.basicsetting}
				title="基础设置"
			/>
			<div className={styles.content}>
				<Tabs
					style={{ width: "100%", height: "100%" }}
					tabBarStyle={{ paddingLeft: 25, margin: 0 }}
					defaultActiveKey="1"
					onChange={callback}
				>
					<TabPane tab="岗位维护" key="1">
						<JobPreserve />
					</TabPane>
					<TabPane tab="职级专业" key="2">
						<RankProfessional />
					</TabPane>
					<TabPane tab="职称等级" key="3">
						<ProfessionalTitleLevel />
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
};

export default connect((state) => ({
	userInfo: state.userInfo,
}))(BasicSetting);
