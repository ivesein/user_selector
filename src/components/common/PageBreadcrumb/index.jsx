import React from "react";
import styles from "./index.module.scss";
import CusBreadcrumb from "../CusBreadcrumb";
// 首页
const PageBreadcrumb = (props) => {
	return (
		<div className={styles.breadcrumbWrap}>
			<CusBreadcrumb pathArr={props.pathArr} />
			<div className={styles.titleAndBtns}>
				<span className={styles.title}>{props.title}</span>
				{props.children}
			</div>
		</div>
	);
};

export default PageBreadcrumb;
