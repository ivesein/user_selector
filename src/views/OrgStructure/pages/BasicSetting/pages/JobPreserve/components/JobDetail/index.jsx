import React from "react";
import styles from "./index.module.scss";
// import { Spin, message, Button, Space, Col, Modal, Row, Checkbox } from "antd";
// import { GET_USER_DETAIL_API } from "@/api/permApi";
// 岗位详情
const JobDetail = (props) => {
	return (
		<div className={styles.basicDetail}>
			<div className={styles.infoItem}>
				<span className={styles.label}>岗位名称</span>
				<span className={styles.value}>
					{props?.record?.name ?? ""}
				</span>
			</div>
			<div className={styles.infoItem}>
				<span className={styles.label}>备注</span>
				<span className={styles.value}>
					{props?.record?.describe ?? ""}
				</span>
			</div>
		</div>
	);
};

export default JobDetail;
