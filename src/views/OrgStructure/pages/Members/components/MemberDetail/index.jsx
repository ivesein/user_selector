import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Spin, message, Button, Space, Col, Modal, Row, Checkbox } from "antd";
import { GET_USER_DETAIL_API } from "@/api/permApi";
// 成员详情
const MemberDetail = (props) => {
	const [recordId, setRecordId] = useState(null);
	const [pageLoading, setPageLoading] = useState(false); //页面loading
	const [info, setInfo] = useState(null); //详情信息

	useEffect(() => {
		if (props.record) {
			// 设置组织初始值
			setRecordId(props.record.id);
		}
	}, [props.record]);
	useEffect(() => {
		if (recordId) {
			getDetailInfo(recordId);
		}
	}, [recordId]);
	// 获取详情
	const getDetailInfo = async (id) => {
		try {
			setPageLoading(true);
			let res = await GET_USER_DETAIL_API({ id });
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			setInfo(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setPageLoading(false);
		}
	};
	return (
		<div className={styles.memberDetail}>
			{pageLoading ? (
				<Spin tip="数据加载中..."></Spin>
			) : (
				<>
					<div className={styles.memberAvatar}>
						{info && info.avatar ? (
							<img src={info.avatar} alt="" />
						) : (
							<span>{info && info.name ? info.name[0] : ""}</span>
						)}
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>姓名</span>
						<span className={styles.value}>
							{info && info.name ? info.name : ""}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>直属上级</span>
						<span className={styles.value}>
							{info && info.leader ? info.leader : ""}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>手机号</span>
						<span className={styles.value}>
							{info && info.phone ? info.phone : ""}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>状态</span>
						<span
							className={styles.value}
							style={{
								color: info?.isActive ? "#245ff2" : "#2b2b2b",
							}}
						>
							{info && info?.isActive ? "已激活" : "未激活"}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>性别</span>
						<span className={styles.value}>
							{info && info.sex === "0"
								? "未知"
								: info && info.sex === "s"
								? "保密"
								: info && info.sex === "f"
								? "男"
								: info && info.sex === "m"
								? "女"
								: ""}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>归属组织</span>
						<span className={styles.value}>
							{info && info.orgIds
								? info.orgIds.map((item) => item.name).join(",")
								: ""}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>岗位</span>
						<span className={styles.value}>
							{info && info.jobName ? info.jobName : ""}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>关联角色</span>
						<span className={styles.value}>
							{info && info.roleList
								? info.roleList
										.map((item) => item.name)
										.join(",")
								: ""}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>备注</span>
						<span className={styles.value}>
							{info && info.remark ? info.remark : ""}
						</span>
					</div>
				</>
			)}
		</div>
	);
};

export default MemberDetail;
