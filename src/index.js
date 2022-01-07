import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import { registerMicroApps } from "qiankun";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
// import getQueryParams from "@/utils/getQueryParams";
// import { checkToken } from "@/api/login";
// import getEntry from "@/utils/getEntry";
// import { message } from "antd";
import store from "@/store";
import { Provider } from "react-redux";
import moment from "moment";
moment.locale("zh-cn", {
	months:
		"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split(
			"_"
		),
	monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
	weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
	weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
	weekdaysMin: "日_一_二_三_四_五_六".split("_"),
	longDateFormat: {
		LT: "HH:mm",
		LTS: "HH:mm:ss",
		L: "YYYY/MM/DD",
		LL: "YYYY年M月D日",
		LLL: "YYYY年M月D日Ah点mm分",
		LLLL: "YYYY年M月D日ddddAh点mm分",
		l: "YYYY/M/D",
		ll: "YYYY年M月D日",
		lll: "YYYY年M月D日 HH:mm",
		llll: "YYYY年M月D日dddd HH:mm",
	},
	meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
	meridiemHour: function (hour, meridiem) {
		if (hour === 12) {
			hour = 0;
		}
		if (meridiem === "凌晨" || meridiem === "早上" || meridiem === "上午") {
			return hour;
		} else if (meridiem === "下午" || meridiem === "晚上") {
			return hour + 12;
		} else {
			// '中午'
			return hour >= 11 ? hour : hour + 12;
		}
	},
	meridiem: function (hour, minute, isLower) {
		var hm = hour * 100 + minute;
		if (hm < 600) {
			return "凌晨";
		} else if (hm < 900) {
			return "早上";
		} else if (hm < 1130) {
			return "上午";
		} else if (hm < 1230) {
			return "中午";
		} else if (hm < 1800) {
			return "下午";
		} else {
			return "晚上";
		}
	},
	calendar: {
		sameDay: "[今天]LT",
		nextDay: "[明天]LT",
		nextWeek: "[下]ddddLT",
		lastDay: "[昨天]LT",
		lastWeek: "[上]ddddLT",
		sameElse: "L",
	},
	dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
	ordinal: function (number, period) {
		switch (period) {
			case "d":
			case "D":
			case "DDD":
				return number + "日";
			case "M":
				return number + "月";
			case "w":
			case "W":
				return number + "周";
			default:
				return number;
		}
	},
	relativeTime: {
		future: "%s内",
		past: "%s前",
		s: "几秒",
		ss: "%d 秒",
		m: "1 分钟",
		mm: "%d 分钟",
		h: "1 小时",
		hh: "%d 小时",
		d: "1 天",
		dd: "%d 天",
		M: "1 个月",
		MM: "%d 个月",
		y: "1 年",
		yy: "%d 年",
	},
	week: {
		// GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
		dow: 1, // Monday is the first day of the week.
		doy: 4, // The week that contains Jan 4th is the first week of the year.
	},
});

// import { registerMicroApps } from "qiankun";
// import getEntry from "@/utils/getEntry";

// console.log("getEntry>>>", getEntry(["30204", "5011"]));
// registerMicroApps([
// 	{
// 		name: "noticeapp",
// 		// entry: isPrd ? baseEntry + ":30204" : baseEntry + ":5011",
// 		entry: getEntry(["30204", "5009"]),
// 		container: "#container",
// 		activeRule: "/index/notice",
// 	},
// 	{
// 		name: "permissionmanageapp",
// 		// entry: isPrd ? baseEntry + ":30202" : baseEntry + ":5009",
// 		entry: getEntry(["30202", "5011"]),
// 		container: "#container",
// 		activeRule: "/index/permission",
// 	},
// 	{
// 		name: "monitorapp",
// 		// entry: isPrd ? baseEntry + ":30203" : baseEntry + ":5010",
// 		entry: getEntry(["30203", "5010"]),
// 		container: "#container",
// 		activeRule: "/index/monitor",
// 	},
// 	{
// 		name: "workflowapp",
// 		// entry: "http://192.168.27.20:5008",
// 		entry: getEntry(["30209", "5008"]),
// 		container: "#container",
// 		activeRule: "/index/workflow",
// 	},
// 	{
// 		name: "systemapp", // app name registered
// 		// entry: isPrd ? baseEntry + ":30201" : baseEntry + ":5005",
// 		entry: getEntry(["30201", "5005"]),
// 		container: "#container",
// 		activeRule: "/index/system",
// 	},
// 	{
// 		name: "roadcloudapp", // app name registered
// 		// entry: isPrd ? baseEntry + ":30201" : baseEntry + ":5005",
// 		entry: getEntry(["30530", "5012"]),
// 		container: "#container",
// 		activeRule: "/index/app",
// 	},
// 	{
// 		name: "enterprisecenterapp", // app name registered
// 		// entry: isPrd ? baseEntry + ":30201" : baseEntry + ":5005",
// 		entry: getEntry(["30531", "5034"]),
// 		container: "#container",
// 		activeRule: "/index/apps",
// 		props: {
// 			loadFrom: "zt",
// 		},
// 	},
// 	{
// 		name: "datawarecenterapp", // app name registered
// 		// entry: isPrd ? baseEntry + ":30201" : baseEntry + ":5005",
// 		entry: getEntry(["30532", "5036"]),
// 		container: "#container",
// 		activeRule: "/index/dataware",
// 	},
// ]);

ReactDOM.render(
	<ConfigProvider locale={zhCN}>
		<Provider store={store}>
			<App />
		</Provider>
	</ConfigProvider>,
	document.getElementById("root")
);
