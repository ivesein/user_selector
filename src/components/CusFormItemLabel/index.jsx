import React from "react";
import styles from "./index.module.scss";
import requiredIcon from "@/asset/img/required.png";
// 表单元素-标签
const CusFormItemLabel = (props) => {
	return (
		<div className={styles.cusFormItemLabel}>
			<p className={styles.labelText}>{props.label}</p>
			<div className={styles.requiredmarkWrap}>
				{props.required ? (
					<img
						className={styles.labelRequiredMark}
						src={requiredIcon}
						alt=""
					/>
				) : null}
			</div>
		</div>
	);
};

export default CusFormItemLabel;
