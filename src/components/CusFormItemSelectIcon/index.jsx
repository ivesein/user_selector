import React, { useState, useEffect, useRef } from "react";

import styles from "./index.module.scss";
// 表单元素-选择（可搜索）
const CusFormItemSelectIcon = (props) => {
	console.log("props:", props);
	const [cIndex, setcIndex] = useState(null);
	const handleClick = (icon, index) => {
		setcIndex(index);
		props.onChange(icon);
	};
	useEffect(() => {
		if (props.icons && props.icons.length && props.value) {
			console.log(">>.>>>", props.value);
			let index = props.icons.findIndex(
				(item) =>
					item.iconBase === props.value ||
					item.iconBase === props.value.iconBase
			);
			setcIndex(index);
		}
	}, [props]);

	return (
		<div className={styles.iconsWrap}>
			{props.icons &&
				props.icons.map((icon, index) => (
					<div
						className={`${styles.iconItem}${
							index === cIndex ? " " + styles.iconItemActive : ""
						}`}
						onClick={(e) => handleClick(icon, index)}
						key={icon.id}
					>
						<img src={icon.iconBase} alt="" />
					</div>
				))}
		</div>
	);
};

export default CusFormItemSelectIcon;
