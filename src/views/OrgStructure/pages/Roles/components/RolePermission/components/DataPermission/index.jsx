import React, {
	useState,
	useEffect,
	useRef,
	useImperativeHandle,
	forwardRef,
} from "react";
import {} from "antd";
import { connect } from "react-redux";
import CusFormItemSelect from "@/components/CusFormItemSelect";
import CusTree from "@/components/CusTree";
import styles from "./index.module.scss";

// 新建自定义角色
const DataPermission = forwardRef((props, ref) => {
	// const [loading, setLoading] = useState(false);
	const [options, setOptions] = useState([
		//权限类型（0：全部 1：本级 2：本级及子级 3：自定义）
		{
			label: "全部",
			value: "0",
		},
		{
			label: "本级",
			value: "1",
		},
		{
			label: "本级及子级",
			value: "2",
		},
		{
			label: "自定义",
			value: "3",
		},
	]);
	const [type, setType] = useState("0");
	const [checkedKeys, setCheckedKeys] = useState([]);
	const [treeWrapHeight, setTreeWrapHeight] = useState("100%"); //计算树组件高度
	const treeWrapRef = useRef(null);
	const ifChangedRef = useRef(false);
	useEffect(() => {
		if (treeWrapRef.current) {
			setTreeWrapHeight(treeWrapRef.current.clientHeight);
		}
	}, []);

	useEffect(() => {
		if (props.dataPermInfo && props.dataPermInfo.type) {
			setType(props.dataPermInfo.type);
			setCheckedKeys([...props.dataPermInfo.orgIds]);
		}
	}, [props.dataPermInfo]);
	useImperativeHandle(ref, () => ({
		getDataPerm: () => {
			return {
				ifChanged: ifChangedRef.current,
				type,
				checkedKeys,
			};
		},
	}));
	// 处理应用切换
	const onChange = (value) => {
		// setCurrentAppId(value);
		ifChangedRef.current = true;
		setType(value);
		if (value !== "3") {
			setCheckedKeys([]);
		}
	};
	const onChecked = (checked) => {
		console.log(checked);
		setCheckedKeys([...checked]);
	};

	return (
		<div className={styles.dataPermission}>
			<div className={styles.item}>
				<span className={styles.itemLabel}>授权范围</span>
				<div className={styles.itemFeild}>
					<CusFormItemSelect
						disabled={props.readOnly}
						value={type}
						options={options}
						onChange={onChange}
					/>
				</div>
			</div>
			{type === "3" ? (
				<div
					className={styles.item}
					ref={treeWrapRef}
					style={{ flex: 1 }}
				>
					<span className={styles.itemLabel}>授权企业：</span>
					<div className={styles.itemFeild} style={{ marginTop: 5 }}>
						<CusTree
							checkedKeys={checkedKeys}
							onCheck={onChecked}
							checkable={!props.readOnly}
							treeData={props.treeData || []}
							height={treeWrapHeight}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
});

export default DataPermission;
