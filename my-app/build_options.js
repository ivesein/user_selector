//是否需要修正接口网关转发前缀（如果该项目由多个后台编写，
// 需要多处修正请置false，自行在接口调用时添加对应前缀）
const ifNeedPrefix = false;
exports.PREPRODUCT_BUILD_URL = "http://39.106.45.49"; //测试环境线上地址
exports.PREPRODUCT_BUILD_API_URL = "http://gongluyun.cn"; //测试环境线上地址
exports.TEST_BUILD_URL = "http://192.168.11.121"; //测试环境线上地址
exports.DEV_BUILD_URL = "http://192.168.11.118"; //开发环境线上地址
exports.GATEWAY_URL_PREFIX = ifNeedPrefix ? "/userperm" : ""; //后台服务API接口网关转发修正前缀
exports.OUTPUT_PORT = "31524"; //线上部署访问端口
exports.PREPRODUCT_GATEWAY_PORT = "/gly"; //预生产外网线上部署访问端口
exports.XAPI_PREPRODUCT_GATEWAY_PORT = "/mp"; //预生产外网线上部署访问跨网关端口
exports.GATEWAY_PORT = "30309"; //线上部署后台接口服务网关端口
exports.XAPI_GATEWAY_PORT = "30071"; //线上部署后台接口服务跨网关端口
