import React from "react";
import styles from "./index.module.scss";
import { Switch, Route, Redirect } from "react-router-dom";
import PrivateRouter from "@/components/PrivateRouter";
import Roles from "./pages/Roles";
import Members from "./pages/Members";
import BasicSetting from "./pages/BasicSetting";
import InviteMembers from "./pages/Members/components/InviteMembers";
import ApplicantList from "./pages/Members/components/ApplicantList";

// 组织架构
const OrgStructure = () => {
	return (
		<Switch>
			<Route
				exact
				path="/admin/org"
				render={() => <Redirect to="/admin/org/roles" />}
			/>
			<PrivateRouter exact path="/admin/org/roles" component={Roles} />
			<PrivateRouter
				exact
				path="/admin/org/members"
				component={Members}
			/>
			<PrivateRouter
				exact
				path="/admin/org/basic_setting"
				component={BasicSetting}
			/>

			<PrivateRouter
				exact
				path="/admin/org/members/invite"
				component={InviteMembers}
			/>

			<PrivateRouter
				exact
				path="/admin/org/members/invite/list"
				component={ApplicantList}
			/>
		</Switch>
	);
};

export default OrgStructure;
