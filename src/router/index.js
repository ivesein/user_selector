import {
	AppstoreFilled,
	BellFilled,
	CalendarFilled,
	FundOutlined,
	NotificationOutlined,
	BellOutlined,
	FormOutlined,
	BookOutlined,
	SolutionOutlined,
	BranchesOutlined,
} from "@ant-design/icons";

import indexIcon from "@/asset/img/index.png";
import indexIconActive from "@/asset/img/index_h.png";
import noticeIcon from "@/asset/img/notice.png";
import noticeIconActive from "@/asset/img/notice_h.png";
import orgIcon from "@/asset/img/corg.png";
import orgIconActive from "@/asset/img/corg_h.png";
import roleIcon from "@/asset/img/role.png";
import roleIconActive from "@/asset/img/role_h.png";
import memberIcon from "@/asset/img/member.png";
import memberIconActive from "@/asset/img/member_h.png";
import flowIcon from "@/asset/img/flow.png";
import flowIconActive from "@/asset/img/flow_h.png";
import sysIcon from "@/asset/img/setting.png";
import sysIconActive from "@/asset/img/setting_h.png";
import calendarIcon from "@/asset/img/calendar.png";
import calendarIconActive from "@/asset/img/calendar_h.png";
import companyIcon from "@/asset/img/company.png";
import companyIconActive from "@/asset/img/company_h.png";

import logIcon from "@/asset/img/log.png";
import logIconActive from "@/asset/img/log_h.png";

export const routerIndex = (path) => {
	return [
		{
			title: "首页",
			icon: (
				<img
					src={path !== "/admin/index" ? indexIcon : indexIconActive}
					alt=""
				/>
			),
			key: "/admin/index",
		},
	];
};

export const routerOthers = (path) => {
	return [
		{
			title: "通知公告",
			icon: (
				<img
					src={
						path !== "/admin/notice" ? noticeIcon : noticeIconActive
					}
					alt=""
				/>
			),
			key: "/admin/notice",
		},
		{
			title: "组织架构",
			icon: (
				<img
					src={!path.includes("/admin/org") ? orgIcon : orgIconActive}
					alt=""
				/>
			),
			key: "/admin/org",
			children: [
				{
					title: "角色管理",
					icon: (
						<img
							src={
								path !== "/admin/org/roles"
									? roleIcon
									: roleIconActive
							}
							alt=""
						/>
					),
					key: "/admin/org/roles",
				},
				{
					title: "成员管理",
					icon: (
						<img
							src={
								path !== "/admin/org/members"
									? memberIcon
									: memberIconActive
							}
							alt=""
						/>
					),
					key: "/admin/org/members",
				},
				{
					title: "基础设置",
					icon: (
						<img
							src={
								path !== "/admin/org/basic_setting"
									? sysIcon
									: sysIconActive
							}
							alt=""
						/>
					),
					key: "/admin/org/basic_setting",
				},
			],
		},
		{
			title: "流程设置",
			icon: (
				<img
					src={path !== "/admin/workflow" ? flowIcon : flowIconActive}
					alt=""
				/>
			),
			key: "/admin/workflow",
		},
		{
			title: "系统设置",
			icon: (
				<img
					src={!path.includes("/admin/sys") ? sysIcon : sysIconActive}
					alt=""
				/>
			),
			key: "/admin/sys",
			children: [
				{
					title: "企业日历",
					icon: (
						<img
							src={
								path !== "/admin/sys/calendar"
									? calendarIcon
									: calendarIconActive
							}
							alt=""
						/>
					),
					key: "/admin/sys/calendar",
				},
				{
					title: "企业设置",
					icon: (
						<img
							src={
								path !== "/admin/sys/enterprise_info"
									? companyIcon
									: companyIconActive
							}
							alt=""
						/>
					),
					key: "/admin/sys/enterprise_info",
				},
				{
					title: "操作动态",
					icon: (
						<img
							src={
								path !== "/admin/sys/operation_log"
									? logIcon
									: logIconActive
							}
							alt=""
						/>
					),
					key: "/admin/sys/operation_log",
				},
			],
		},
	];
};
