import React, { useState, useEffect, useCallback, useRef } from "react";
import { message, Spin, Space, Select, Button, Modal, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import styles from "./index.module.scss";
import CusSearch from "@/components/CusSearch";
import OrgTree from "@/components/OrgTree";
import CusWarmPrompt from "@/components/CusWarmPrompt";
import OrgMemberTable from "../OrgMemberTable";
import AddOrg from "../AddOrg";
import OrgDetail from "../OrgDetail";

import memberIcon from "@/asset/img/member.png";
import inviteIcon from "@/asset/img/invite.png";
import { useHistory } from "react-router-dom";

// import MemberList from "./components/MemberList";
import {
	GET_TENANT_ORG_TREE_API,
	GET_TENANT_USERS_API,
	GET_ORG_ICONS_API,
	DELETE_ORG_API,
	GET_ROLE_LIST_WITH_PAGE_API,
	GET_BASIC_LIST_API,
} from "@/api/permApi";
import {
	traverseTreeSetProps,
	treeFilterToArr,
	getUserCache,
} from "@/utils/toolfunc";
import { TYPE_JOB } from "@/views/OrgStructure/pages/BasicSetting/pages/config";

// 成员管理
const MembersManagement = () => {
	const [searchText, setSearchText] = useState(null);
	const [orgLoading, setOrgLoading] = useState(false);
	const [currentOrg, setCurrentOrg] = useState(null);
	const [totalMembers, setTotalMembers] = useState(0); // 当前所选组织下的所有成员数
	const [orgData, setOrgData] = useState([]);
	const [userOptions, setUserOptions] = useState([]); //人员备选项
	const [roleOptions, setRoleOptions] = useState([]); //角色备选项
	const [jobOptions, setJobOptions] = useState([]); //岗位备选项

	const [orgInfo, setOrgInfo] = useState(null); //组织信息
	const [iconList, setIconList] = useState([]);
	const [visible, setVisible] = useState(false);
	const [checkCurrentOrg, setCheckCurrentOrg] = useState(null);
	const orgDataRef = useRef([]);
	const history = useHistory();
	useEffect(() => {
		loadOrgData(searchText);
		loadUsersData();
		loadRoleData();
		loadJobData();
		loadOrgIconsData();
	}, []);
	useEffect(() => {
		if (searchText) {
			setOrgData([
				...treeFilterToArr(orgDataRef.current, (node) =>
					node.name.includes(searchText)
				).map((node) => ({ ...node, children: [] })),
			]);
		} else {
			if (orgDataRef.current) {
				setOrgData([...orgDataRef.current]);
			}
		}
	}, [searchText]);

	const onSearch = (value) => {
		setSearchText(value);
	};
	// 获取组织数据
	const loadOrgData = useCallback(async () => {
		try {
			setOrgLoading(true);
			let res = await GET_TENANT_ORG_TREE_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			if (res.data && res.data.length > 0) {
				let tree = traverseTreeSetProps(res.data, {
					key: "id",
					title: "name",
				});
				setOrgData([...tree]);
				orgDataRef.current = [...tree];
				let treeArr = treeFilterToArr(tree, () => {
					return true;
				}).map((item) => ({
					id: item.id,
					value: item.id,
					label: item.name,
				}));
				setOrgInfo({ tree, treeArr });
				setCurrentOrg(tree[0]);
			} else {
				setOrgData([]);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setOrgLoading(false);
		}
	}, []);
	// 处理节点更多操作 EDIT  ADD_CHILD  DELETE
	const handleNodeControl = (type, node) => {
		switch (type) {
			case "EDIT":
				goEditOrg(node);
				break;
			case "ADD_CHILD":
				goAddChildOrg(node);
				break;
			case "DELETE":
				goDeleteOrg(node);
				break;
			case "DETAIL":
				goDetailOrg(node);
				break;
			default:
				break;
		}
	};
	// 获取用户列表
	const loadUsersData = useCallback(async () => {
		try {
			let res = await GET_TENANT_USERS_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}

			console.log(res);
			if (res.data && res.data.length > 0) {
				setUserOptions(
					res.data.map((item) => ({
						id: item.id,
						value: item.userId,
						label: item.name,
					}))
				);
			}
		} catch (error) {
			console.log(error);
		} finally {
		}
	}, []);
	// 获取组织图标
	const loadOrgIconsData = useCallback(async () => {
		try {
			let res = await GET_ORG_ICONS_API();
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}

			console.log(res);
			if (res.data && res.data.records && res.data.records.length > 0) {
				setIconList(res.data.records);
			}
		} catch (error) {
			console.log(error);
		} finally {
		}
	}, []);
	// 获取角色列表
	const loadRoleData = useCallback(async () => {
		try {
			// setOrgLoading(true);
			const params = {
				size: 1000,
				current: 1,
			};
			let res = await GET_ROLE_LIST_WITH_PAGE_API(params);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			if (res?.data?.records?.length) {
				// let arr = res.data.records.map((item) => ({
				// 	id: item.id,
				// 	value: item.id,
				// 	label: item.name,
				// }));
				// debugger;

				setRoleOptions([
					...res.data.records.map((item) => ({
						id: item.id,
						value: item.id,
						label: item.name,
					})),
				]);
			}
		} catch (error) {
			console.log(error);
		}
	}, []);
	// 获取岗位列表
	const loadJobData = useCallback(async () => {
		try {
			// setOrgLoading(true);
			const params = {
				size: 1000,
				current: 1,
				type: TYPE_JOB,
			};
			let res = await GET_BASIC_LIST_API(params);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			if (res?.data?.records?.length) {
				setJobOptions([
					...res.data.records.map((item) => ({
						id: item.id,
						value: item.id,
						label: item.name,
					})),
				]);
			}
		} catch (error) {
			console.log(error);
		}
	}, []);
	const addNewOrg = () => {
		const addOrgModal = Modal.confirm({
			modalRender: () => (
				<AddOrg
					orgInfo={orgInfo}
					userOptions={userOptions}
					iconList={iconList}
					modal={addOrgModal}
					reload={() => {
						loadOrgData();
						addOrgModal.destroy();
					}}
				/>
			),
			width: 960,
			height: 800,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};

	// 编辑组织
	const goEditOrg = (node) => {
		const EditOrgModal = Modal.confirm({
			modalRender: () => (
				<AddOrg
					editing={true}
					nodeId={node.id}
					orgInfo={orgInfo}
					userOptions={userOptions}
					iconList={iconList}
					modal={EditOrgModal}
					reload={() => {
						loadOrgData();
						EditOrgModal.destroy();
					}}
				/>
			),
			width: 960,
			height: 800,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	// 添加子组织
	const goAddChildOrg = (node) => {
		const addOrgModal = Modal.confirm({
			modalRender: () => (
				<AddOrg
					parentOrgId={node.id}
					orgInfo={orgInfo}
					userOptions={userOptions}
					iconList={iconList}
					modal={addOrgModal}
					reload={() => {
						loadOrgData();
						addOrgModal.destroy();
					}}
				/>
			),
			width: 960,
			height: 800,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	// 查看组织详情
	const goDetailOrg = (node) => {
		setCheckCurrentOrg(node);
		setVisible(true);
	};
	// 自定义删除对话框温馨提示配置 根据是否可删除弹出不同提示内容
	const cusModalRender = (id, modal, loading, tip) => (
		<CusWarmPrompt
			modal={modal}
			type="DELETE"
			infos={<span>{tip || "确定要执行删除操作吗？"}</span>}
			buttons={[
				<Button onClick={(e) => modal.destroy()} className="cus-btn">
					取消
				</Button>,
				<Button
					loading={loading}
					onClick={(e) => deleteOrg(id, modal, tip)}
					className="cus-btn"
					type="primary"
				>
					确定
				</Button>,
			]}
		/>
	);
	// 删除组织
	const goDeleteOrg = (node) => {
		const delModal = Modal.confirm({
			modalRender: () =>
				cusModalRender(
					node.id,
					delModal,
					false,
					"确定要删除该组织吗？"
				),
			width: 560,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	const deleteOrg = async (id, modal, tip) => {
		modal.update((prevConfig) => ({
			...prevConfig,
			modalRender: () => cusModalRender(id, modal, true, tip),
		}));
		try {
			let res = await DELETE_ORG_API({
				id: id,
				tenantId: getUserCache("userInfo")?.tenantId,
			});
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("删除成功！");
			loadOrgData();
		} catch (error) {
			console.log(error);
		} finally {
			modal.destroy();
		}
	};
	// 邀请
	const goInvite = () => {
		history.push({
			pathname: "/admin/org/members/invite",
			state: {
				departmentId: currentOrg.id,
				manageId: currentOrg.leaderId,
			},
		});
	};
	const closedetail = (params) => {
		setVisible(false);
	};

	return (
		<div className={styles.membersManangementPage}>
			<div className={styles.orgListWrap}>
				<div className={styles.searchWrap}>
					<span className={styles.title}>组织</span>
					<CusSearch
						onSearch={onSearch}
						onChange={(value) => {}}
						width={"100%"}
						placeholder="请输入关键字"
					/>
				</div>
				<div className={styles.orgList}>
					{orgLoading ? (
						<Spin
							style={{
								width: "100%",
								height: "100%",
								paddingTop: 200,
							}}
							tip="数据加载中..."
						/>
					) : (
						<OrgTree
							treeData={orgData}
							setCurrentOrg={(org) => setCurrentOrg(org)}
							handleNodeControl={handleNodeControl}
						/>
					)}
				</div>
				<div
					onClick={(e) => addNewOrg()}
					className={styles.addNewOrgBtn}
				>
					<PlusOutlined />
					<span>新增组织</span>
				</div>
			</div>
			<div className={styles.orgInfoWrap}>
				<div className={styles.baseInfoWrap}>
					<div className={styles.infoTitle}>
						<span>{currentOrg?.name ?? "组织测试"}</span>
						<img
							className={styles.orgMemberIcon}
							src={memberIcon}
							alt=""
						/>
						<span className={styles.orgMembersCount}>
							{totalMembers}
						</span>
					</div>
					<div className={styles.inviteBtn} onClick={goInvite}>
						<img src={inviteIcon} alt="" />
						<span>邀请成员加入本组织</span>
					</div>
				</div>
				<OrgMemberTable
					org={currentOrg}
					orgInfo={orgInfo}
					roleOptions={roleOptions}
					jobOptions={jobOptions}
					userOptions={userOptions}
					setTotalMembers={setTotalMembers}
				/>
			</div>
			<Drawer
				title="组织详情"
				width={630}
				closable={true}
				destroyOnClose={true}
				maskClosable={false}
				onClose={closedetail}
				visible={visible}
				// getContainer={false}
				bodyStyle={{ padding: 0 }}
				// style={{ position: "absolute" }}
			>
				<OrgDetail node={checkCurrentOrg} close={closedetail} />
			</Drawer>
		</div>
	);
};

export default MembersManagement;
