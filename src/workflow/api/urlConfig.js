const PROXY_PREFIX = '/workflow'

export const GET_PROCESS_DETAIL_BY_KEY_URL = PROXY_PREFIX + '/processInstance/getProcessInstanceByBusinessKey'
export const GET_PROCESS_DETAIL_URL = PROXY_PREFIX + '/processInstance/processDetails'
export const TASK_COMPLETE_URL = PROXY_PREFIX + '/task/complete'
export const TASK_ASSIGN_URL = PROXY_PREFIX + '/task/assign'
export const TASK_STOP_URL = PROXY_PREFIX + '/task/stopProcessInstance'
export const TASK_BACK_URL = PROXY_PREFIX + '/task/back'
export const TASK_BACK_NODES_URL = PROXY_PREFIX + '/task/backNodes'
export const PROCESS_REVOKE_BY_KEY_URL = PROXY_PREFIX + '/processInstance/revokeProcessInstanceByBusinessKey'
export const PROCESS_REVOKE_URL = PROXY_PREFIX + '/processInstance/revokeProcessInstanceByInitiator'



