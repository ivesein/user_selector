import React, { useState } from "react";
import styles from "./index.module.scss";
import orgIcon from "@/asset/img/org.png";
import goIcon from "@/asset/img/go.png";
import { useHistory } from "react-router-dom";
// import { Animated } from "react-animated-css";
import "animate.css";
import { connect } from "react-redux";
import { userUpdateAction } from "@/store/actions/user_action";
const UnitList = (props) => {
	const history = useHistory();

	const goBack = () => {
		props.setLoggedState(false);
	};
	const enterUnit = (item) => {
		props.userUpdateAction({
			...props.userInfo,
			tenantId: item.id,
			tenantName: item.name,
		});
		history.push({ pathname: "/admin" });
	};

	const renderUnitItem = (list) => {
		return (
			list &&
			list.map((item) => {
				return (
					<div
						onClick={(e) => enterUnit(item)}
						key={item.id}
						className={styles.unitItem}
					>
						<img src={orgIcon} alt="" />
						<div className={styles.unitName}>{item.name}</div>
						<img src={goIcon} alt="" />
					</div>
				);
			})
		);
	};

	return (
		<div
			className={`${styles.unitListWrap} animate__animated animate__fadeInRight`}
		>
			<div onClick={goBack} className={styles.goBack}>
				＜ 返回
			</div>
			<div className={styles.titleWrap}>
				<div className={styles.title}>选择你管理的组织</div>
				<div className={styles.subTitle}>你在以下组织中担任管理员</div>
			</div>
			<div className={styles.unitItemWrap}>
				{renderUnitItem(props.unitList || [])}
			</div>
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
)(UnitList);
