const isDEV = process.env.NODE_ENV === "development";
const PROXY_PREFIX = isDEV ? "" : "";
const PROXY_PREFIX_CALENDAR = isDEV ? "/adminApi" : "";
const GATEWAY_PREFIX_NOTICE = "/notification";
export const PREPROD_GATEWAY_PORT = "/mp";
// 通知消息 通知公告等
export const NOTIC_DIC_LIST =
	PROXY_PREFIX + GATEWAY_PREFIX_NOTICE + "/jjsk_notice/page"; // notice列表分页
export const NOTIC_DELETE =
	PROXY_PREFIX + GATEWAY_PREFIX_NOTICE + "/jjsk_notice/del"; // notice删除
export const NOTIC_ADD = PROXY_PREFIX + GATEWAY_PREFIX_NOTICE + "/jjsk_notice"; // notice添加
export const NOTIC_UPDATE =
	PROXY_PREFIX + GATEWAY_PREFIX_NOTICE + "/notice/read"; // notice添加

// 查看通知和消息
export const CHECK_MESSAGE_BY_ID =
	PROXY_PREFIX + GATEWAY_PREFIX_NOTICE + "/message/page";
export const UPDATE_MESSAGE_BY_ID =
	PROXY_PREFIX + GATEWAY_PREFIX_NOTICE + "/message/update";

export const CHECK_NOTICE_BY_ID =
	PROXY_PREFIX + GATEWAY_PREFIX_NOTICE + "/jjsk_notice/page";
export const UPDATE_NOTICE_BY_ID =
	PROXY_PREFIX + GATEWAY_PREFIX_NOTICE + "/notice/read";

// 企业日历
export const GET_CALENDAR =
	PROXY_PREFIX_CALENDAR + "/commons/calender/getCalendar";
export const SAVE_CALENDAR =
	PROXY_PREFIX_CALENDAR + "/commons/calender/clickSave";
