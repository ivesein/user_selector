const isDEV = process.env.NODE_ENV === "development";
export const PROXY_PREFIX = isDEV ? "/adminApi" : "";
export const PROXY_PREFIX_AUTH = (isDEV ? "" : "") + "/userauth";
export const GATEWAY_PREFIX_FILE = "/file/no_token";
export const GATEWAY_PREFIX_WORKFLOW = "/workflow";
export const PROXY_PREFIX_AUTH_INVITE = "/userauth";

export const BASE_FILE =
	(isDEV ? "http://192.168.11.118" : process.env.ENTRY_PATH) +
	":30071/file/no_token/file/upload";
