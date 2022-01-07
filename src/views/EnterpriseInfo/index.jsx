import React from "react";
import styles from "./index.module.scss";
import { Switch, Route, Redirect } from "react-router-dom";
import PrivateRouter from "@/components/PrivateRouter";
import ApplyCertification from "./pages/ApplyCertification";
import TransferAdministrator from "./pages/TransferAdministrator";

import BaseInfo from "./pages/BaseInfo";
// import InviteMembers from './pages/Members/components/InviteMembers'

// 组织架构
const EnterpriseInfo = () => {
	return (
		<Switch>
			<Route
				exact
				path="/admin/sys/enterprise_info"
				render={() => (
					<Redirect to="/admin/sys/enterprise_info/base_info" />
				)}
			/>
			<PrivateRouter
				exact
				path="/admin/sys/enterprise_info/base_info"
				component={BaseInfo}
			/>
			<PrivateRouter
				exact
				path="/admin/sys/enterprise_info/apply_certification"
				component={ApplyCertification}
			/>
			<PrivateRouter
				exact
				path="/admin/sys/enterprise_info/transfer_administrator"
				component={TransferAdministrator}
			/>

			{/* <PrivateRouter
        exact
        path="/admin/org/members/invite"
        component={InviteMembers}
      /> */}
		</Switch>
	);
};

export default EnterpriseInfo;
