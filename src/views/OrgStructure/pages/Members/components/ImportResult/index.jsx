import React, { useState, useEffect, useCallback, useRef } from "react";
import { Space, Button, Table, ConfigProvider } from "antd";
// import CusTableBasis from "@/components/CusTableBasis";
import styles from "./index.module.scss";
import closeIcon from "@/asset/img/del.png";
import okIcon from "@/asset/img/success.png";
import zhCN from "antd/lib/locale/zh_CN";
// 成员文件导入结构展示
const ImportResult = (props) => {
	const [tableData, setTableData] = useState([
		{
			id: 1,
			name: "张三",
			phone: "13200008888",
			orgName: "xxxx",
		},
		{
			id: 2,
			name: "张三",
			phone: "13200008888",
			orgName: "xxxx",
		},
		{
			id: 3,
			name: "张三",
			phone: "13200008888",
			orgName: "xxxx",
		},
	]); //表格数据
	const [hoverRowId, setHoverRowId] = useState(null); // 设置当前鼠标移入的行id
	const [y, setY] = useState(0); //表格容器高度
	// 表格容器ref
	const tableContainer = useRef(null);
	// 表格配置
	const tableConfig = {
		showSelection: false,
		bordered: false,
		rowKey: "id",
		noPagination: true,
	};
	const columns = [
		{
			title: "姓名",
			dataIndex: "name",
			ellipsis: true,
			width: 150,
			// className: styles.AvatarOrNameCell,
			// render: (text, row, index) => {
			// 	return <AvatarOrName user={row} />;
			// },
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
			dataIndex: "userOrg",
			key: "userOrg",
			// width: 200,
			ellipsis: true,
			render: (text, row, index) => {
				return text ? (
					text
				) : (
					<span style={{ color: "#999999" }}>未分配</span>
				);
			},
		},
	];
	useEffect(() => {
		if (tableContainer.current) {
			setY(tableContainer.current.clientHeight - 56);
		}
	}, []);

	const close = () => {
		props.reload();
	};

	return (
		<div className={styles.importResult}>
			<div className={styles.header}>
				<span>导入结果</span>
				<img
					onClick={(e) => close()}
					className={styles.closeIcon}
					src={closeIcon}
					alt=""
				/>
			</div>
			<div className={styles.content}>
				<div className={styles.resultInfoWrap}>
					{/* <CheckCircleFilled className={styles.successIconfont} /> */}
					<img className={styles.successIcon} src={okIcon} alt="" />
					<div className={styles.infos}>
						<span className={styles.mainInfo}>
							成功新增{props?.result?.allNumber ?? "0"}人
						</span>
						<span className={styles.subInfo}>
							<span className={styles.subInfoItem}>
								有效数为{" "}
								<span className={styles.colorGreen}>
									{props?.result?.sucessNumber ?? "0"}
								</span>
							</span>
							<span className={styles.subInfoItem}>
								无效数为{" "}
								<span className={styles.colorRed}>
									{props?.result?.failNumber ?? "0"}
								</span>
							</span>
							<span className={styles.subInfoItem}>
								重复数为{" "}
								<span className={styles.colorRed}>
									{props?.result?.repeat ?? "0"}
								</span>
							</span>
						</span>
					</div>
				</div>
				<div className={styles.tableTitle}>导入成员预览</div>
				<div className={styles.tableWrap} ref={tableContainer}>
					<ConfigProvider locale={zhCN}>
						<Table
							key={`result-table-${tableData.length}`}
							// config={tableConfig}
							loading={false}
							// setHoverRowId={setHoverRowId}
							columns={columns}
							dataSource={props?.result?.list ?? []}
							selectedRowKeys={[]}
							pagination={false}
							y={y}
						/>
					</ConfigProvider>
				</div>
			</div>
			<div className={styles.footer}>
				<div className={styles.left}></div>
				<div className={styles.right}>
					<Space>
						<Button
							size="large"
							onClick={(e) => close()}
							// disabled={}
							style={{
								fontSize: 14,
							}}
							className="cus-btn-48"
						>
							返回
						</Button>
						<Button
							size="large"
							onClick={(e) => close()}
							style={{
								fontSize: 14,
							}}
							className="cus-btn-48"
							type="primary"
							// className="cus-btn-48"
						>
							确定
						</Button>
					</Space>
				</div>
			</div>
		</div>
	);
};

export default ImportResult;
