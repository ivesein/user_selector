import React from "react";
import styles from "./index.module.scss";
const CusFormItemDisplay = (props) => {
	return (
		<div
			style={{ width: props.width || "100%" }}
			className={styles.cusFormItemDisplay}
		>
			{props.value}
		</div>
	);
};

export default CusFormItemDisplay;
