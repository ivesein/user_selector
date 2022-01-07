import React, { useState, useEffect, useRef } from "react";

import { Input } from "antd";
import styles from "./index.module.scss";
// 表单元素-文本输入区域
const CusFormItemInput = (props) => {
	const onChange = (e) => {
		props.onChange(e.target.value);
	};

	return (
		<div className={styles.cusFormItemTextAear}>
			<Input
				size="large"
				value={props.value || ""}
				onChange={onChange}
				maxLength={props.maxLength}
				disabled={props.disabled}
				suffix={props.suffix || null}
				style={{
					width: props.width || "100%",
					fontSize: 14,
					color: "#2b2b2b",
				}}
				placeholder={props.placeholder || "请输入..."}
			/>
		</div>
	);
};

export default CusFormItemInput;
