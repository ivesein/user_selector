import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import Header from "@/components/Header";
import SiderMenu from "@/components/SiderMenu";
import { Switch, Route, Redirect } from "react-router-dom";
import PrivateRouter from "@/components/PrivateRouter";
import IndexPage from "@/views/IndexPage";
import Notice from "@/views/Notice";
import Calendar from "@/views/EnterpriseCalendar";
import EnterpriseInfo from "@/views/EnterpriseInfo";

import { connect } from "react-redux";
import { initMenuTree } from "@/store/actions/menutree_action";
import { userUpdateAction } from "@/store/actions/user_action";
import { GET_LOGININFO_BY_TOKEN_API } from "@/api/loginApi";
import { useHistory } from "react-router-dom";
import { message } from "antd";

import FlowableModelDingEdit from "@/views/FlowableModelDingEdit";
import OrgStructure from "@/views/OrgStructure";
import Flowable from "@/views/Flowable";
import OperationLog from "@/views/OperationLog";

import { getQueryParams } from "@/utils/toolfunc";

import { routerIndex, routerOthers } from "@/router";
const Home = (props) => {
	const history = useHistory();
	const [path, setPath] = useState("/admin/index");
	// useEffect(() => {
	//   props.initMenuTree()
	// }, [])
	useEffect(() => {
		// props.initMenuTree();
		// debugger;
		let token = getQueryParams("tk");
		let tenantId = getQueryParams("tid");
		if (token) {
			handleGetToken(token, tenantId);
		} else if (props.userInfo) {
			history.replace({ pathname: "/admin/index" });
		}
	}, []);
	useEffect(() => {
		console.log(props.location.pathname);
		if (props?.location?.pathname === "/admin") {
			history.push({ pathname: "/admin/index" });
		}
		// else {
		// 	history.push({ pathname: "/tenant_list" });
		// }
		let pathArr = props?.location?.pathname?.split("/");
		console.log(pathArr.slice(0, 3));
		setPath(pathArr.slice(0, 4).join("/"));
	}, [props]);
	const handleGetToken = async (token, tenantId) => {
		try {
			let res = await GET_LOGININFO_BY_TOKEN_API({ token, tenantId });
			if (!res) {
				message.error("服务器繁忙，请稍后重试...");
			}

			if (res && res.data) {
				const result = {
					...res?.data?.data,
					userToken: res.data?.data?.token,
				};
				props.userUpdateAction(result);
				localStorage.setItem("userInfo", JSON.stringify(result));
				history.push({ pathname: "/admin/index" });
			}
		} catch (error) {
			console.log(error);
			message.error("获取用户数据失败，请重新登录");
			history.push({ pathname: "/login" });
		}
	};
	return (
		<div className={styles.homePage}>
			<div className={styles.headerWrap}>
				<Header />
			</div>
			<div className={styles.content}>
				<div className={styles.leftBox}>
					<SiderMenu path={path} router={routerIndex(path)} />
					<div className={styles.menuDivider}></div>
					<SiderMenu path={path} router={routerOthers(path)} />
				</div>
				<div className={styles.rightBox}>
					<Switch>
						{/* <Route
							exact
							path="/admin"
							render={() => <Redirect to="/admin/index" />}
						/> */}
						<PrivateRouter
							exact
							path="/admin/index"
							component={IndexPage}
						/>
						<PrivateRouter
							exact
							path="/admin/notice"
							component={Notice}
						/>
						<PrivateRouter
							path="/admin/org"
							component={OrgStructure}
						/>
						<PrivateRouter
							path="/admin/workflow"
							component={Flowable}
						/>
						<PrivateRouter
							exact
							path="/admin/dingflow/create"
							component={FlowableModelDingEdit}
						/>

						<PrivateRouter
							exact
							path="/admin/sys/calendar"
							component={Calendar}
						/>
						<PrivateRouter
							path="/admin/sys/enterprise_info"
							component={EnterpriseInfo}
						/>
						<PrivateRouter
							path="/admin/sys/operation_log"
							component={OperationLog}
						/>
						{/* <PrivateRouter
							exact
							path="/admin/notice"
							component={Notice}
						/> */}
						{/* <PrivateRouter path="/admin/org" component={Home} /> */}
					</Switch>
				</div>
			</div>
		</div>
	);
};
export default connect(
	(state) => ({
		userInfo: state.userInfo,
		// menuTree: state.menuTree,
		// currentApp: state.app,
		// appMenu: state.appMenu,
		// appPerm:state.appPerm
	}),
	{
		initMenuTree: initMenuTree,
		// appAction: appAction,
		// appmenuAction: appmenuAction,
		// permAction: permAction
		userUpdateAction: userUpdateAction,
	}
)(Home);
