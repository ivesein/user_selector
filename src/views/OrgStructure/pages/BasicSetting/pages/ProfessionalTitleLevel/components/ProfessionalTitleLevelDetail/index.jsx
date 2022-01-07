import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Spin, message, Button, Space, Col, Modal, Row, Checkbox } from "antd";
import { GET_USER_DETAIL_API } from "@/api/permApi";
// 职称等级详情
const ProfessionalTitleLevelDetail = (props) => {
	const [recordId, setRecordId] = useState(null);
	const [pageLoading, setPageLoading] = useState(false); //页面loading
	// const [info, setInfo] = useState(null); //详情信息

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

export default ProfessionalTitleLevelDetail;
