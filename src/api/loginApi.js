import xApi from "@/utils/xApi";
import axios from "axios";
import { PREPROD_GATEWAY_PORT } from "@/api/urlConfig.js";
//登陆
const LOGIN_BY_PWD_URL = "/userauth/jjsk/user/api/no_token/loginByPassword";
export const LOGIN_BY_PWD_API = (params) => xApi.post(LOGIN_BY_PWD_URL, params);

//退出
const LOGOUT_URL = "/userauth/jjsk/user/quit";
export const LOGOUT_API = (params) => xApi.get(LOGOUT_URL, { params });

//根据token获取登陆信息
const GET_LOGININFO_BY_TOKEN_URL = "/userauth/jjsk/manage/skip";
export const GET_LOGININFO_BY_TOKEN_API = (params) => {
	const isPrd = process.env.NODE_ENV === "production";
	const isPreproduct = process.env.CURRENT_BUILD_ENV === "preproduct";

	const base = isPrd ? process.env.ENTRY_PATH : "http://192.168.11.118";
	const gateWayPort = isPreproduct ? PREPROD_GATEWAY_PORT : ":30071";
	return axios.get(base + gateWayPort + GET_LOGININFO_BY_TOKEN_URL, {
		headers: { token: params.token, "X-Tenant-Id": params.tenantId },
	});
};

//获取企业列表
// const GET_TENANT_LIST_URL = "/userauth/tenantInfo/queryTenantList";
// export const GET_TENANT_LIST_API = (params) =>
// 	xApi.get(GET_TENANT_LIST_URL, { params });
const GET_TENANT_LIST_URL = "/userauth/tenantInfo/getManageTenant";
export const GET_TENANT_LIST_API = (params) =>
	xApi.get(GET_TENANT_LIST_URL, { params });

// 发送验证码
const SEND_VERIFY_CODE_URL = "/userauth/jjsk/user/api/no_token/send";
export const SEND_VERIFY_CODE_API = (params) =>
	xApi.get(SEND_VERIFY_CODE_URL, { params });
// 修改密码
const UPDATE_PASSWORD_URL = "/userauth/jjsk/user/api/no_token/findPassword";
export const UPDATE_PASSWORD_API = (params) =>
	xApi.post(UPDATE_PASSWORD_URL, params);
