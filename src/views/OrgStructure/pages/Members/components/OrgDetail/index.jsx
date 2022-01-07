import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Spin, message, Button, Space, Col, Modal, Row, Checkbox } from "antd";
import { GET_ORG_DETAIL_API } from "@/api/permApi";
// 成员详情
const OrgDetail = (props) => {
	const [recordId, setRecordId] = useState(null);
	const [pageLoading, setPageLoading] = useState(false); //页面loading
	const [info, setInfo] = useState(null); //详情信息

	useEffect(() => {
		if (props.node) {
			// 设置组织初始值
			setRecordId(props.node.id);
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
			let res = await GET_ORG_DETAIL_API({ id });
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
					<div className={styles.infoItem}>
						<span className={styles.label}>部门主管</span>
						<span className={styles.value}>
							{info && info.leader ? info.leader.name : ""}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>组织名称</span>
						<span className={styles.value}>
							{info?.detail?.name ?? ""}
						</span>
					</div>

					<div className={styles.infoItem}>
						<span className={styles.label}>上级组织</span>
						<span className={styles.value}>
							{info?.parentName ?? ""}
						</span>
					</div>

					<div className={styles.infoItem}>
						<span className={styles.label}>组织成员</span>
						<span className={styles.value}>
							{(info && info.count ? info.count : "0") + " 人"}
						</span>
						{/* <div className={styles.memberListWrap}>
							<div
								className={`${styles.header} ${styles.listItem}`}
							>
								<span>姓名</span>
								<span>职位</span>
							</div>
							{info?.members &&
								info?.members?.map((item) => (
									<div
										key={item.id}
										className={styles.listItem}
									>
										<span>{item.name}</span>
										<span>职位</span>
									</div>
								))}
						</div> */}
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>备注</span>
						<span className={styles.value}>
							{info?.detail?.remark ?? ""}
						</span>
					</div>
				</>
			)}
		</div>
	);
};

export default OrgDetail;
