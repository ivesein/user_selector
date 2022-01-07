import React, { useState, useEffect, useRef } from "react";
import { CheckOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
// 表单元素-选择（可搜索）
const CusFormItemCheckbox = (props) => {
	console.log("props:", props);
	// const [props.value, setCheckedIds] = useState([]);
	const handleClick = (op, index) => {
		// setcIndex(index);
		// props.onChange(icon);
		if (props.value) {
			let theIndex = props.value.findIndex((value) => value === op.id);
			if (theIndex === -1) {
				props.onChange([...props.value, op.id]);
			} else {
				let arr = [...props.value];
				arr.splice(theIndex, 1);
				props.onChange([...arr]);
			}
		}
	};
	// useEffect(() => {
	// 	if (props.icons && props.icons.length && props.value) {
	// 		console.log(">>.>>>", props.value);
	// 		let index = props.icons.findIndex(
	// 			(item) =>
	// 				item.iconBase === props.value ||
	// 				item.iconBase === props.value.iconBase
	// 		);
	// 		setcIndex(index);
	// 	}
	// }, [props]);
	const renderOptions = (options, values) => {
		return (
			options &&
			options.map((op) => (
				<div
					className={`${styles.optionItem}${
						props.value.includes(op.id)
							? " " + styles.optionItemActive
							: ""
					}`}
					onClick={(e) => handleClick(op)}
					key={op.id}
				>
					<span>{op.name}</span>
					{values.includes(op.id) ? (
						<CheckOutlined style={{ marginLeft: 10 }} />
					) : null}
				</div>
			))
		);
	};
	const renderDisplayOptions = (options, values) => {
		// if (options && options.length) {
		// 	const items = options.filter((item) => values.includes(item.id));
		// 	;
		// }
		// let arr = options
		// 	.filter((item) => values.includes(item.id))
		// 	.map((op) => {
		// 		return (
		// 			<div
		// 				className={styles.optionItemActive}
		// 				// onClick={(e) => handleClick(op)}
		// 				key={op.id}
		// 			>
		// 				<span>{op.name}</span>
		// 				<CheckOutlined style={{ marginLeft: 10 }} />
		// 			</div>
		// 		);
		// 	});
		return options
			.filter((item) => values.includes(item.id))
			.map((op) => {
				return (
					<div
						className={`${styles.optionItem} ${styles.optionItemActive}`}
						// onClick={(e) => handleClick(op)}
						key={op.id}
					>
						<span>{op.name}</span>
						<CheckOutlined style={{ marginLeft: 10 }} />
					</div>
				);
			});
	};

	return (
		<div className={styles.optionsWrap}>
			{props.readOnly
				? renderDisplayOptions(props.options, props.value)
				: renderOptions(props.options, props.value)}
			{/* {props.options &&
				props.options.map((op) => (
					<div
						className={`${styles.optionItem}${
							props.value.includes(op.id)
								? " " + styles.optionItemActive
								: ""
						}`}
						onClick={(e) => handleClick(op)}
						key={op.id}
					>
						<span>{op.name}</span>
						{props.value.includes(op.id) ? (
							<CheckOutlined style={{ marginLeft: 10 }} />
						) : null}
					</div>
				))} */}
		</div>
	);
};

export default CusFormItemCheckbox;
