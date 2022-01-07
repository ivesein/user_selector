import React, { useState } from "react";

import { Input } from "antd";
import styles from "./index.module.scss";
const { TextArea } = Input;
// 表单元素-文本输入区域
const CusFormItemTextAear = (props) => {
	const [cv, setCv] = useState("");
	const onChange = (e) => {
		setCv(e.target.value);
		props.onChange(e.target.value);
	};

	return (
		<div
			className={styles.cusFormItemTextAear}
			style={{ width: props.width || "100%" }}
		>
			<TextArea
				value={props.value}
				onChange={onChange}
				placeholder={props.placeholder || "请输入..."}
				maxLength={props.maxLength}
				autoSize={{ minRows: 3, maxRows: 6 }}
				style={{ fontSize: 14 }}
			/>
			<div className={styles.lengthRemaining}>{`${cv.length}/200`}</div>
		</div>
	);
};

export default CusFormItemTextAear;
