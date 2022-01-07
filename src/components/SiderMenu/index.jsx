import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Menu } from "antd";
import "./index.scss";
const { SubMenu } = Menu;

const SiderMenu = ({ router, path }) => {
	const renderMenu = (data) => {
		//循环这个数据，拿到这个数据的结果；
		return data.map((item, index) => {
			//如果子项里含有children属性，递归循环这个属性拿到子节点；
			if (item.children) {
				return (
					<SubMenu icon={item.icon} key={item.key} title={item.title}>
						{renderMenu(item.children)}
					</SubMenu>
				);
			} else {
				// 否则正常返回
				return (
					<Menu.Item icon={item.icon} key={item.key}>
						{<Link to={item.key}>{item.title}</Link>}
					</Menu.Item>
				);
			}
		});
	};
	const handleClick = (params) => {};
    const history = useHistory()

	return (
		<Menu
			className="cus-sider-menu"
			onClick={handleClick}
			style={{ width: "100%" }}
			// defaultSelectedKeys={["/admin/index"]}
			// defaultOpenKeys={["1"]}
			selectedKeys={[path, history.location.state?.homePath]}
			theme="light"
			mode="inline"
		>
			{renderMenu(router)}
		</Menu>
	);
};

export default SiderMenu;
