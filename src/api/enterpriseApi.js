import xApi from "@/utils/xApi";
// import service from "@/utils/service";

import { BASE_FILE } from "./prefix";

//获取企业类型初始化数据
const GET_TENANT_TYPES_URL = "/userauth/tenantType/queryTenantType";
export const GET_TENANT_TYPES_API = (params) =>
	xApi.get(GET_TENANT_TYPES_URL, { params });

//获取组织类型、规模等初始化数据
const GET_OPTIONS_INITINFO_URL = "/userauth/jjsk_tenantinfo_extend/getInitData";
export const GET_OPTIONS_INITINFO_API = (params) =>
	xApi.get(GET_OPTIONS_INITINFO_URL, { params });

//获取组织类型、规模等初始化数据
const GET_TENANT_DETAIL_URL = "/userauth/tenantInfo/queryTenant";
export const GET_TENANT_DETAIL_API = (params) =>
	xApi.get(GET_TENANT_DETAIL_URL, { params });

// 修改企业基本信息/
const UPDATE_TENANT_BASEINFO_URL = "/userauth/tenantInfo/updateTenantInfo";
export const UPDATE_TENANT_BASEINFO_API = (params) =>
	xApi.put(UPDATE_TENANT_BASEINFO_URL, params);

// 上传图片
const UPLOAD_FILE_URL = "/file/no_token/file/upload";
export const UPLOAD_FILE_API = (params) => xApi.post(UPLOAD_FILE_URL, params);

// 发送验证码
const SEND_VERIFY_CODE_URL = "/sysmange/jjsk_sms/send";
export const SEND_VERIFY_CODE_API = (params) =>
	xApi.get(SEND_VERIFY_CODE_URL, { params });
// 验证验证码
const CHECK_VERIFY_CODE_URL = "/userauth/tenantInfo/checkSmsCode";
export const CHECK_VERIFY_CODE_API = (params) =>
	xApi.post(CHECK_VERIFY_CODE_URL, params);

//企业认证提交和修改
const UPLOAD_TENANT_CERTIFICATION_INFO_URL =
	"/userauth/tenantInfo/editBackageInfo";
export const UPLOAD_TENANT_CERTIFICATION_INFO_API = (params) =>
	xApi.put(UPLOAD_TENANT_CERTIFICATION_INFO_URL, params);

// 获取管理员列表
const GET_TENANT_ADMIN_LIST_URL =
	"/userauth/jjsk_tenant_role/getTenantAdminRoleList";
export const GET_TENANT_ADMIN_LIST_API = (params) =>
	xApi.get(GET_TENANT_ADMIN_LIST_URL, { params });

// 添加管理员
const ADD_TENANT_ADMINISTRATOR_URL = "/userauth/jjsk_tenant_role/addAdminUser/";
export const ADD_TENANT_ADMINISTRATOR_API = (id) =>
	xApi.post(ADD_TENANT_ADMINISTRATOR_URL + id);

// 转移管理员检查验证码是否正确/sysmange/jjsk_sms/checkSmsCode
const CHECK_CODE_URL = "/sysmange/jjsk_sms/checkSmsCode";
export const CHECK_CODE_API = (params) => xApi.post(CHECK_CODE_URL, params);

// 转移管理员
const CHANGE_CREATOR_URL = "/userauth/jjsk_tenant_role/changeCreatorRole/";
export const CHANGE_CREATOR_API = (id) => xApi.put(CHANGE_CREATOR_URL + id);

// 删除管理员
const DELETE_ADMIN_URL = "/userauth/jjsk_tenant_role/delAdminUser/";
export const DELETE_ADMIN_API = (id) => xApi.delete(DELETE_ADMIN_URL + id);

// 解散企业
const DISSOLVE_TENTANT_URL = "/userauth/tenantInfo/deleteTenant/";
export const DISSOLVE_TENTANT_API = (name) => {
	return xApi.delete(DISSOLVE_TENTANT_URL + name);
};
// 撤销解散企业
const CANCLE_DISSOLVE_TENTANT_URL = "/userauth/tenantInfo/revokeDelete";
export const CANCLE_DISSOLVE_TENTANT_API = () => {
	return xApi.post(CANCLE_DISSOLVE_TENTANT_URL);
};
