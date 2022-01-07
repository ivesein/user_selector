const {
	override,
	fixBabelImports,
	addWebpackPlugin,
	adjustStyleLoaders,
	addWebpackAlias,
	overrideDevServer,
	addLessLoader,
} = require("customize-cra");

const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const isDEV = process.env.NODE_ENV === "development"; //引入当前的node环境
const BUILD_ENV = process.env.BUILD_ENV; //引入当前的cross-env build环境
const {
	PREPRODUCT_BUILD_URL, //预测试外网环境地址
	TEST_BUILD_URL, //测试环境线上地址
	DEV_BUILD_URL, //开发环境线上地址
	GATEWAY_URL_PREFIX, //后台服务API接口网关转发修正前缀
	OUTPUT_PORT, //内网线上部署访问端口
	PREPRODUCT_BUILD_API_URL,
	GATEWAY_PORT, //内网线上部署后台接口服务端口
	PREPRODUCT_GATEWAY_PORT, //预测试外网环境接口网关端口
	XAPI_PREPRODUCT_GATEWAY_PORT, //预测试外网环境接口跨网关端口
	XAPI_GATEWAY_PORT, //内网线上部署后台接口服务跨网关端口
} = require("./build_options.js");
const devServerConfig = () => (config) => {
	return {
		...config,
		proxy: {
			"/adminApi": {
				target: "http://192.168.11.118:30309",
				changeOrigin: true,
				pathRewrite: {
					"^/adminApi": "",
				},
			},
			"/authApi": {
				target: "http://192.168.11.118:30071",
				changeOrigin: true,
				pathRewrite: {
					"^/authApi": "",
				},
			},
		},
	};
};

module.exports = {
	webpack: override(
		fixBabelImports("import", {
			libraryName: "antd",
			libraryDirectory: "es",
			style: true,
		}),
		addLessLoader({
			lessOptions: {
				javascriptEnabled: true,
				modifyVars: {
					"@primary-color": "#245ff2",
					"@border-radius-base": "0px",
				},
			},
		}),
		addWebpackPlugin(new AntdDayjsWebpackPlugin()),
		addWebpackPlugin(
			new webpack.DefinePlugin({
				"process.env.CURRENT_BUILD_ENV": JSON.stringify(BUILD_ENV),
				"process.env.ENTRY_PORT": isDEV
					? JSON.stringify(process.env.PORT)
					: JSON.stringify(OUTPUT_PORT),
				"process.env.ENTRY_PATH":
					BUILD_ENV === "develop"
						? JSON.stringify(DEV_BUILD_URL)
						: BUILD_ENV === "release"
						? JSON.stringify(TEST_BUILD_URL)
						: BUILD_ENV === "preproduct"
						? JSON.stringify(PREPRODUCT_BUILD_URL)
						: JSON.stringify("http://localhost"),
				"process.env.API_BASE":
					BUILD_ENV === "develop"
						? JSON.stringify(
								DEV_BUILD_URL +
									":" +
									GATEWAY_PORT +
									GATEWAY_URL_PREFIX
						  )
						: BUILD_ENV === "release"
						? JSON.stringify(
								TEST_BUILD_URL +
									":" +
									GATEWAY_PORT +
									GATEWAY_URL_PREFIX
						  )
						: BUILD_ENV === "preproduct"
						? JSON.stringify(
								PREPRODUCT_BUILD_API_URL +
									PREPRODUCT_GATEWAY_PORT +
									GATEWAY_URL_PREFIX
						  )
						: JSON.stringify(""),
				"process.env.XAPI_BASE":
					BUILD_ENV === "develop"
						? JSON.stringify(
								DEV_BUILD_URL +
									":" +
									XAPI_GATEWAY_PORT +
									GATEWAY_URL_PREFIX
						  )
						: BUILD_ENV === "release"
						? JSON.stringify(
								TEST_BUILD_URL +
									":" +
									XAPI_GATEWAY_PORT +
									GATEWAY_URL_PREFIX
						  )
						: BUILD_ENV === "preproduct"
						? JSON.stringify(
								PREPRODUCT_BUILD_API_URL +
									XAPI_PREPRODUCT_GATEWAY_PORT +
									GATEWAY_URL_PREFIX
						  )
						: JSON.stringify(""),
			})
		),
		adjustStyleLoaders((rule) => {
			if (rule.test.toString().includes("scss")) {
				rule.use.push({
					loader: require.resolve("sass-resources-loader"),
					options: {
						resources: ["./src/styles/main.scss"],
					},
				});
			}
		}),
		addWebpackAlias({
			["@"]: path.resolve(__dirname, "src"),
		})
	),
	devServer: overrideDevServer(devServerConfig()),
};
