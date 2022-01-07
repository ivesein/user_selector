import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	message,
	Button,
	Space,
	Pagination,
	Modal,
	Select,
	Drawer,
} from "antd";
import CusTableBasis from "@/components/CusTableBasis";
import AvatarOrName from "@/components/common/AvatarOrName";
import AddMembers from "../AddMembers";
import EditMembers from "../EditMembers";
import ImportResult from "../ImportResult";
import MembersImportOrExport from "../MembersImportOrExport";
import { connect } from "react-redux";
import MemberDetail from "../MemberDetail";
import CusWarmPrompt from "@/components/CusWarmPrompt";
import SelectOrgModal from "@/components/SelectOrgModal";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import {
	GET_ORG_MEMBERS_API,
	// GET_TENANT_ORG_TREE_API,
	// GET_TENANT_USERS_API,
	DELETE_MEMBER_API,
	EXCHANGE_MEMBER_ORG_API,
	SEND_INVITE_MSG_API,
} from "@/api/permApi";
import downImg from "@/asset/img/down.png";
// import { traverseTreeSetProps, treeFilterToArr } from "@/utils/toolfunc";

const { Option } = Select;

const MemberList = (props) => {
	const [recordId, setRecordId] = useState(null);
	const [tableData, setTableData] = useState([]); //表格数据
	const [selectedRowKeys, setSelectedRowKeys] = useState([]); //总页数

	// const [orgInfo, setOrgInfo] = useState(null); //组织信息
	// const [userOptions, setUserOptions] = useState([]); //人员备选项

	const [currentPage, setCurrentPage] = useState(1); //当前页
	const [total, setTotal] = useState(0); //总条数
	const [size, setSize] = useState(10); //每页条数
	const [pageTotal, setPageTotal] = useState(0); //总页数
	const [y, setY] = useState(0); //表格容器高度
	const [hoverRowId, setHoverRowId] = useState(null); // 设置当前鼠标移入的行id
	// const [currentRow, setCurrentRow] = useState(null); // 当前操作行
	const [loading, setLoading] = useState(false); //表格数据加载loading
	// const [delLoading, setDelLoading] = useState(false);
	const [delMLoading, setDelMLoading] = useState(false); //批量删除loading
	const [currentRow, setCurrentRow] = useState(false); //批量删除loading
	const [visible, setVisible] = useState(false); //批量删除loading
	const importResultModalRef = useRef(null);
	// 表格容器ref
	const tableContainer = useRef(null);
	// 表格配置
	const tableConfig = {
		showSelection: true,
		bordered: false,
		rowKey: "userId",
		noPagination: true,
	};
	// 表格列
	const columns = [
		{
			title: "姓名",
			dataIndex: "name",
			// ellipsis: true,
			// width: 180,
			// className: styles.AvatarOrNameCell,
			render: (text, row, index) => {
				return <AvatarOrName user={row} />;
			},
		},
		{
			title: "手机号",
			dataIndex: "phone",
			key: "phone",
			width: 160,
			ellipsis: true,
		},
		{
			title: "组织",
			dataIndex: "orgName",
			key: "orgName",
			width: 180,
			ellipsis: true,
			render: (text, row, index) => {
				return text ? (
					text
				) : (
					<span style={{ color: "#999999" }}>未分配</span>
				);
			},
		},
		{
			title: "岗位",
			dataIndex: "jobName",
			key: "jobName",
			width: 150,
			ellipsis: true,
			render: (text, row, index) => {
				return text ? (
					text
				) : (
					<span style={{ color: "#999999" }}>未分配</span>
				);
			},
		},
		{
			title: "角色",
			dataIndex: "roleName",
			key: "roleName",
			width: 180,
			ellipsis: true,
			render: (text, row, index) => {
				return text ? (
					text
				) : (
					<span style={{ color: "#999999" }}>未分配</span>
				);
			},
		},
		{
			title: "状态",
			dataIndex: "isActive",
			key: "isActive",
			width: 80,
			ellipsis: true,
			render: (text, row, index) => {
				return (
					<span style={{ color: text ? "#245ff2" : "#df4545" }}>
						{text === "true" ? "已激活" : "未激活"}
					</span>
				);
			},
		},
		{
			title: "操作",
			dataIndex: "",
			key: "",
			width: 220,
			render: (text, row, index) => {
				return (
					<Space size={20}>
						<Button
							style={{ padding: 0 }}
							type="link"
							onClick={(e) => goEdit(row)}
						>
							编辑
						</Button>
						<Button
							type="text"
							danger
							style={{ padding: 0 }}
							onClick={(e) => goDelete(row)}
						>
							删除
						</Button>
						<Button
							style={{ padding: 0 }}
							type="link"
							onClick={(e) => goDetail(row)}
						>
							详情
						</Button>
						{row.isActive === "true" ? null : (
							<Button
								style={{ padding: 0 }}
								type="link"
								onClick={(e) => goInvite(row)}
							>
								邀请
							</Button>
						)}
					</Space>
				);
			},
		},
	];
	useEffect(() => {
		// loadOrgData();
		// loadUsersData();
		if (tableContainer.current) {
			setY(tableContainer.current.clientHeight - 56);
		}
	}, []);
	useEffect(() => {
		if (props.org) {
			setRecordId(props.org.id);
			setSelectedRowKeys([]); //切换角色时清空成员勾选数据
		}
	}, [props.org]);
	useEffect(() => {
		if (recordId) {
			loadTableData(size, currentPage, recordId);
		}
	}, [recordId, currentPage, size]);

	const loadTableData = useCallback(
		async (size, current, orgId, isActive = "all") => {
			if (!orgId) return;
			let params = {
				size,
				current,
				orgId,
				isActive,
			};
			try {
				setLoading(true);
				let res = await GET_ORG_MEMBERS_API(params);
				if (!res) {
					message.error("服务器繁忙，请稍后再试...");
					return;
				}
				console.log(res);
				setTableData([...(res?.data?.records ?? [])]);
				setTotal(res?.data?.total || 0);
				props.setTotalMembers(res?.data?.total || 0);
				setPageTotal(res?.data?.pages || 0);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
		[recordId, currentPage, size]
	);

	// 处理翻页
	const handlePageChange = (page, pagesize) => {
		setCurrentPage(page);
	};
	const goAddMember = () => {
		const addMemberModal = Modal.confirm({
			modalRender: () => (
				<AddMembers
					org={props.org}
					orgInfo={props?.orgInfo ?? null}
					userOptions={props?.userOptions ?? []}
					roleOptions={props?.roleOptions ?? []}
					jobOptions={props?.jobOptions ?? []}
					modal={addMemberModal}
					reload={(flag = true) => {
						reloadData();
						if (flag) {
							addMemberModal.destroy();
						}
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

	// 自定义删除对话框温馨提示配置 根据是否可删除弹出不同提示内容
	const cusModalRender = (ids, modal, loading, tip, mutiple = false) => (
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
					onClick={(e) => deleteTableData(ids, modal, tip, mutiple)}
					className="cus-btn"
					type="primary"
				>
					确定
				</Button>,
			]}
		/>
	);
	// 批量删除
	const goDeleteMutipal = (params) => {
		if (selectedRowKeys && selectedRowKeys.length > 0) {
			const delModal = Modal.confirm({
				modalRender: () =>
					cusModalRender(
						selectedRowKeys.join(","),
						delModal,
						false,
						"确定要删除所选成员吗？",
						true
					),
				width: 560,
				centered: true,
				maskClosable: false,
				destroyOnClose: true,
			});
		} else {
			message.warning("请勾选要删除的成员");
		}
	};
	// 处理表格行 移除按钮点击
	const goDelete = (row) => {
		const delModal = Modal.confirm({
			modalRender: () =>
				cusModalRender(row.id, delModal, false, "确定要删除该成员吗？"),
			width: 560,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	// 调接口移除
	const deleteTableData = async (ids, modal, tip, mutiple = false) => {
		modal.update((prevConfig) => ({
			...prevConfig,
			modalRender: () => cusModalRender(ids, modal, true, tip, mutiple),
		}));
		try {
			let res = await DELETE_MEMBER_API(ids);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("删除成功！");
			if (mutiple) {
				setSelectedRowKeys([]);
			}
			reloadData();
		} catch (error) {
			console.log(error);
		} finally {
			modal.destroy();
		}
	};
	// 重新加载数据
	const reloadData = (isActive = "all") => {
		if (currentPage === 1) {
			loadTableData(size, currentPage, recordId, isActive);
		} else {
			setCurrentPage(1);
		}
	};
	// 邀请激活
	const goInvite = async (row) => {
		try {
			const params = {
				phone: row.phone,
				name: row.name,
				company: props?.userInfo?.tenantName ?? "",
			};
			let res = await SEND_INVITE_MSG_API(params);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("邀请短信发送成功！");
			reloadData();
		} catch (error) {
			console.log(error);
		}
	};
	// 获取组织结构数据
	// const loadOrgData = useCallback(async () => {
	// 	try {
	// 		let res = await GET_TENANT_ORG_TREE_API();
	// 		if (!res) {
	// 			message.error("服务器繁忙，请稍后再试...");
	// 			return;
	// 		}
	// 		console.log(res);
	// 		if (res.data && res.data.length > 0) {
	// 			let tree = traverseTreeSetProps(res.data, {
	// 				key: "id",
	// 				title: "name",
	// 			});
	// 			let treeArr = treeFilterToArr(tree, () => {
	// 				return true;
	// 			}).map((item) => ({
	// 				id: item.id,
	// 				value: item.id,
	// 				label: item.name,
	// 			}));
	// 			setOrgInfo({ tree, treeArr });
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	} finally {
	// 	}
	// }, []);
	// 获取租户成员数据
	// const loadUsersData = useCallback(async () => {
	// 	try {
	// 		let res = await GET_TENANT_USERS_API();
	// 		if (!res) {
	// 			message.error("服务器繁忙，请稍后再试...");
	// 			return;
	// 		}

	// 		console.log(res);
	// 		if (res.data && res.data.length > 0) {
	// 			setUserOptions(
	// 				res.data.map((item) => ({
	// 					id: item.id,
	// 					value: item.userId,
	// 					label: item.name,
	// 				}))
	// 			);
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	} finally {
	// 	}
	// }, []);
	// 处理勾选
	const onSelectChange = (selectedRowKeys, selectedRows) => {
		console.log(selectedRowKeys, selectedRows);
		setSelectedRowKeys(selectedRowKeys);
	};
	// 处理状态过滤
	const handleTypeChange = (value) => {
		console.log(value);
		reloadData(value);
	};
	// 编辑成员
	const goEdit = (row) => {
		const editMemberModal = Modal.confirm({
			modalRender: () => (
				<EditMembers
					org={props.org}
					record={row}
					orgInfo={props?.orgInfo ?? null}
					userOptions={props?.userOptions ?? []}
					roleOptions={props?.roleOptions ?? []}
					jobOptions={props?.jobOptions ?? []}
					modal={editMemberModal}
					reload={() => {
						reloadData();
						editMemberModal.destroy();
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
	// 打开变更部门选择部门对话框
	const openExchangeMemberOrgModal = (params) => {
		if (selectedRowKeys && selectedRowKeys.length > 0) {
			const orgSelectModal = Modal.confirm({
				modalRender: () => (
					<SelectOrgModal
						title="请选择部门"
						orgData={props?.orgInfo?.tree ?? []}
						modal={orgSelectModal}
						ok={(ids) => {
							goExchangeMemberOrg(ids, orgSelectModal);
						}}
					/>
				),
				width: 720,
				height: 720,
				centered: true,
				maskClosable: false,
				destroyOnClose: true,
			});
		} else {
			message.warning("请勾选要变更部门的成员");
		}
	};
	// 执行部门变更
	const goExchangeMemberOrg = async (orgIds, modal) => {
		try {
			let res = await EXCHANGE_MEMBER_ORG_API({
				orgIds: orgIds,
				tenantUserIds: selectedRowKeys,
			});
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("变更成功！");
			setSelectedRowKeys([]);
			reloadData();
		} catch (error) {
			console.log(error);
		} finally {
			modal.destroy();
		}
	};
	// 打开导入导出对话框
	const goImportOrExport = () => {
		const impOrExptModal = Modal.confirm({
			modalRender: () => (
				<MembersImportOrExport
					org={props.org}
					modal={impOrExptModal}
					importOk={(result) => {
						impOrExptModal.destroy();
						showImportResultModal(result);
					}}
					// reload={(flag = true) => {
					// 	reloadData();
					// 	if (flag) {
					// 		impOrExptModal.destroy();
					// 	}
					// }}
				/>
			),
			width: 720,
			height: 560,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	// 展示导入成功数据
	const showImportResultModal = (result) => {
		if (importResultModalRef.current !== null) {
			importResultModalRef.current.update((prevConfig) => ({
				...prevConfig,
				modalRender: () => (
					<ImportResult
						result={result}
						// modal={importResultModal}
						reload={() => {
							reloadData();
							importResultModalRef.current.destroy();
							importResultModalRef.current = null;
						}}
					/>
				),
			}));
		} else {
			importResultModalRef.current = Modal.confirm({
				modalRender: () => (
					<ImportResult
						result={result}
						// modal={importResultModal}
						reload={() => {
							reloadData();
							importResultModalRef.current.destroy();
							importResultModalRef.current = null;
						}}
					/>
				),
				width: 720,
				height: 560,
				centered: true,
				maskClosable: false,
				destroyOnClose: true,
			});
		}
	};

	// 查看详情
	const goDetail = (row) => {
		setCurrentRow(row);
		setVisible(true);
	};
	const closedetail = () => {
		setVisible(false);
	};

	return (
		<div className={styles.memberInfoWrap}>
			<div className={styles.titleWrap}>
				<div className={styles.filterSelectWrap}>
					<span className={styles.title}>账号状态</span>
					<Select
						// labelInValue
						bordered={false}
						defaultValue="all"
						style={{ flex: 1 }}
						onChange={handleTypeChange}
						suffixIcon={<img src={downImg} alt="" />}
					>
						<Option value="all">全部</Option>
						<Option value="true">已激活</Option>
						<Option value="false">未激活</Option>
					</Select>
				</div>
				<div className={styles.btnWrap}>
					<Space>
						<Button
							size="large"
							onClick={(e) => goAddMember()}
							type="primary"
							style={{
								fontSize: 14,
							}}
							icon={<PlusOutlined />}
							// className="cus-btn-48"
						>
							添加成员
						</Button>
						<Button
							size="large"
							onClick={(e) => goImportOrExport()}
							style={{
								fontSize: 14,
							}}
							// className="cus-btn-48"
						>
							批量导入/导出
						</Button>
						<Button
							size="large"
							onClick={(e) => openExchangeMemberOrgModal()}
							style={{
								fontSize: 14,
							}}
							// className="cus-btn-48"
						>
							变更组织
						</Button>
						<Button
							loading={delMLoading}
							// className="cus-btn-48"
							type="danger"
							size="large"
							onClick={() => goDeleteMutipal()}
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.1)",
								fontSize: 14,
								color: "#df4545",
								border: "solid 1px #df4545",
							}}
						>
							批量删除
						</Button>
					</Space>
				</div>
			</div>
			<div className={styles.tableWrap} ref={tableContainer}>
				<CusTableBasis
					config={tableConfig}
					loading={loading}
					setHoverRowId={setHoverRowId}
					columns={columns}
					dataSource={tableData}
					selectedRowKeys={selectedRowKeys}
					onSelectChange={onSelectChange}
					y={y}
				/>
			</div>
			<div className={styles.paginationWrap}>
				<Pagination
					total={total}
					current={currentPage}
					onChange={handlePageChange}
					// showSizeChanger
					showQuickJumper
					showTotal={(total) => (
						<span
							style={{ fontSize: 14, color: "#323233" }}
						>{`共 ${total} 条，每页 ${size} 条`}</span>
					)}
				/>
			</div>
			<Drawer
				title="成员详情"
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
				<MemberDetail record={currentRow} close={closedetail} />
			</Drawer>
		</div>
	);
};

export default connect((state) => ({
	userInfo: state.userInfo,
}))(MemberList);
