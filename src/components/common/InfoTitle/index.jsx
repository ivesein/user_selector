import React from "react";
import styles from "./index.module.scss";
const InfoTitle = ({ title }) => {
	return (
		<div className={styles.infoTitle}>
			<span>{title}</span>
		</div>
	);
};

export default InfoTitle;
