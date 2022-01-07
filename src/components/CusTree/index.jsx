import React, { useEffect, useCallback } from "react";
import { Tree } from "antd";

const CusTree = (props) => {
	const options = {
		0: {
			name: "菜单",
			color: "#86d65f",
			background: "#f0faf2",
			border: "1px solid #86d65f",
		},
		1: {
			name: "按钮",
			color: "#f1924e",
			background: "#fef4ed",
			border: "1px solid #f1924e",
		},
		2: {
			name: "应用",
			color: "#245ff2",
			background: "#eff3ff",
			border: "1px solid #7EA8F8",
		},
	};
	const renderCusTilte = useCallback(
		(node) => {
			return (
				<div>
					<span>{node.title}</span>
					<div
						style={{
							display: "inline-flex",
							justifyContent: "center",
							alignItems: "center",
							width: "40px",
							height: "20px",
							fontSize: 14,
							color: options[node.type].color,
							backgroundColor: options[node.type].background,
							border: options[node.type].border,
							marginLeft: 8,
						}}
					>
						{options[node.type].name}
					</div>
				</div>
			);
		},
		[props.treeData]
	);
	// const filterFunc = useCallback(
	// 	(node) => {
	// 		console.log(node);
	// 		return false;
	// 	},
	// 	[props.filterArr]
	// );
	return (
		<Tree
			// checkStrictly={true}
			key={`tree-${props.treeData && props.treeData.length}`}
			checkable={props.checkable || false}
			selectable={props.selectable}
			// disabled={props.disabled}
			checkedKeys={props.checkedKeys}
			onCheck={props.onCheck}
			treeData={props.treeData || []}
			titleRender={
				props.renderTitle ? (node) => renderCusTilte(node) : null
			}
			// filterTreeNode={
			// 	props.filterNode
			// 		? (node) => filterFunc(node, props.filterArr)
			// 		: null
			// }
			// selectedKeys={props.selectedKeys}
			defaultExpandAll={true}
			height={props.height || 260}
		/>
	);
};

export default CusTree;
