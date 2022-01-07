import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./index.module.scss";
const CusBreadcrumb = (props) => {
	const history = useHistory();
	const renderBreadcrumb = (pathArr = []) => {
		let paths = [...pathArr];
		let last = paths.pop();
		const pathClick = (path) => {
			if (path.url) {
				history.push({ pathname: path.url });
			}
		};

		return (
			<>
				{paths.map((path) => (
					<span
						key={path.id}
						className={styles.nomalPath}
						onClick={(e) => pathClick(path)}
					>
						{path?.name ?? ""}&nbsp;&nbsp;/&nbsp;&nbsp;
					</span>
				))}
				<span className={styles.lastPath}>{last?.name ?? ""}</span>
			</>
		);
	};

	return (
		<div className={styles.cusBreadcrumb}>
			{renderBreadcrumb(props.pathArr)}
		</div>
	);
};

export default CusBreadcrumb;
