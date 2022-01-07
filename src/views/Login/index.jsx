import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { useHistory } from "react-router-dom";
import UnitList from "./UnitList";
import LoginForm from "./LoginForm";
import { getQueryParams } from "@/utils/toolfunc";
import { GET_LOGININFO_BY_TOKEN_API } from "@/api/loginApi";
import { message } from "antd";
import { connect } from "react-redux";
import { userUpdateAction } from "@/store/actions/user_action";
const Login = (props) => {
	const history = useHistory();
	const [ifSuccess, setIfSuccess] = useState(false);
	const [unitList, setUnitList] = useState([]);
	useEffect(() => {
		localStorage.clear();
		console.log(history);
		props.userUpdateAction(null);
		// let len = history.length;
		// while (len > 0) {
		// 	history.pop();
		// 	len = len - 1;
		// }
	}, []);
	const setLoggedState = (state) => {
		setIfSuccess(state);
	};
	// const handleGetToken = async (token, tenantId) => {
	// 	try {
	// 		let res = await GET_LOGININFO_BY_TOKEN_API({ token, tenantId });
	// 		if (!res) {
	// 			message.error("服务器繁忙，请稍后重试...");
	// 		}
	// 		if (res && res.data) {
	// 			const result = { ...res.data, userToken: res.data?.token };
	// 			props.userUpdateAction(result);
	// 			localStorage.setItem("userInfo", JSON.stringify(result));
	// 			history.push({ pathname: "/admin" });
	// 		}
	// 	} catch (error) {}
	// };

	return (
		<div className={styles.loginPage}>
			<LoginForm
			// setUnitList={setUnitList}
			// setLoggedState={setLoggedState}
			/>
			{/* {ifSuccess ? (
				<UnitList unitList={unitList} setLoggedState={setLoggedState} />
			) : (
				<LoginForm
					setUnitList={setUnitList}
					setLoggedState={setLoggedState}
				/>
			)} */}
		</div>
	);
};
export default connect(
	(state) => ({
		userInfo: state.userInfo,
	}),
	{
		userUpdateAction: userUpdateAction,
	}
)(Login);
