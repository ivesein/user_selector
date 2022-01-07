import xApi from "@/utils/xApi"
import { GATEWAY_PREFIX_WORKFLOW, PROXY_PREFIX_AUTH } from './prefix'

// 复制流程
const copyProcessUrl = GATEWAY_PREFIX_WORKFLOW + "/processDesign/copyCurrentTenantPresetProcess"
export const copyProcessData = (params) => xApi.post(copyProcessUrl, {})

// 获取《流程设计》列表数据
const getFlowableModelProcessListUrl = GATEWAY_PREFIX_WORKFLOW + "/processDesign/getProcessList"
export const getFlowableModelProcessList = (params) => xApi.get(getFlowableModelProcessListUrl, { params })

// 恢复默认
const syncProcessUrl = GATEWAY_PREFIX_WORKFLOW + "/processDesign/syncProcess"
export const syncProcessData = (params) => xApi.post(syncProcessUrl, params)

// 删除《流程定义》数据
const delFlowableProcessUrl = GATEWAY_PREFIX_WORKFLOW + "/processDefinition/delete"
export const delFlowableProcessData = (params) => xApi.delete(delFlowableProcessUrl, { params })

// 挂起《流程定义》数据
const suspendFlowableProcessUrl = GATEWAY_PREFIX_WORKFLOW + "/processDefinition/suspend"
export const suspendFlowableProcessData = (params) => xApi.put(suspendFlowableProcessUrl, params)

// 激活《流程定义》数据
const activeFlowableProcessUrl = GATEWAY_PREFIX_WORKFLOW + "/processDefinition/activate"
export const activeFlowableProcessData = (params) => xApi.put(activeFlowableProcessUrl, params)

// 获取《表单管理》详情数据
const getFlowableFormDetailUrl = GATEWAY_PREFIX_WORKFLOW + "/form/queryById"
export const getFlowableFormDetail = params => xApi.get(getFlowableFormDetailUrl, { params })

// 新增《仿钉模型设计》
const saveDingModelDataUrl = GATEWAY_PREFIX_WORKFLOW + "/processDesign/makeProcessForm"
export const saveDingModelData = (params) => xApi.post(saveDingModelDataUrl, params)

// 获取《仿钉模型设计》详情
const detailDingModelDataUrl = GATEWAY_PREFIX_WORKFLOW + "/processDesign/fetch"
export const detailDingModelData = (params) => xApi.get(detailDingModelDataUrl, { params })

// 获取《菜单列表》
const getMenuListByPlatformUserUrl = "/userperm/cus_menus/treePage"
export const getMenuListByPlatformUser = (params) => xApi.get(getMenuListByPlatformUserUrl, { params })

// 获取《角色列表》
const getRoleListUrl = PROXY_PREFIX_AUTH + "/jjsk_tenant_role/page";
export const getRoleList = (params) => xApi.get(getRoleListUrl, { params })

// 《获取组织树和用户》
const getTreeAndUserOrgListUrl = PROXY_PREFIX_AUTH + '/jjsk/organization/treeAndUserOrgList'
export const getTreeAndUserOrgList = (params) => xApi.get(getTreeAndUserOrgListUrl, { params })

// 获取《用户详情》
const getUserDetailInfoUrl = PROXY_PREFIX_AUTH + "/api/userInfoById"
export const getUserDetailInfo = params => xApi.get(getUserDetailInfoUrl, { params })

//《发起流程》
const startDetailUrl = GATEWAY_PREFIX_WORKFLOW + "/processDesign/createProcess"
export const startDetailData = params => xApi.get(startDetailUrl, { params })

// 获取《流程定义》表单json数据
const formProcessDefinitionUrl = GATEWAY_PREFIX_WORKFLOW + "/processDefinition/renderedStartForm"
export const formProcessDefinition = params => xApi.get(formProcessDefinitionUrl, { params })