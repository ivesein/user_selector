import React, { useState, useEffect, useRef, useCallback } from "react";
import { message, Button, Space, Pagination, Modal } from "antd";
import CusTableBasis from "@/components/CusTableBasis";
import AvatarOrName from "@/components/common/AvatarOrName";
import AddRoleMember from "../AddRoleMember";
import CusWarmPrompt from "@/components/CusWarmPrompt";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import {
	GET_ROLE_MEMBERS_API,
	USER_ORG_LIST_API,
	DELETE_ROLE_MEMBERS_API,
} from "@/api/permApi";
const MemberList = (props) => {
	const [recordId, setRecordId] = useState(null);
	const [tableData, setTableData] = useState([]); //表格数据
	const [selectedRowKeys, setSelectedRowKeys] = useState([]); //选择的表格行
	const [columns, setColumns] = useState([]); //表格列

	const [orgData, setOrgData] = useState([]); //组织架构数据(带有人员的) 用于选择成员
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
	// 表格容器ref
	const tableContainer = useRef(null);
	const rIdRef = useRef(null);

	// 表格配置
	const tableConfig = {
		showSelection: true,
		bordered: false,
		rowKey: "userId",
		noPagination: true,
	};
	// 表格列
	const initColumns = (isSuperRole) => [
		{
			title: "姓名",
			dataIndex: "name",
			ellipsis: true,
			// width: 180,
			render: (text, row, index) => {
				return <AvatarOrName user={row} showTag={isSuperRole} />;
			},
		},
		{
			title: "手机号",
			dataIndex: "phone",
			key: "phone",
			width: 150,
			ellipsis: true,
		},
		{
			title: "部门",
			dataIndex: "org",
			key: "org",
			width: 200,
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
			title: "职位",
			dataIndex: "position",
			key: "position",
			width: 200,
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
			dataIndex: "role",
			key: "role",
			width: 200,
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
			title: "操作",
			dataIndex: "",
			key: "",
			width: 120,
			render: (text, row, index) => {
				return (
					<>
						{isSuperRole && row.remark === "创建人" ? null : (
							<Button
								type="text"
								danger
								onClick={(e) => goDelete(row)}
							>
								删除
							</Button>
						)}
					</>
				);
			},
		},
	];
	useEffect(() => {
		getOrgData();
		if (tableContainer.current) {
			setY(tableContainer.current.clientHeight - 56);
		}
	}, []);
	useEffect(() => {
		if (props.role) {
			rIdRef.current = props.role.id;
			setColumns(initColumns(props.role.original));
			setRecordId(props.role.id);
			setSelectedRowKeys([]); //切换角色时清空成员勾选数据
		}
	}, [props.role]);
	useEffect(() => {
		if (recordId) {
			loadTableData(size, currentPage, recordId);
		}
	}, [recordId, currentPage, size]);
	// useEffect(() => {
	// 	// 获取表格高度
	// 	if (tableContainer.current) {
	// 		setY(tableContainer.current.clientHeight - 56);
	// 	}
	// }, [tableData]);
	const loadTableData = useCallback(
		async (size, current, roleId) => {
			if (!roleId) return;
			let params = {
				size,
				current,
				roleId,
			};
			try {
				setLoading(true);
				let res = await GET_ROLE_MEMBERS_API(params);
				if (!res) {
					message.error("服务器繁忙，请稍后再试...");
					return;
				}
				console.log(res);
				setTableData([...(res?.data?.records ?? [])]);
				// setTableData(
				// 	res?.data?.records?.map((record, index) => ({
				// 		cIndex: (currentPage - 1) * size + index + 1,
				// 		...record,
				// 	})) || []
				// );
				setTotal(res?.data?.total || 0);
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
		const addRoleMemberModal = Modal.confirm({
			modalRender: () => (
				<AddRoleMember
					role={props.role}
					orgData={orgData}
					modal={addRoleMemberModal}
					reload={() => {
						reloadData();
						addRoleMemberModal.destroy();
					}}
				/>
			),
			width: 720,
			height: 800,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};

	// 自定义删除对话框温馨提示配置 根据是否可删除弹出不同提示内容
	const cusModalRender = (ids, modal, loading, tip) => (
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
					onClick={(e) => deleteTableData(ids, modal, tip)}
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
						[...selectedRowKeys],
						delModal,
						false,
						"确定要删除所选成员吗？"
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
				cusModalRender(
					[row.userId],
					delModal,
					false,
					"确定要删除该成员吗？"
				),
			width: 560,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	// 调接口移除
	const deleteTableData = async (ids, modal, tip) => {
		modal.update((prevConfig) => ({
			...prevConfig,
			modalRender: () => cusModalRender(ids, modal, true, tip),
		}));
		try {
			let res = await DELETE_ROLE_MEMBERS_API({
				roleId: rIdRef.current,
				userId: ids,
			});
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("删除成功！");
			setSelectedRowKeys([]);
			reloadData();
		} catch (error) {
			console.log(error);
		} finally {
			modal.destroy();
		}
	};
	// 重新加载数据
	const reloadData = () => {
		if (currentPage === 1) {
			loadTableData(size, currentPage, rIdRef.current);
		} else {
			setCurrentPage(1);
		}
	};
	// 获取组织架构数据
	const getOrgData = async () => {
		try {
			setLoading(true);
			let res = await USER_ORG_LIST_API();
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
	// 处理勾选
	const onSelectChange = (selectedRowKeys, selectedRows) => {
		console.log(selectedRowKeys, selectedRows);
		setSelectedRowKeys(selectedRowKeys);
	};
	return (
		<div className={styles.memberListWrap}>
			<div className={styles.btns}>
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
					tableIndex={1}
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
		</div>
	);
};

export default MemberList;
