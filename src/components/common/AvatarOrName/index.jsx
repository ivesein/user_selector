import React from "react";
import styles from "./index.module.scss";
const AvatarOrName = (props) => {
	return props.user ? (
		<div className={styles.avatarNameWarp}>
			<div className={styles.avatar}>
				{props?.user?.avatar ? (
					<img
						className={styles.avatarImg}
						src={props.user.avatar}
						alt=""
					/>
				) : (
					<span className={styles.nicknameone}>
						{props?.user?.nickname
							? props.user.nickname[0]
							: props.user && props.user.name
							? props.user.name[0]
							: ""}
					</span>
				)}
			</div>
			<span
				title={props?.user?.nickname || props?.user?.name}
				className={styles.nickname}
			>
				{props?.user?.nickname || props?.user?.name}
			</span>
			{props.showTag && props?.user?.remark ? (
				<div className={styles.tag}>{props?.user?.remark}</div>
			) : null}
		</div>
	) : null;
};

export default AvatarOrName;
