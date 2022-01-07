import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import {} from "antd";
import { connect } from "react-redux";
import CusFormItemSelect from "@/components/CusFormItemSelect";
import CusTree from "@/components/CusTree";
import styles from "./index.module.scss";

// 新建自定义角色
const FuncPermission = forwardRef((props, ref) => {
	const [loading, setLoading] = useState(false);
	const [menuIds, setMenuIds] = useState([]);
	const [pmenuIds, setPMenuIds] = useState([]);
	const [checkedNodes, setCheckedNodes] = useState([]);
	const [halfCheckedKeys, setHalfCheckedKeys] = useState([]);
	// const [ifChanged, setIfChanged] = useState(false);
	const [menus, setMenus] = useState([]);
	const [options, setOptions] = useState([]);
	const [currentAppId, setCurrentAppId] = useState(null); //当前所选应用id
	const [treeWrapHeight, setTreeWrapHeight] = useState("100%"); //计算树组件高度
	const ifChangedRef = useRef(false);

	const menuTreeRef = useRef(null);
	const resultRef = useRef(null);
	const treeWrapRef = useRef(null);

	useEffect(() => {
		if (treeWrapRef.current) {
			setTreeWrapHeight(treeWrapRef.current.clientHeight);
		}
	}, []);
	useEffect(() => {
		if (props.checkedKeys) {
			setMenuIds([...props.checkedKeys]);
		}
	}, [props.checkedKeys]);
	useEffect(() => {
		if (props.menuList && props.menuList.length > 0) {
			menuTreeRef.current = [...props.menuList];
			setOptions(
				props.menuList.map((item) => ({
					label: item.menuName,
					value: item.id,
				}))
			);
			setCurrentAppId(props.menuList[0].id);
		}
	}, [props]);
	useEffect(() => {
		if (currentAppId) {
			setMenus(
				menuTreeRef.current.filter((item) => item.id === currentAppId)
			);
			if (resultRef.current && resultRef.current[currentAppId]) {
				setMenuIds([...resultRef.current[currentAppId].menuIds]);
			}
		}
	}, [currentAppId]);
	useImperativeHandle(ref, () => ({
		getFuncPerm: () => {
			let res = [];
			let halfKeys = [];
			if (resultRef.current) {
				res = Object.keys(resultRef.current).reduce(
					(pre, cur) => [...pre, ...resultRef.current[cur].menuIds],
					[]
				);
				halfKeys = Object.keys(resultRef.current).reduce(
					(pre, cur) => [
						...pre,
						...resultRef.current[cur].halfCheckedKeys,
					],
					[]
				);
			}
			return {
				ifChanged: ifChangedRef.current,
				checkedIds: res,
				halfKeys: halfKeys,
			};
		},
	}));
	// 处理应用切换
	const onChange = (value) => {
		setCurrentAppId(value);
	};
	// 处理当前应用的菜单勾选
	const onChecked = (checkedKeys, info) => {
		// setIfChanged(true);
		ifChangedRef.current = true;
		// console.log(`checkedKeys>>>`, checkedKeys);
		// console.log(`info>>>`, info);
		setCheckedNodes([...info.checkedNodes]);
		setHalfCheckedKeys(info.halfCheckedKeys);
		setMenuIds(checkedKeys);
		resultRef.current = {
			// ifChanged: true,
			...resultRef.current,
			[currentAppId]: {
				checkedNodes: [...info.checkedNodes],
				halfCheckedKeys: [...info.halfCheckedKeys],
				menuIds: [...checkedKeys],
			},
		};
		// props.menuResult(resultRef.current);
	};
	// const filterFunc = (node, ids) => {
	// 	return ids.includes(node.key);
	// };

	return (
		<div className={styles.funcPermission}>
			<div className={styles.itemOne}>
				<span className={styles.itemLabel}>授权范围</span>
				<div className={styles.itemFeild}>
					<CusFormItemSelect
						value={currentAppId}
						options={options}
						onChange={onChange}
					/>
				</div>
			</div>
			<div ref={treeWrapRef} className={styles.itemTwo}>
				<span className={styles.itemLabel}>功能权限</span>
				<div className={styles.itemFeild} style={{ marginTop: 5 }}>
					<CusTree
						renderTitle={true}
						checkedKeys={menuIds}
						onCheck={onChecked}
						checkable={!props.readOnly}
						disabled={props.readOnly}
						// selectable={props.readOnly}
						// filterFunc={
						// 	props.filterArr
						// 		? (node) => filterFunc(node, props.filterArr)
						// 		: null
						// }
						// filterArr={props.filterArr}
						// filterNode={props.filterNode}
						treeData={menus}
						height={treeWrapHeight}
					/>
				</div>
			</div>
		</div>
	);
});

export default FuncPermission;
// connect((state) => ({
// 	// menuTree: state.menuTree,
// }))(FuncPermission);
