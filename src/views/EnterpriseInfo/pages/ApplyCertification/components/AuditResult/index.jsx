import React from "react";
import styles from "./index.module.scss";
import waiting from "@/asset/img/waiting.png";
import pass from "@/asset/img/pass.png";
import fail from "@/asset/img/fail.png";

const AuditResult = (props) => {
	const auditConfig = {
		1: {
			title: "正在审核中…",
			icon: waiting,
			tip: "企业实名认证正在审核中，预计需要1-3个工作日完成审核！",
		},
		2: {
			title: "审核通过",
			icon: pass,
			tip: "恭喜!您已通过企业实名认证，点击【知道了】查看企业认证信息。",
		},
		3: {
			title: "审核失败",
			icon: fail,
			tip: "您提交的企业实名认证信息有误，请根据失败原因修改并提交审核！",
		},
	};
	return (
		<div className={styles.auditResult}>
			<img
				className={styles.icon}
				src={auditConfig[props.audit].icon}
				alt=""
			/>
			<span
				style={{
					color:
						props.audit === 2
							? "#51c41a"
							: props.audit === 3
							? "#d30000"
							: "#333333",
				}}
				className={styles.title}
			>
				{auditConfig[props.audit].title}
			</span>
			<span className={styles.tip}>{auditConfig[props.audit].tip}</span>
			{props.button ? props.button : null}
		</div>
	);
};

export default AuditResult;
