import React, { useState, useEffect, useCallback } from "react";
import { message, Spin, Tree, Popover } from "antd";
import { CaretDownOutlined, MoreOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import orgIcon from "@/asset/img/tupu.png";
const OrgTree = (props) => {
	const [selectedKeys, setSelectedKeys] = useState([]);
	// const [treeData, setTreeData] = useState([]);
	const renderNodeMoreControls = (node) => {
		return (
			<div className={styles.nodeControlWrap}>
				{node.parentId === "0" ? null : (
					<div
						onClick={(e) => props.handleNodeControl("EDIT", node)}
						className={styles.nodeControlBtn}
					>
						编辑组织
					</div>
				)}

				<div
					onClick={(e) => props.handleNodeControl("ADD_CHILD", node)}
					className={styles.nodeControlBtn}
				>
					添加子组织
				</div>
				<div
					onClick={(e) => props.handleNodeControl("DETAIL", node)}
					className={styles.nodeControlBtn}
				>
					查看详情
				</div>
				{node.parentId === "0" ? null : (
					<div
						onClick={(e) => props.handleNodeControl("DELETE", node)}
						className={`${styles.nodeControlBtn} ${styles.nodeControlBtnDanger}`}
					>
						移除
					</div>
				)}
			</div>
		);
	};
	useEffect(() => {
		if (props.treeData && props.treeData.length > 0) {
			setSelectedKeys([props.treeData[0].key]);
		}
	}, [props.treeData]);
	const renderNode = useCallback(
		(node, selectedKeys) => {
			return (
				<div
					className={styles.cusNode}
					onClick={(e) => props.setCurrentOrg(node)}
				>
					<img
						className={styles.nodeIcon}
						src={node.icon || orgIcon}
						alt=""
					/>
					<div className={styles.nodeName}>
						<span>{node.title}</span>
					</div>
					<div className={styles.nodeMoreControls}>
						<Popover
							placement="bottomRight"
							title={null}
							content={renderNodeMoreControls(node)}
							trigger="hover"
							id="nodePopover"
						>
							<MoreOutlined
								style={{
									color: selectedKeys.includes(node.key)
										? "#245ff2"
										: "#666",
								}}
							/>
						</Popover>
					</div>
				</div>
			);
		},
		[selectedKeys]
	);
	const onExpand = () => {
		console.log("Trigger Expand");
	};
	const onSelect = (selectedKeys) => {
		setSelectedKeys(selectedKeys);
	};
	return (
		<div className={styles.cusTree}>
			<Tree
				style={{ marginTop: 20 }}
				defaultExpandAll
				showLine={false}
				selectedKeys={selectedKeys}
				// blockNode={true}

				titleRender={(nodeData) => renderNode(nodeData, selectedKeys)}
				switcherIcon={
					<CaretDownOutlined
						style={{ fontSize: 16, color: "#999" }}
					/>
				}
				onSelect={onSelect}
				onExpand={onExpand}
				treeData={props.treeData}
			/>
		</div>
	);
};

export default OrgTree;
