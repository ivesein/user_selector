import React, { useState, useEffect, useRef, useCallback } from "react";
import { message, Button, Space, Pagination, Modal, Drawer } from "antd";
import CusTableBasis from "@/components/CusTableBasis";
import CusSearch from "@/components/CusSearch";

import RankProfessionalForm from "./components/RankProfessionalForm";
import RankProfessionalDetail from "./components/RankProfessionalDetail";

import { connect } from "react-redux";
import CusWarmPrompt from "@/components/CusWarmPrompt";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { GET_BASIC_LIST_API, DELETE_BASIC_API } from "@/api/permApi";
import { TYPE_RANK_PROFESSIONAL } from "../config";
// 职级专业
const RankProfessional = (props) => {
	const [tableData, setTableData] = useState([]); //表格数据
	const [selectedRowKeys, setSelectedRowKeys] = useState([]); //总页数
	const [searchText, setSearchText] = useState(null);

	const [currentPage, setCurrentPage] = useState(1); //当前页
	const [total, setTotal] = useState(0); //总条数
	const [size, setSize] = useState(10); //每页条数
	const [pageTotal, setPageTotal] = useState(0); //总页数
	const [y, setY] = useState(0); //表格容器高度
	const [hoverRowId, setHoverRowId] = useState(null); // 设置当前鼠标移入的行id
	const [loading, setLoading] = useState(false); //表格数据加载loading
	const [currentRow, setCurrentRow] = useState(false); //当前行
	const [visible, setVisible] = useState(false); //详情显隐
	// 表格容器ref
	const tableContainer = useRef(null);
	// 表格配置
	const tableConfig = {
		showSelection: true,
		bordered: false,
		rowKey: "id",
		noPagination: true,
	};
	// 表格列
	const columns = [
		{
			title: "序号",
			dataIndex: "cIndex",
			// ellipsis: true,
			width: 100,
			// className: styles.AvatarOrNameCell,
		},
		{
			title: "职级专业",
			dataIndex: "name",
			key: "name",
			// width: 180,
			ellipsis: true,
		},
		{
			title: "最后修改日期",
			dataIndex: "gmtModified",
			key: "gmtModified",
			width: 220,
			ellipsis: true,
		},
		{
			title: "最后修改用户",
			dataIndex: "modifyer",
			key: "modifyer",
			width: 220,
			ellipsis: true,
		},
		{
			title: "备注",
			dataIndex: "describe",
			key: "describe",
			// width: 200,
			ellipsis: true,
		},
		{
			title: "操作",
			dataIndex: "",
			key: "",
			width: 240,
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
					</Space>
				);
			},
		},
	];
	useEffect(() => {
		if (tableContainer.current) {
			setY(tableContainer.current.clientHeight - 56);
		}
		// let arr = [];
		// for (let index = 0; index < 20; index++) {
		// 	arr.push({
		// 		id: index,
		// 		cIndex: index + 1,
		// 		jobName: "xxx" + index,
		// 		latestModify: "2021-12-02",
		// 		latestModifyer: "Lufeng",
		// 		remark: "这是备注",
		// 	});
		// }
		// setTableData(arr);
		// setTotal(20);
	}, []);

	useEffect(() => {
		loadTableData(size, currentPage);
	}, [currentPage, size]);
	useEffect(() => {
		if (searchText !== null && searchText !== undefined) {
			reloadData();
		}
	}, [searchText]);
	const loadTableData = useCallback(
		async (size, current, search = "") => {
			const params = {
				size,
				current,
				type: TYPE_RANK_PROFESSIONAL,
			};
			if (search) {
				params.search = search;
			}
			try {
				setLoading(true);
				let res = await GET_BASIC_LIST_API(params);
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
				setLoading(false);
			}
		},
		[currentPage, size]
	);
	const onSearch = (value) => {
		setSearchText(value);
	};
	// 处理翻页
	const handlePageChange = (page, pagesize) => {
		setCurrentPage(page);
	};
	const goAddJob = () => {
		const jobModal = Modal.confirm({
			modalRender: () => (
				<RankProfessionalForm
					modal={jobModal}
					reload={() => {
						reloadData();
						jobModal.destroy();
					}}
				/>
			),
			width: 520,
			height: 400,
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
				cusModalRender(row.id, delModal, false, "确定要删除该岗位吗？"),
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
			let res = await DELETE_BASIC_API(ids);
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
	const reloadData = () => {
		if (currentPage === 1) {
			loadTableData(size, currentPage, searchText);
		} else {
			setCurrentPage(1);
		}
	};

	// 处理勾选
	const onSelectChange = (selectedRowKeys, selectedRows) => {
		console.log(selectedRowKeys, selectedRows);
		setSelectedRowKeys(selectedRowKeys);
	};

	// 编辑成员
	const goEdit = (row) => {
		const editJobModal = Modal.confirm({
			modalRender: () => (
				<RankProfessionalForm
					record={row}
					modal={editJobModal}
					reload={() => {
						reloadData();
						editJobModal.destroy();
					}}
				/>
			),
			width: 520,
			height: 400,
			centered: true,
			maskClosable: false,
			destroyOnClose: true,
		});
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
		<div className={styles.jobpreserveWrap}>
			<div className={styles.content}>
				<div className={styles.titleWrap}>
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
						placeholder="请输入要搜索的职级专业"
					/>
					<div className={styles.btnWrap}>
						<Space>
							<Button
								size="large"
								onClick={(e) => goAddJob()}
								type="primary"
								style={{
									fontSize: 14,
								}}
								icon={<PlusOutlined />}
								// className="cus-btn-48"
							>
								新增
							</Button>
							<Button
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
			</div>

			<Drawer
				title="职级专业详情"
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
				<RankProfessionalDetail
					record={currentRow}
					close={closedetail}
				/>
			</Drawer>
		</div>
	);
};

export default connect((state) => ({
	userInfo: state.userInfo,
}))(RankProfessional);
