import React from "react";
import styles from "./index.module.scss";
import closeIcon from "@/asset/img/del.png";
import delIcon from "@/asset/img/garbage.png";
import cannotIcon from "@/asset/img/remove.png";
import warnIcon from "@/asset/img/warning.png";
import { Space } from "antd";

const CusWarmPrompt = (props) => {
	const iconConfig = {
		DELETE: delIcon,
		NO: cannotIcon,
		WARNING: warnIcon,
	};
	return (
		<div className={styles.warmPrompt}>
			<div className={styles.title}>
				<span>{props.title || "温馨提示"}</span>
				<img
					onClick={(e) => props?.modal?.destroy()}
					className={styles.closeIcon}
					src={closeIcon}
					alt=""
				/>
			</div>
			<div className={styles.content}>
				<img
					className={styles.typeIcon}
					src={iconConfig[props.type || "DELETE"]}
					alt=""
				/>
				<div className={styles.infoSpans}>{props.infos}</div>
			</div>
			<div className={styles.footer}>
				<Space>{props.buttons}</Space>
			</div>
		</div>
	);
};

export default CusWarmPrompt;
