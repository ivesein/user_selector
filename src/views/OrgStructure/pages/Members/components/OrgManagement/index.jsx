import React, { useState, useEffect, useCallback } from "react";
import { message, Spin } from "antd";
import styles from "./index.module.scss";
import CusSearch from "@/components/CusSearch";
import defRoleIcon from "@/asset/img/role_icon0.png";
import cusRoleIcon from "@/asset/img/role_icon4.png";
// import MemberList from "./components/MemberList";
import { GET_ROLE_LIST_WITH_PAGE_API } from "@/api/permApi";
// 组织管理
const OrgManagement = () => {
	const [searchText, setSearchText] = useState(null);
	const [roleLoading, setRoleLoading] = useState(false);
	const [currentRole, setCurrentRole] = useState(null);

	const SIZE = 1000;
	const CURRENT_PAGE = 1;
	const [roleList, setRoleList] = useState([
		{
			id: 1,
			type: "0",
			name: "系统管理员",
		},
	]);
	// useEffect(() => {
	// 	loadTableData(SIZE, CURRENT_PAGE);
	// }, []);
	useEffect(() => {
		loadTableData(SIZE, CURRENT_PAGE, searchText);
	}, [searchText]);

	const onSearch = (value) => {
		setSearchText(value);
	};
	const renderRoleItem = (roles, cId) => {
		return (
			roles &&
			roles.map((role) => {
				return (
					<div
						key={role.id}
						className={`${styles.roleItemWrap}${
							role.id === cId
								? " " + styles.roleItemWrapActive
								: ""
						}`}
						onClick={(e) => setCurrentRole(role)}
					>
						<img
							src={role.type === "0" ? defRoleIcon : cusRoleIcon}
							alt=""
						/>
						<span>{role.name}</span>
					</div>
				);
			})
		);
	};
	const loadTableData = useCallback(
		async (size, current, search = null) => {
			let params = {
				size,
				current,
			};
			if (search) {
				params.query = search;
			}
			try {
				setRoleLoading(true);
				let res = await GET_ROLE_LIST_WITH_PAGE_API(params);
				if (!res) {
					message.error("服务器繁忙，请稍后再试...");
					return;
				}
				console.log(res);
				if (res.data && res.data.records && res.data.records.length) {
					setRoleList([...res.data.records]);
					setCurrentRole(res.data.records[0]);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setRoleLoading(false);
			}
		},
		[searchText]
	);
	return (
		<div className={styles.roleMembersPage}>
			<div className={styles.roleListWrap}>
				<div className={styles.searchWrap}>
					<span className={styles.title}>角色列表</span>
					<CusSearch
						onSearch={onSearch}
						onChange={(value) => {}}
						width={"100%"}
						placeholder="请输入关键字"
					/>
				</div>
				<div className={styles.roleList}>
					{roleLoading ? (
						<Spin
							style={{
								width: "100%",
								height: "100%",
								paddingTop: 200,
							}}
							tip="数据加载中..."
						/>
					) : (
						renderRoleItem(roleList, currentRole?.id)
					)}
				</div>
			</div>
			<div className={styles.roleMemberInfoWrap}>
				<div className={styles.baseInfoWrap}>
					<span className={styles.infoTitle}>角色属性</span>
					<div className={styles.infos}>
						<div className={styles.infoItem}>
							<span className={styles.infokey}>角色名称</span>
							<span className={styles.infovalue}>
								{currentRole?.name ?? ""}
							</span>
						</div>
						<div className={styles.infoItem}>
							<span className={styles.infokey}>角色描述</span>
							<span className={styles.infovalue}>
								{currentRole?.describe ?? ""}
							</span>
						</div>
					</div>
				</div>
				<div className={styles.memberInfoWrap}>
					<div className={styles.titleWrap}>
						<span className={styles.infoTitle}>成员列表</span>
					</div>
					{/* <MemberList role={currentRole} /> */}
				</div>
			</div>
		</div>
	);
};

export default OrgManagement;
