import React, { useState } from "react";
import styles from "./index.module.scss";
import logo from "@/asset/img/logo_w.png";
import user from "@/asset/img/user.png";
import { connect } from "react-redux";
import { Tooltip, Avatar, Image } from "antd";
import { QuestionCircleFilled } from "@ant-design/icons";
import { logout } from "@/utils/toolfunc";
const Header = (props) => {
	const quit = (params) => {
		logout();
	};

	return (
		<div className={styles.headerContainer}>
			<div className={styles.logoWrap}>
				<img src={logo} alt="企业管理后台" />
				<span className={styles.enterpriseName}>
					{props?.userInfo?.tenantName ?? "企业"}管理后台
				</span>
			</div>
			<div className={styles.controlWrap}>
				<Tooltip
					placement="bottom"
					title="企业后台管理系统"
					arrowPointAtCenter
				>
					<QuestionCircleFilled className={styles.tipIcon} />
				</Tooltip>
				<div className={styles.userAvatar}>
					{/* <Avatar
						src={
							<Image
								src={props?.userInfo?.Avatar ?? user}
								style={{ width: 20 }}
							/>
						}
					/> */}
					{props?.userInfo?.avatar ? (
						<Avatar
							src={
								<Image
									src={props.userInfo.avatar}
									preview={false}
									style={{ width: 32 }}
								/>
							}
						/>
					) : (
						<img
							className={styles.defaultAvatar}
							src={user}
							alt=""
						/>
					)}
				</div>
				<span className={styles.logout} onClick={quit}>
					退出
				</span>
			</div>
		</div>
	);
};

export default connect((state) => ({
	userInfo: state.userInfo,
}))(Header);
