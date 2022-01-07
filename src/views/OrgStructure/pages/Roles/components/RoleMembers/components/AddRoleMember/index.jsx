import React, { useState, useEffect, useRef, useCallback } from "react";
import { message, Button, Space, Pagination, Modal } from "antd";
import UserSelect from "@/components/UserSelect";
import styles from "./index.module.scss";
import closeIcon from "@/asset/img/del.png";
import { GET_ROLE_MEMBERS_API, ROLE_ADD_MEMBERS_API } from "@/api/permApi";

const AddRoleMember = (props) => {
	const [recordId, setRecordId] = useState(null);
	const [pageLoading, setPageLoading] = useState(false); //页面加载loading
	const [hasSelectedList, setHasSelectedList] = useState([]);
	const [loading, setLoading] = useState(false); //确定按钮提交loading

	const selectRef = useRef(null);
	useEffect(() => {
		if (props.role) {
			setRecordId(props.role.id);
		}
	}, [props.role]);
	useEffect(() => {
		if (recordId) {
			getRoleMembers(recordId);
		}
	}, [recordId]);
	// 获取角色成员 用于回填
	const getRoleMembers = useCallback(
		async (roleId) => {
			let params = {
				size: 10000,
				current: 1,
				roleId,
			};
			try {
				setPageLoading(true);
				let res = await GET_ROLE_MEMBERS_API(params);
				if (!res) {
					message.error("服务器繁忙，请稍后再试...");
					return;
				}
				console.log(res);
				const { records } = res.data;
				if (records && records.length) {
					setHasSelectedList([
						...records.map((item) => ({
							id: item.userId,
							name: item.name,
							avatar: item.avatar || "",
						})),
					]);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setPageLoading(false);
			}
		},
		[recordId]
	);
	const confirm = async () => {
		setLoading(true);
		let data = selectRef?.current?.getSelectList();
		try {
			const params = {
				roleId: recordId,
				userId: data?.hasSelectList?.map((item) => item.id),
			};
			setPageLoading(true);
			let res = await ROLE_ADD_MEMBERS_API(params);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("添加成员成功!");
			props.reload();
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const close = (params) => {
		props.modal.destroy();
	};

	return (
		<div className={styles.addRoleMember}>
			<div className={styles.title}>
				<span>选择人员</span>
				<img
					onClick={(e) => close()}
					className={styles.closeIcon}
					src={closeIcon}
					alt=""
				/>
			</div>
			<div className={styles.content}>
				<UserSelect
					orgData={props.orgData}
					hasSelectList={hasSelectedList}
					selectRef={selectRef}
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
						loading={loading}
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

export default AddRoleMember;
