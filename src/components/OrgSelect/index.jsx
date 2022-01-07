import React, {
	useState,
	useEffect,
	useCallback,
	forwardRef,
	useImperativeHandle,
} from "react";
import { Tree } from "antd";
import styles from "./index.module.scss";
import CusSearch from "@/components/CusSearch";
import { CaretDownOutlined, MoreOutlined } from "@ant-design/icons";
import orgIcon from "@/asset/img/tupu.png";
import delIcon from "@/asset/img/garbage2.png";
import { treeFilterToArr } from "../../utils/toolfunc";

const OrgSelect = forwardRef((props, ref) => {
	// const [searchText, setSearchText] = useState(null);
	// const [selectedKeys, setSelectedKeys] = useState([]);
	const [treeData, setTreeData] = useState([]);

	const [checkedKeys, setCheckedKeys] = useState([]);

	const [checkedNodes, setCheckedNodes] = useState([]);
	useEffect(() => {
		if (props.treeData && props.treeData.length > 0) {
			setTreeData([...props.treeData]);
		}
	}, [props.treeData]);
	// 处理搜索
	const onSearch = (value) => {
		if (value === "" || value === undefined || value === null) {
			setTreeData([...props.treeData]);
		} else {
			// 过滤树形数据
			let treeArr = treeFilterToArr(props.treeData, (node) =>
				node.name.includes(value)
			);
			setTreeData(treeArr.map((item) => ({ ...item, children: [] })));
		}
	};
	useImperativeHandle(ref, () => ({
		getCheckedKeys: () => {
			return checkedKeys;
		},
	}));

	// const filterFunc = useCallback(
	// 	(node) => {
	// 		console.log(node);
	// 		return false;
	// 	},
	// 	[props.filterArr]
	// );
	const renderNode = useCallback((node) => {
		return (
			<div
				className={styles.cusNode}
				// onClick={(e) => props.setCurrentOrg(node)}
			>
				<img
					className={styles.nodeIcon}
					src={node.icon || orgIcon}
					alt=""
				/>
				<span className={styles.nodeName}>{node.title}</span>
			</div>
		);
	}, []);
	// const onSelect = (selectedKeys) => {
	// 	// setSelectedKeys(selectedKeys);
	// };
	const onCheck = (checkedKeys, e) => {
		if (props.single) {
			setCheckedKeys([
				checkedKeys.checked[checkedKeys.checked.length - 1],
			]);
			setCheckedNodes([e.checkedNodes[e.checkedNodes.length - 1]]);
		} else {
			setCheckedKeys([...checkedKeys.checked]);
			setCheckedNodes([...e.checkedNodes]);
		}
	};
	const renderCheckedNodes = (nodes) => {
		return (
			nodes &&
			nodes.map((node, index) => {
				return (
					<div key={node.id} className={styles.checkedNodeItem}>
						<img
							className={styles.nodeIcon}
							src={node.icon || orgIcon}
							alt=""
						/>
						<div className={styles.nodeName}>{node.name}</div>
						<img
							onClick={(e) => delSelecedNode(node, index)}
							className={styles.delIcon}
							src={delIcon}
							alt=""
						/>
					</div>
				);
			})
		);
	};
	// 删除已选组织
	const delSelecedNode = (node, index) => {
		let arr = [...checkedNodes];
		arr.splice(index, 1);
		setCheckedNodes(arr);
		setCheckedKeys(checkedKeys.filter((key) => key !== node.key));
	};

	return (
		<div className={styles.orgSelectWrap}>
			<div className={styles.partBox}>
				<span className={styles.title}>选择</span>

				<div className={styles.content}>
					<CusSearch
						onSearch={onSearch}
						onChange={(value) => {}}
						width={"100%"}
						placeholder="请输入关键字"
					/>
					<div className={styles.cusTreeWrap}>
						<Tree
							key={~~(Math.random() * 10)}
							checkStrictly={true}
							style={{ marginTop: 20 }}
							defaultExpandAll
							showLine={false}
							checkedKeys={checkedKeys}
							// selectedKeys={checkedKeys}
							titleRender={(nodeData) => renderNode(nodeData)}
							// filterTreeNode={(node) =>
							// 	node.name.includes(searchText)
							// }
							switcherIcon={
								<CaretDownOutlined
									style={{ fontSize: 16, color: "#999" }}
								/>
							}
							selectable={false}
							checkable={true}
							onCheck={onCheck}
							// onSelect={onSelect}
							treeData={treeData}
							// height={400}
						/>
					</div>
				</div>
			</div>
			<div className={styles.partBox}>
				<span className={styles.title}>已选</span>
				<div className={styles.content}>
					{renderCheckedNodes(checkedNodes)}
				</div>
			</div>
		</div>
	);
});

export default OrgSelect;
