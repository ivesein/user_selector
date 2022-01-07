import React, { useState, useEffect } from "react";
import { Row, Col, Table, Pagination } from "antd";
import "./index.scss";
export default function CusTableBasis(props) {
	const [tableY, setTableY] = useState("calc(100vh - 350px)");
	const [hoverRowId, setHoverRowId] = useState(null);

	useEffect(() => {
		// console.log(props.y);
		if (props.dataSource && props.dataSource.length > 0) {
			if (props.y) {
				// 判断表格高度是否超过容器高度 超过添加滚动y高度
				let cHeight = handleTableHeight();
				if (cHeight > props.y) {
					setTableY(props.y);
				} else {
					setTableY("");
				}
			}
		}
	}, [props]);
	// useEffect(() => {
	//     console.log(document.getElementsByClassName("ant-table-wrapper")[0].clientHeight);
	// }, [])
	// 处理表格高度
	const handleTableHeight = () => {
		let ele = document.getElementsByClassName("ant-table-wrapper");
		let height = 0;
		if (ele && ele.length > 0) {
			// let eles = document.getElementsByClassName("ant-table-wrapper");
			// if (eles && eles.length) {
			// 	height = eles[0]?.clientHeight ?? 0;
			// }
			height =
				document.getElementsByClassName("ant-table-wrapper")[0]
					?.clientHeight ?? 0;
		}
		return height;
	};
	const rowSelection = {
		selectedRowKeys: props.selectedRowKeys || [],
		onChange: props.onSelectChange || null,
	};
	const onRow = (record) => {
		return {
			onMouseEnter: (event) => {
				setHoverRowId(record.id);
				props.setHoverRowId(record.id);
			}, // 鼠标移入行
			onMouseLeave: (event) => {
				setHoverRowId(null);
				props.setHoverRowId(null);
			},
		};
	};
	return (
		<div className="cus-table-basis-wrap">
			<Table
				components={props.components || null}
				key={`table-${props.dataSource && props.dataSource.length}`}
				scroll={tableY ? { y: tableY } : null}
				defaultExpandAllRows={props.expandable}
				defaultExpandAllRows={true}
				loading={props.loading}
				pagination={false}
				rowSelection={props.config.showSelection ? rowSelection : null}
				rowKey={props.config.rowKey || "id"}
				bordered={props.config.bordered}
				columns={props.columns}
				onRow={onRow}
				rowClassName={(record, index) => {
					let className = "";
					// className = index % 2 === 0 ? "oddRow" : "evenRow"
					className =
						record.id === hoverRowId ? "cus-row-high-light" : "";

					return className;
				}}
				// defaultExpandedRowKeys={['1']} //默认展开第几层级数据
				expandIconColumnIndex={
					props.config.expandIconColumnIndex
						? props.config.expandIconColumnIndex
						: 1
				}
				dataSource={props.dataSource}
			/>
			{props.config.noPagination ? null : (
				<Row className="margin-top">
					<Col offset={8} span={16}>
						<Pagination
							className="at-right"
							total={props.total}
							showTotal={(total) => `共 ${props.total} 条`}
							current={props.currentPage}
							showSizeChanger
							showQuickJumper
							size="large"
							onChange={props.onCurrentPageChange}
							pageSize={props.pageSize}
							pageSizeOptions={props.pageSizeOptions}
							onShowSizeChange={props.onPageSizeChange}
						/>
					</Col>
				</Row>
			)}
		</div>
	);
}
