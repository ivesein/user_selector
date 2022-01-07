import React, { useState, useEffect, useRef } from "react";

import { Select, ConfigProvider } from "antd";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import searchImg from "@/asset/img/search.png";
import downImg from "@/asset/img/down.png";
import zhCN from "antd/lib/locale/zh_CN";
const { Option } = Select;
// 表单元素-选择（可搜索）
const CusFormItemSelect = (props) => {
	console.log("props:", props);
	return (
		<ConfigProvider locale={zhCN}>
			<Select
				getPopupContainer={(triggerNode) => {
					triggerNode.parentNode.parentNode.style.overflow =
						"visible";
					return triggerNode.parentNode || document.body;
				}}
				size="large"
				allowClear
				disabled={props.disabled}
				value={props.value || null}
				showSearch={props.showSearch}
				mode={props.mode || null}
				onChange={(e) => props.onChange(e)}
				filterOption={(input, option) =>
					option.children
						.toLowerCase()
						.indexOf(input.toLowerCase()) >= 0
				}
				style={{
					width: props.width || "100%",
					fontSize: 14,
					color: "#2b2b2b",
				}}
				suffixIcon={
					<img src={props.showSearch ? searchImg : downImg} alt="" />
				}
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
		</ConfigProvider>
	);
};

export default CusFormItemSelect;
