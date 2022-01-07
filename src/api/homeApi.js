import xApi from "@/utils/xApi";
import service from "@/utils/service";
import { PROXY_PREFIX } from "./prefix";

//首页-获取企业统计
const GET_TENANT_NUMBER = "/jjsk/statistical/enterpriseNumber";
export const GET_TENANT_NUMBER_API = (params) =>
	xApi.get("/userauth" + GET_TENANT_NUMBER, { params });

// 企业访问数
const GET_ACCESS_NUMBER = "/sys_log/accessNumber";
export const GET_ACCESS_NUMBER_API = (params) =>
	xApi.get("/logmanage" + GET_ACCESS_NUMBER, { params });

// 使用趋势
const GET_ACCESS_CHART = "/sys_log/accessNumberListByTenantId";
export const GET_ACCESS_CHART_API = (params) =>
	xApi.get("/logmanage" + GET_ACCESS_CHART, { params });

// 经常访问菜单
const GET_SERVICE_LIST = "/sys_log/serviceAccessList";
export const GET_SERVICE_LIST_API = (params) =>
	xApi.get("/logmanage" + GET_SERVICE_LIST, { params });

// 网盘统计
// const GET_DISK_SIZE = "/documentStatistics/documentInfoStatistics";
const GET_DISK_SIZE = "/fileApi/diskSize";
export const GET_DISK_SIZE_API = (params) =>
	service.get(
		PROXY_PREFIX + "/network_disk" + GET_DISK_SIZE,
		params
	);

// 最新动态
const GET_HISTORY_LIST = "/sys_log/tenantHistory";
export const GET_HISTORY_LIST_API = (params) =>
	xApi.get("/logmanage" + GET_HISTORY_LIST, params);

// 企业用户列表
const GET_USER_LIST = "/jjsk/user/getUserListByTenant";
export const GET_USER_LIST_API = (params) =>
	xApi.get("/userauth" + GET_USER_LIST, params);

// 企业日志
const GET_ASSESS_LIST = "/sys_log/accessListByDate";
export const GET_ASSESS_LIST_API = (params) =>
	xApi.post("/logmanage" + GET_ASSESS_LIST, params)