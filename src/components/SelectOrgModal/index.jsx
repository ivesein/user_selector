import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Space } from "antd";
import OrgSelect from "@/components/OrgSelect";
import styles from "./index.module.scss";
import closeIcon from "@/asset/img/del.png";
import { GET_ROLE_MEMBERS_API, ROLE_ADD_MEMBERS_API } from "@/api/permApi";
import "./index.scss";
const SelectOrgModal = (props) => {
	const [loading, setLoading] = useState(false); //确定按钮提交loading

	const orgSelectRef = useRef(null);
	const confirm = () => {
		setLoading(true);
		let keys = orgSelectRef?.current?.getCheckedKeys();
		props.ok(keys);
	};
	const close = (params) => {
		props.modal.destroy();
	};

	return (
		<div className={`${styles.orgSelectModal} org-select-modal`}>
			<div className={styles.title}>
				<span>{props.title || "组织架构"}</span>
				<img
					onClick={(e) => close()}
					className={styles.closeIcon}
					src={closeIcon}
					alt=""
				/>
			</div>
			<div className={styles.content}>
				<OrgSelect
					ref={orgSelectRef}
					single={props.single}
					treeData={props.orgData}
				/>
			</div>
			<div className={styles.footer}>
				<Space>
					<Button
						// type="primary"
						disabled={loading}
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

export default SelectOrgModal;
