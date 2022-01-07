import xApi from "@/utils/xApi";
import service from "@/utils/service";

import { PROXY_PREFIX, PROXY_PREFIX_AUTH, GATEWAY_PREFIX_FILE } from "./prefix";

//获取租户菜单树
const GET_TENANT_USERTREE_URL = "/userauth/tenant_menu/user_tree";
export const GET_TENANT_USERTREE_API = (params) =>
	xApi.get(GET_TENANT_USERTREE_URL, { params });

//获取租户菜单树
const GET_TENANT_ORGTREE_URL = "/userauth/api/no_token/org/getTreeByTenantId";
export const GET_TENANT_ORGTREE_API = (params) =>
	xApi.get(GET_TENANT_ORGTREE_URL, { params });

//获取角色列表 分页
const GET_ROLE_LIST_WITH_PAGE_URL = "/userauth/jjsk_tenant_role/tenantRolePage";
export const GET_ROLE_LIST_WITH_PAGE_API = (params) =>
	xApi.get(GET_ROLE_LIST_WITH_PAGE_URL, { params });

//新增角色
const CREATE_ROLE_URL = "/userauth/jjsk_tenant_role/allInfo/";
export const CREATE_ROLE_API = (params) => xApi.post(CREATE_ROLE_URL, params);

//编辑角色
const EDIT_ROLE_URL = "/userauth/jjsk_tenant_role/allInfo";
export const EDIT_ROLE_API = (params) => xApi.put(EDIT_ROLE_URL, params);

//删除角色
const DELETE_ROLE_URL = "/userauth/jjsk_tenant_role/allInfo/";
export const DELETE_ROLE_API = (params) =>
	xApi.delete(DELETE_ROLE_URL + params.id);

// 角色详情 ROLE_DETAIL_API
const ROLE_DETAIL_URL = "/userauth/jjsk_tenant_role/allInfo/";
export const ROLE_DETAIL_API = (params) =>
	xApi.get(ROLE_DETAIL_URL + params.id);

// 角色成员列表
const GET_ROLE_MEMBERS_URL = "/userauth/jjsk_tenant_user/getUserByRoleId";
export const GET_ROLE_MEMBERS_API = (params) =>
	xApi.get(GET_ROLE_MEMBERS_URL, { params });

// 获取组织架构人员数据 新
export const USER_ORG_LIST_URL =
	"/userauth/jjsk/organization/treeAndTenantUserOrgList";
export const USER_ORG_LIST_API = () => {
	return xApi.get(USER_ORG_LIST_URL);
};
// 获取组织架构人员数据 旧
export const USER_ORG_LIST_OLD_URL =
	"/userauth/jjsk/organization/treeAndUserOrgList";
export const USER_ORG_LIST_OLD_API = () => {
	return xApi.get(USER_ORG_LIST_OLD_URL);
};

// 角色添加人员 jjsk_tenant_role/saveRoleUser
export const ROLE_ADD_MEMBERS_URL = "/userauth/jjsk_tenant_role/saveRoleUser";
export const ROLE_ADD_MEMBERS_API = (params) => {
	return xApi.post(ROLE_ADD_MEMBERS_URL, params);
};

// 删除角色人员 jjsk_tenant_role/saveRoleUser
export const DELETE_ROLE_MEMBERS_URL = "/userauth/jjsk_tenant_role/delRoleUser";
export const DELETE_ROLE_MEMBERS_API = (params) => {
	return xApi.post(DELETE_ROLE_MEMBERS_URL, params);
};
// -----------------------------------成员管理 组织管理---------------------------------------------
// 获取企业组织架构树
export const GET_TENANT_ORG_TREE_URL = "/userauth/jjsk/organization/tree";
export const GET_TENANT_ORG_TREE_API = (params) => {
	return xApi.get(GET_TENANT_ORG_TREE_URL, { params });
};

// 获取企业成员列表不分页
export const GET_TENANT_USERS_URL =
	"/userauth/jjsk_tenant_user/getUserByTenant";
export const GET_TENANT_USERS_API = (params) => {
	return xApi.get(GET_TENANT_USERS_URL, { params });
};

// 获取组织下成员
export const GET_ORG_MEMBERS_URL =
	"/userauth/jjsk/organization/userListByOrgId";
export const GET_ORG_MEMBERS_API = (params) => {
	return xApi.get(GET_ORG_MEMBERS_URL, { params });
};

// 添加成员
export const ADD_MEMBERS_URL = "/userauth/jjsk/manage/addMember";
export const ADD_MEMBERS_API = (params) => {
	return xApi.post(ADD_MEMBERS_URL, params);
};

// 获取成员详情
export const GET_USER_DETAIL_URL = "/userauth/jjsk_tenant_user/queryTenantUser";
export const GET_USER_DETAIL_API = (params) => {
	return xApi.get(GET_USER_DETAIL_URL, { params });
};

// 编辑成员
export const EDIT_MEMBERS_URL = "/userauth/jjsk_tenant_user/updateCompanyUser";
export const EDIT_MEMBERS_API = (params) => {
	return xApi.put(EDIT_MEMBERS_URL, params);
};

// 删除成员
export const DELETE_MEMBER_URL = "/userauth/jjsk_tenant_user/delTenantUser/";
export const DELETE_MEMBER_API = (id) => {
	return xApi.delete(DELETE_MEMBER_URL + id);
};

// 选择成员变更部门 jjsk/organization/exchangeUserOrg
export const EXCHANGE_MEMBER_ORG_URL =
	"/userauth/jjsk/organization/exchangeUserOrg";
export const EXCHANGE_MEMBER_ORG_API = (params) => {
	return xApi.post(EXCHANGE_MEMBER_ORG_URL, params);
};

// 成员导入导出  成员模板文件列表
export const GET_TEMPLATE_FILE_URL =
	"/roadcloudconfiguration/jjsk/wbs/file/list?tag=batchImportUser&current=1&size=1";
export const GET_TEMPLATE_FILE_API = () => {
	return xApi.get(GET_TEMPLATE_FILE_URL);
};

// 成员导入导出  导入excel文件
export const IMPORT_EXCEL_FILE_URL =
	"/userauth/jjsk/user/batchImportUserBytenantId";
export const IMPORT_EXCEL_FILE_API = (params) => {
	return xApi.post(IMPORT_EXCEL_FILE_URL, params);
};

// 成员导入导出  导出企业用户excel文件
export const EXPORT_EXCEL_FILE_URL =
	"/userauth/jjsk/user/batchExportUserBytenantId";
export const EXPORT_EXCEL_FILE_API = () => {
	return xApi.get(EXPORT_EXCEL_FILE_URL);
};

// 未激活成员发送短信邀请
export const SEND_INVITE_MSG_URL = "/userauth/jjsk/manage/invite";
export const SEND_INVITE_MSG_API = (params) => {
	return xApi.get(SEND_INVITE_MSG_URL, { params });
};

// 获取组织图标列表
export const GET_ORG_ICONS_URL =
	"/sysmange/jjsk_Icon/page?size=10000&current=1&type=3";
export const GET_ORG_ICONS_API = () => {
	return xApi.get(GET_ORG_ICONS_URL);
};

// 新增组织
export const ADD_ORG_URL = "/userauth/jjsk/organization/add";
export const ADD_ORG_API = (params) => {
	return xApi.post(ADD_ORG_URL, params);
};

// 编辑组织
export const EDIT_ORG_URL = "/userauth/jjsk/organization/modify";
export const EDIT_ORG_API = (params) => {
	return xApi.post(EDIT_ORG_URL, params);
};
// 删除组织 DELETE_ORG_API
export const DELETE_ORG_URL = "/userauth/jjsk/organization/delete";
export const DELETE_ORG_API = (params) => {
	return xApi.post(DELETE_ORG_URL, params);
};

// 获取组织详情
export const GET_ORG_DETAIL_URL = "/userauth/jjsk/organization/detail";
export const GET_ORG_DETAIL_API = (params) => {
	return xApi.get(GET_ORG_DETAIL_URL, { params });
};

// ----------------------------------基础设置--------------------------------------------
// 获取基础设置信息列表 根据类型
export const GET_BASIC_LIST_URL = "/userauth/jjsk_basicdata/getBaseDataList";
export const GET_BASIC_LIST_API = (params) => {
	return xApi.get(GET_BASIC_LIST_URL, { params });
};

// 基础信息新增
export const SAVE_BASIC_INFO_URL = "/userauth/jjsk_basicdata/saveBaseData";
export const SAVE_BASIC_INFO_API = (params) => {
	return xApi.post(SAVE_BASIC_INFO_URL, params);
};

// 基础信息编辑
export const UPDATE_BASIC_INFO_URL = "/userauth/jjsk_basicdata/updateBaseData";
export const UPDATE_BASIC_INFO_API = (params) => {
	return xApi.put(UPDATE_BASIC_INFO_URL, params);
};

// 基础信息删除
export const DELETE_BASIC_URL = "/userauth/jjsk_basicdata/";
export const DELETE_BASIC_API = (id) => {
	return xApi.delete(DELETE_BASIC_URL + id);
};
