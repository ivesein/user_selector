import React, { useState, useEffect, useRef, useCallback } from "react";
import { message, Button, Space, Modal, Select } from "antd";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import CusTableBasis from "@/components/CusTableBasis";
import AvatarOrName from "@/components/common/AvatarOrName";
import AddAdminModal from "./components/AddAdminModal";
import TransferModal from "./components/TransferModal";

import CusSearch from "@/components/CusSearch";
import { connect } from "react-redux";
import CusWarmPrompt from "@/components/CusWarmPrompt";

import { PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import {
	GET_TENANT_ADMIN_LIST_API,
	DELETE_ADMIN_API,
} from "@/api/enterpriseApi";
// import downImg from "@/asset/img/down.png";
import { traverseTreeSetProps, treeFilterToArr } from "@/utils/toolfunc";
import {
	GET_TENANT_ORG_TREE_API,
	USER_ORG_LIST_OLD_API,
	GET_TENANT_USERS_API,
	USER_ORG_LIST_API,
} from "@/api/permApi";
import { breadcrumbsPath } from "@/router/constant.js";

const { Option } = Select;

const TransferAdministrator = (props) => {
	const [recordId, setRecordId] = useState(null);
	const [tableData, setTableData] = useState([]); //表格数据
	const [selectedRowKeys, setSelectedRowKeys] = useState([]); //总页数

	const [searchText, setSearchText] = useState(undefined);
	// const [currentPage, setCurrentPage] = useState(1); //当前页
	// const [total, setTotal] = useState(0); //总条数
	// const [size, setSize] = useState(10); //每页条数
	// const [pageTotal, setPageTotal] = useState(0); //总页数
	const [y, setY] = useState(0); //表格容器高度
	const [hoverRowId, setHoverRowId] = useState(null); // 设置当前鼠标移入的行id
	// const [currentRow, setCurrentRow] = useState(null); // 当前操作行
	const [loading, setLoading] = useState(false); //表格数据加载loading
	// const [delLoading, setDelLoading] = useState(false);
	// const [delMLoading, setDelMLoading] = useState(false); //批量删除loading
	const [currentRow, setCurrentRow] = useState(false); //批量删除loading
	const [visible, setVisible] = useState(false); //批量删除loading
	// const [orgData, setOrgData] = useState([]);
	const [userOptions, setUserOptions] = useState([]); //人员备选项

	useEffect(() => {
		// loadOrgData();
		loadUsersData();
		if (tableContainer.current) {
			setY(tableContainer.current.clientHeight - 56);
		}
	}, []);
	const onSearch = (value) => {
		setSearchText(value);
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
	// 表格列
	const columns = [
		{
			title: "姓名",
			dataIndex: "name",
			// ellipsis: true,
			// width: 180,
			// className: styles.AvatarOrNameCell,
			render: (text, row, index) => {
				return (
					<div className={styles.avatarAndNameTagWrap}>
						<AvatarOrName user={row} />
						{row.remark ? (
							<span
								className={
									row.remark === "创建人"
										? styles.creatorTag
										: styles.adminTag
								}
							>
								{" "}
								{row.remark}
							</span>
						) : null}
					</div>
				);
			},
		},

		{
			title: "操作",
			dataIndex: "",
			key: "",
			width: 120,
			render: (text, row, index) => {
				return row.remark === "创建人" ? (
					<Button
						style={{ padding: 0 }}
						type="link"
						onClick={(e) => goTransfer(row)}
					>
						转移
					</Button>
				) : (
					<Button
						style={{ padding: 0, color: "#df4545" }}
						type="link"
						onClick={(e) => goDelete(row)}
					>
						删除
					</Button>
					// <Space>
					// 	<Button
					// 		style={{ padding: 0 }}
					// 		type="link"
					// 		onClick={(e) => goTransfer(row)}
					// 	>
					// 		转移
					// 	</Button>
					// 	<Button
					// 		style={{ padding: 0, color: "#df4545" }}
					// 		type="link"
					// 		onClick={(e) => goDelete(row)}
					// 	>
					// 		删除
					// 	</Button>
					// </Space>
				);
			},
		},
	];

	useEffect(() => {
		loadTableData(searchText);
	}, [searchText]);

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
	const loadTableData = useCallback(
		async (searchText) => {
			// if (!orgId) return;
			let params = {
				size: 100000,
				current: 1,
				search: searchText,
			};
			try {
				setLoading(true);
				let res = await GET_TENANT_ADMIN_LIST_API(params);
				if (!res) {
					message.error("服务器繁忙，请稍后再试...");
					return;
				}
				console.log(res);
				setTableData([...(res?.data?.records ?? [])]);
				// setTotal(res?.data?.total || 0);
				// props.setTotalMembers(res?.data?.total || 0);
				// setPageTotal(res?.data?.pages || 0);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
		[searchText]
	);

	const goAddAdmin = () => {
		const addAdminModal = Modal.confirm({
			modalRender: () => (
				<AddAdminModal
					// orgData={orgData}
					userOptions={userOptions}
					modal={addAdminModal}
					reload={() => {
						loadTableData();
						addAdminModal.destroy();
					}}
				/>
			),
			width: 480,
			height: 320,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
	};
	const goTransfer = (row) => {
		const transferModal = Modal.confirm({
			modalRender: () => (
				<TransferModal
					// orgData={orgData}
					id={row.userId}
					userInfo={props.userInfo}
					userOptions={userOptions}
					modal={transferModal}
					reload={() => {
						loadTableData();
						transferModal.destroy();
					}}
				/>
			),
			width: 480,
			height: 320,
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
	// 处理表格行 移除按钮点击
	const goDelete = (row) => {
		const delModal = Modal.confirm({
			modalRender: () =>
				cusModalRender(
					row.id,
					delModal,
					false,
					"确定要删除该超级管理员吗？"
				),
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
			let res = await DELETE_ADMIN_API(ids);
			if (!res) {
				message.error("服务器繁忙，请稍后再试...");
				return;
			}
			message.success("删除成功！");
			if (mutiple) {
				setSelectedRowKeys([]);
			}
			loadTableData();
		} catch (error) {
			console.log(error);
		} finally {
			modal.destroy();
		}
	};
	return (
		<div className={styles.transferAdmin}>
			<PageBreadcrumb
				pathArr={breadcrumbsPath.transfer}
				title="管理员权限"
			></PageBreadcrumb>
			<div className={styles.content}>
				<div className={styles.transferWrap}>
					<div className={styles.titleWrap}>
						<CusSearch
							onSearch={onSearch}
							onChange={
								(value) => {}
								// setSearchInf((searchInfo) => ({
								// 	...searchInfo,
								// 	query: value,
								// }))
								// setSearchText(value)
							}
							width={383}
							placeholder="请输入姓名手机号查询"
						/>
						<div className={styles.btnWrap}>
							<Button
								size="large"
								onClick={(e) => goAddAdmin()}
								type="primary"
								style={{
									fontSize: 14,
								}}
								icon={<PlusOutlined />}
								// className="cus-btn-48"
							>
								添加超级管理员
							</Button>
						</div>
					</div>
					<div className={styles.tableWrap} ref={tableContainer}>
						<CusTableBasis
							config={tableConfig}
							loading={loading}
							setHoverRowId={setHoverRowId}
							columns={columns}
							dataSource={tableData}
							selectedRowKeys={[]}
							onSelectChange={null}
							y={y}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default connect((state) => ({
	userInfo: state.userInfo,
}))(TransferAdministrator);
