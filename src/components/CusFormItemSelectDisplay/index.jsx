import React, { useState, useEffect, useRef } from "react";

import { Select } from "antd";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import searchImg from "@/asset/img/search.png";
import downImg from "@/asset/img/down.png";
import penImg from "@/asset/img/editicon.png";

const { Option } = Select;
// 表单元素-选择（可搜索）
const CusFormItemSelectDisplay = (props) => {
	const renderSuffixIcon = (type) => {
		return (
			<img
				// style={{ width: 15, height: 15 }}
				src={
					type === "0"
						? downImg
						: type === "1"
						? searchImg
						: type === "2"
						? penImg
						: downImg
				}
				alt=""
			/>
		);
	};

	return (
		<Select
			getPopupContainer={(triggerNode) => {
				triggerNode.parentNode.parentNode.style.overflow = "visible";
				return triggerNode.parentNode || document.body;
			}}
			size="large"
			disabled={props.disabled}
			value={props.value || null}
			mode={props.mode || null}
			showArrow
			onChange={(e) => props.onChange(e)}
			// filterOption={(input, option) =>
			// 	option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
			// }
			filterOption={false}
			open={false}
			onClick={(e) => props.onClick(e)}
			style={{ width: "100%", fontSize: 14, color: "#2b2b2b" }}
			suffixIcon={renderSuffixIcon(props.suffixIconType)}
		>
			{props?.options?.map((option) => (
				<Option
					key={option.id || option.label}
					value={option.value + ""}
				>
					{option.label}
				</Option>
			))}
		</Select>
	);
};

export default CusFormItemSelectDisplay;
