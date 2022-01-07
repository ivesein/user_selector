import xApi from "@/utils/xApi"
import { PROXY_PREFIX_AUTH_INVITE } from './prefix'

// 获取邀请链接
const getCodeAndUrl = PROXY_PREFIX_AUTH_INVITE + "/jjsk/manage/createCodeAndURL"
export const getCodeAndUrlApi = (params) => xApi.post(getCodeAndUrl, params)

// 刷新邀请链接
const refreshCodeAndUrl = PROXY_PREFIX_AUTH_INVITE + "/jjsk/manage/refreshCodeAndURLNew"
export const refreshCodeAndUrlApi = (params) => xApi.put(refreshCodeAndUrl, params)

// 禁用或启用邀请链接
const changeCodeState = PROXY_PREFIX_AUTH_INVITE + "/jjsk/manage/changeCodeState?code="
export const changeCodeStateApi = (params) => xApi.put(changeCodeState + params.code + '&valid=' + params.valid)

// 申请列表
const getApplyListUrl = PROXY_PREFIX_AUTH_INVITE + "/jjsk/manage/applyList";
export const getApplyListApi = (params) => xApi.get(getApplyListUrl, { params })

// 通过或拒绝申请
const handleApplyUrl = PROXY_PREFIX_AUTH_INVITE + "/jjsk/manage/handleApply"
export const handleApplyApi = (params) => xApi.put(handleApplyUrl, params)

// const delFlowableProcessUrl = GATEWAY_PREFIX_WORKFLOW + "/processDefinition/delete"
// export const delFlowableProcessData = (params) => xApi.delete(delFlowableProcessUrl, { params })





