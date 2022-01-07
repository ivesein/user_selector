import React, { useState, useEffect, useRef } from "react";
import {
	Button,
	Modal,
	Pagination,
	Space,
	message,
	Select,
	Tooltip,
	Drawer,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CusSearch from "@/components/CusSearch";
import CusTableBasis from "@/components/CusTableBasis";
import CusWarmPrompt from "@/components/CusWarmPrompt";
import styles from "./index.module.scss";
import defRoleIcon from "@/asset/img/role_icon0.png";
import cusRoleIcon from "@/asset/img/role_icon4.png";
import CreateRole from "./components/CreateRole";
import EditRole from "./components/EditRole";
import RoleDetail from "./components/RoleDetail";

import { connect } from "react-redux";
import { GET_ROLE_LIST_WITH_PAGE_API, DELETE_ROLE_API } from "@/api/permApi";
const { Option } = Select;
// 角色权限
const RolePermission = (props) => {
	const [tableData, setTableData] = useState([]); //表格数据
	const [currentPage, setCurrentPage] = useState(1); //当前页
	const [total, setTotal] = useState(0); //总条数
	const [size, setSize] = useState(10); //每页条数
	const [pageTotal, setPageTotal] = useState(0); //总页数
	const [y, setY] = useState(0); //表格容器高度
	const [hoverRowId, setHoverRowId] = useState(null); // 设置当前鼠标移入的行id
	const [currentRow, setCurrentRow] = useState(null); // 当前操作行
	const [searchInfo, setSearchInf] = useState(null);
	const [searchText, setSearchText] = useState(undefined);
	const [pageLoading, setPageLoading] = useState(false); //页面数据加载中
	const [detailVisible, setDetailVisible] = useState(false); //详情页面开关

	const onSearch = (value) => {
		setSearchInf((searchInfo) => ({ ...searchInfo, query: value }));
	};
	// 表格容器ref
	const tableContainer = useRef(null);
	// 表格配置
	const tableConfig = {
		showSelection: false,
		bordered: false,
		rowKey: "id",
		noPagination: true,
	};
	// 表格列配置  billStatus: 0="已提交";1="审批通过";2="拒绝";3="暂存"
	const columns = [
		{
			title: "角色名称",
			dataIndex: "name",
			key: "name",
			width: 300,
			ellipsis: true,
			render: (text, row) => (
				<div className={styles.roleNameWrap}>
					<img
						src={row.type === "0" ? defRoleIcon : cusRoleIcon}
						alt=""
					/>
					{/* <Tooltip placement="topLeft" title={text}>
						<span className={styles.cellSpan}>{text}</span>
					</Tooltip> */}
					<span title={text} className={styles.cellSpan}>
						{text}
					</span>
				</div>
			),
		},
		{
			title: "角色描述",
			dataIndex: "describe",
			key: "describe",
			className: styles.cusColumnStyle,
			ellipsis: true,
			// render: (text, row) => (
			// 	<Tooltip placement="topLeft" title={text}>
			// 		<span className={styles.cellSpan}>{text}</span>
			// 	</Tooltip>
			// ),
		},
		{
			title: "角色类型",
			dataIndex: "original",
			key: "original",
			className: styles.cusColumnStyle,
			width: 160,
			ellipsis: true,
			render: (text) => (text ? "系统预置" : "自定义"),
		},
		{
			title: "数据权限",
			dataIndex: "permissionType",
			key: "permissionType",
			className: styles.cusColumnStyle,
			width: 160,
			ellipsis: true,
			render: (text) =>
				text === 0
					? "全部"
					: text === 1
					? "本级"
					: text === 2
					? "本级及子级"
					: text === 3
					? "自定义"
					: "无",
		},
		{
			title: "操作",
			dataIndex: "disable",
			key: "disable",
			width: 300,
			render: (text, row, index) => {
				return (
					<Space size={2}>
						{!row.original ? (
							<>
								<Button
									type="link"
									onClick={(e) => goEdit(row)}
								>
									编辑
								</Button>
								<Button
									type="text"
									danger
									onClick={(e) => goDelete(row)}
								>
									删除
								</Button>
								{/* <Button type="link">数据权限</Button>
								<Button type="link">功能权限</Button> */}
							</>
						) : null}
						{/* <Button type="link">成员</Button> */}
						<Button onClick={(e) => goDetail(row)} type="link">
							详情
						</Button>
					</Space>
				);
			},
		},
	];
	useEffect(() => {
		loadTableData(size, currentPage);
	}, [currentPage]);
	useEffect(() => {
		if (searchInfo !== null) reloadData();
	}, [searchInfo]);
	useEffect(() => {
		// 获取表格高度
		if (tableContainer.current) {
			setY(tableContainer.current.clientHeight - 56);
		}
	}, [tableData]);
	const handleDataPermSearchChange = (value) => {
		console.log(value);
		setSearchInf((searchInfo) => ({
			...searchInfo,
			// query: searchText,
			permissionType: value,
		}));
	};
	const handleRoleTypeSearchChange = (value) => {
		console.log(value);
		setSearchInf((searchInfo) => ({
			...searchInfo,
			// query: searchText,
			original: value,
		}));
	};

	// const handleRoleTypeSearchChange = (value) => {
	// 	console.log(value);
	// 	setSearchInf((searchInfo) => ({
	// 		...searchInfo,
	// 		query: searchText,
	// 		original: value,
	// 	}));
	// };

	// 处理翻页
	const handlePageChange = (page, pagesize) => {
		setCurrentPage(page);
	};
	// 自定义删除对话框温馨提示配置 根据是否可删除弹出不同提示内容
	const cusModalRender = (flag, row, modal, loading) => (
		<CusWarmPrompt
			modal={modal}
			type="DELETE"
			infos={<span>确定要删除该角色吗？</span>}
			buttons={
				flag ? (
					[
						<Button
							onClick={(e) => modal.destroy()}
							className="cus-btn"
						>
							取消
						</Button>,
						<Button
							loading={loading}
							onClick={(e) => deleteTableData(row, modal)}
							className="cus-btn"
							type="primary"
						>
							确定
						</Button>,
					]
				) : (
					<Button
						onClick={(e) => modal.destroy()}
						className="cus-btn"
						type="primary"
					>
						确定
					</Button>
				)
			}
		/>
	);
	// 处理表格行 移除按钮点击
	const goDelete = (row) => {
		// 判断是否可删除
		let flag = true;
		const delModal = Modal.confirm({
			modalRender: () => cusModalRender(flag, row, delModal, false),
			width: 560,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	// 调接口移除
	const deleteTableData = async (row, modal) => {
		modal.update((prevConfig) => ({
			...prevConfig,
			modalRender: () => cusModalRender(true, row, modal, true),
		}));
		try {
			let res = await DELETE_ROLE_API({ id: row.id });
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("删除成功！");
			reloadData();
		} catch (error) {
			console.log(error);
		} finally {
			modal.destroy();
		}
	};
	const loadTableData = async (size, current) => {
		let params = {
			size,
			current,
		};
		if (searchInfo) {
			if (searchInfo.query) {
				params.query = searchInfo.query;
			}
			if (
				searchInfo.permissionType &&
				searchInfo.permissionType !== "all"
			) {
				params.permissionType = searchInfo.permissionType;
			}
			if (
				searchInfo.original !== undefined &&
				searchInfo.original !== "0"
			) {
				params.original = searchInfo.original === "1";
			}
		}
		try {
			setPageLoading(true);
			let res = await GET_ROLE_LIST_WITH_PAGE_API(params);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			console.log(res);
			setTableData(
				res?.data?.records?.map((record, index) => ({
					cIndex: (currentPage - 1) * size + index + 1,
					...record,
				})) || []
			);
			setTotal(res?.data?.total || 0);
			setPageTotal(res?.data?.pages || 0);
		} catch (error) {
			console.log(error);
		} finally {
			setPageLoading(false);
		}
	};
	// 重新加载数据
	const reloadData = () => {
		if (currentPage === 1) {
			loadTableData(size, currentPage);
		} else {
			setCurrentPage(1);
		}
	};
	// 打开新建角色对话框
	const openCreateRoleModal = (data = null) => {
		const createRoleModal = Modal.confirm({
			modalRender: () => (
				<CreateRole
					data={data}
					userInfo={props.userInfo}
					modal={createRoleModal}
					menuTree={props.menuTree}
					orgTree={props.orgTree}
					reload={() => {
						reloadData();
						createRoleModal.destroy();
					}}
				/>
			),
			width: 640,
			height: 800,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	// 打开编辑角色对话框
	const goEdit = (row) => {
		const editRoleModal = Modal.confirm({
			modalRender: () => (
				<EditRole
					role={row}
					userInfo={props.userInfo}
					modal={editRoleModal}
					menuTree={props.menuTree}
					orgTree={props.orgTree}
					reload={() => {
						reloadData();
						editRoleModal.destroy();
					}}
				/>
			),
			width: 640,
			height: 800,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};

	// 打开详情抽屉
	const goDetail = (row) => {
		setCurrentRow(row);
		setDetailVisible(true);
	};

	// 关闭详情抽屉
	const closeDetail = (params) => {
		setDetailVisible(false);
	};

	return (
		<div className={styles.RolePermission}>
			<div className={styles.controlBar}>
				<Button
					className={styles.cusBtn}
					type="primary"
					icon={<PlusOutlined />}
					onClick={openCreateRoleModal}
				>
					自定义角色
				</Button>
				<div className={styles.searchItemWrap}>
					<div>
						<span>数据权限：</span>
						<Select
							defaultValue="all"
							style={{
								width: 160,
								marginRight: 40,
								fontSize: 14,
								color: "#2b2b2b",
							}}
							size="large"
							onChange={handleDataPermSearchChange}
						>
							<Option value="all">不限</Option>
							<Option value="0">全部</Option>
							<Option value="1">本级</Option>
							<Option value="2">本级及子级</Option>
							<Option value="3">自定义</Option>
						</Select>
					</div>
					<div>
						<span>角色类型：</span>
						<Select
							defaultValue="0"
							style={{
								width: 160,
								marginRight: 40,
								fontSize: 14,
								color: "#2b2b2b",
							}}
							size="large"
							onChange={handleRoleTypeSearchChange}
						>
							<Option value="0">全部</Option>
							<Option value="1">系统预置</Option>
							<Option value="2">自定义</Option>
						</Select>
					</div>
					<CusSearch
						onSearch={onSearch}
						onChange={(value) =>
							// setSearchInf((searchInfo) => ({
							// 	...searchInfo,
							// 	query: value,
							// }))
							setSearchText(value)
						}
						width={288}
						placeholder="请输入关键字"
					/>
				</div>
			</div>
			<div className={styles.tableWrap} ref={tableContainer}>
				<CusTableBasis
					config={tableConfig}
					loading={pageLoading}
					setHoverRowId={setHoverRowId}
					columns={columns}
					dataSource={tableData}
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
				title="详情"
				width={632}
				closable={true}
				destroyOnClose={true}
				maskClosable={false}
				onClose={closeDetail}
				visible={detailVisible}
				// getContainer={false}
				bodyStyle={{ padding: 0 }}
				// style={{ position: "absolute" }}
			>
				<RoleDetail
					role={currentRow}
					menuTree={props.menuTree}
					orgTree={props.orgTree}
					close={closeDetail}
				/>
			</Drawer>
		</div>
	);
};

// export default RolePermission;
export default connect((state) => ({
	userInfo: state.userInfo,
	menuTree: state.menuTree,
	orgTree: state.orgTree,
}))(RolePermission);
