import React, { useState, useEffect, useRef, useCallback } from "react";
import { message, Button, Space, Checkbox, Modal } from "antd";
import UserSelect from "@/components/UserSelect";
import styles from "./index.module.scss";
import closeIcon from "@/asset/img/del.png";
import { USER_ORG_LIST_API, USER_ORG_LIST_OLD_API } from "@/api/permApi";
const SelectUserModal = (props) => {
	const [hasSelectedList, setHasSelectedList] = useState([]);
	const [loading, setLoading] = useState(false); //确定按钮提交loading
	const [orgData, setOrgData] = useState([]); //确定按钮提交loading

	useEffect(() => {
		getOrgData();
	}, []);
	const selectRef = useRef(null);
	// 获取组织架构数据
	const getOrgData = async () => {
		try {
			// setLoading(true);
			let res = null;
			if (!props.useOldApi) {
				res = await USER_ORG_LIST_API();
			} else {
				res = await USER_ORG_LIST_OLD_API();
			}
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			setOrgData(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const confirm = () => {
		setLoading(true);
		let data = selectRef?.current?.getSelectList();
		props.ok(data?.hasSelectList?.map((item) => item.id));
	};
	const close = (params) => {
		props.modal.destroy();
	};

	return (
		<div className={styles.selectUserModal}>
			<div className={styles.title}>
				<span>{props.title || "选择人员"}</span>
				<img
					onClick={(e) => close()}
					className={styles.closeIcon}
					src={closeIcon}
					alt=""
				/>
			</div>
			<div className={styles.content}>
				<UserSelect
					single={true}
					orgData={orgData}
					hasSelectList={hasSelectedList}
					selectRef={selectRef}
				/>
			</div>
			<div className={styles.footer}>
				<Space>
					<Button
						onClick={() => close()}
						size="large"
						className="cus-btn-48"
					>
						取消
					</Button>
					<Button
						type="primary"
						size="large"
						onClick={() => confirm()}
						className="cus-btn-48"
					>
						确定
					</Button>
				</Space>
			</div>
		</div>
	);
};

export default SelectUserModal;
