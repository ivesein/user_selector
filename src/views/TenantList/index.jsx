import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { useHistory } from "react-router-dom";
import UnitList from "./UnitList";
import { message } from "antd";
import { connect } from "react-redux";
import { userUpdateAction } from "@/store/actions/user_action";
import {
	LOGIN_BY_PWD_API,
	GET_TENANT_LIST_API,
	SEND_VERIFY_CODE_API,
	UPDATE_PASSWORD_API,
} from "@/api/loginApi";
const TenantList = (props) => {
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const [unitList, setUnitList] = useState([]);
	useEffect(() => {
		if (props.userInfo && props.userInfo.id) {
			getTenantList(props.userInfo.id);
		} else {
			history.push({ pathname: "/login" });
		}
	}, [props.userInfo]);
	const getTenantList = async (userId) => {
		try {
			setLoading(true);
			let listRes = await GET_TENANT_LIST_API({ userId: userId });
			if (!listRes) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			let projectData = [];
			listRes?.data?.forEach((v) => {
				projectData.push({
					id: v.id,
					name: v.tenantName,
					nature: v.nature,
					disable: v.disable,
				});
			});
			setUnitList([...projectData]);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className={styles.loginPage}>
			<UnitList unitList={unitList} loading={loading} />
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
)(TenantList);
