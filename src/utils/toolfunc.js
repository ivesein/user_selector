// 判断是否已登录
export const loggedIn = () => {
	// console.log(localStorage.getItem("userInfo"));
	return localStorage.getItem("userInfo") ? true : false;
};
// 截取url参数
export const getQueryParams = (variable) => {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] === variable) {
			return pair[1];
		}
	}
	return false;
};

export function logout() {
	localStorage.clear();
	const BUILD_ENV = process.env.CURRENT_BUILD_ENV;
	const env = process.env.ENTRY_PATH;
	const port = process.env.ENTRY_PORT;
	let loginUrl =
		BUILD_ENV === "preproduct"
			? "http://admin.gongluyun.cn"
			: `${env}:${port}/login`;
	window.location.href = loginUrl;
}
export function getUserCache(key) {
	let userinfo = localStorage.getItem(key);
	if (userinfo !== "" && userinfo !== undefined && userinfo !== null) {
		if (
			Object.prototype.toString.call(JSON.parse(userinfo)) ===
			"[object Object]"
		) {
			return JSON.parse(userinfo);
		}
		return userinfo;
	} else {
		// logout();
		return false;
	}
}
export function checkUserType() {
	let user = getUserCache("userInfo");
	if (user) {
		return user.tenantId === "1";
	} else {
		logout();
	}
}
export function getIPs(onNewIP) {
	var RTCPeerConnection =
		window.RTCPeerConnection ||
		window.webkitRTCPeerConnection ||
		window.mozRTCPeerConnection;
	if (RTCPeerConnection)
		(() => {
			var rtc = new RTCPeerConnection();
			rtc.createDataChannel(""); //创建一个可以发送任意数据的数据通道
			rtc.createOffer(
				(offerDesc) => {
					//创建并存储一个sdp数据
					rtc.setLocalDescription(offerDesc);
				},
				(e) => {
					console.log(e);
				}
			);
			rtc.onicecandidate = (evt) => {
				//监听candidate事件
				if (evt.candidate) {
					var ip_addr = evt.candidate.address;
					localStorage.setItem("ip_addr", ip_addr);
				}
			};
		})();
	else {
		console.log("目前仅测试了chrome浏览器OK");
	}
}

export function getIPss(callback) {
	var ip_dups = {};

	//compatibility for firefox and chrome
	var RTCPeerConnection =
		window.RTCPeerConnection ||
		window.mozRTCPeerConnection ||
		window.webkitRTCPeerConnection;
	var useWebKit = !!window.webkitRTCPeerConnection;

	//bypass naive webrtc blocking using an iframe
	if (!RTCPeerConnection) {
		//NOTE: you need to have an iframe in the page right above the script tag
		//
		//<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
		//<script>...getIPs called in here...
		//
		var iframe = document.createElement("iframe");
		//invalidate content script
		iframe.sandbox = "allow-same-origin";
		iframe.style.display = "none";
		var win = iframe.contentWindow;
		RTCPeerConnection =
			win.RTCPeerConnection ||
			win.mozRTCPeerConnection ||
			win.webkitRTCPeerConnection;
		useWebKit = !!win.webkitRTCPeerConnection;
	}

	//minimal requirements for data connection
	var mediaConstraints = {
		optional: [{ RtpDataChannels: true }],
	};

	var servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };

	//construct a new RTCPeerConnection
	var pc = new RTCPeerConnection();

	function handleCandidate(candidate) {
		//match just the IP address
		var ip_regex =
			/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
		var ip_addr = ip_regex.exec(candidate)[1];

		//remove duplicates
		if (ip_dups[ip_addr] === undefined) callback(ip_addr);

		ip_dups[ip_addr] = true;
	}

	//listen for candidate events
	pc.onicecandidate = function (ice) {
		//skip non-candidate events
		if (ice.candidate) handleCandidate(ice.candidate.candidate);
	};

	//create a bogus data channel
	pc.createDataChannel("");

	//create an offer sdp
	pc.createOffer(
		function (result) {
			//trigger the stun server request
			pc.setLocalDescription(
				result,
				function () {},
				function () {}
			);
		},
		function () {}
	);

	//wait for a while to let everything done
	setTimeout(function () {
		//read candidate info from local description
		var lines = pc.localDescription.sdp.split("\n");

		lines.forEach(function (line) {
			if (line.indexOf("a=candidate:") === 0) handleCandidate(line);
		});
	}, 1000);
}

export const traverseRouter = (router) => {
	let newRouter = JSON.parse(JSON.stringify(router));
	let adminIds = [];
	let routerMap = {};
	newRouter.forEach((item, k) => {
		const recursive = (data, lv) => {
			// 设置routreMap 用于面包屑数据
			routerMap[data.key] = data.title;
			// 设置租户显示标志位
			if (data.auth.includes("0")) {
				data.sysAuth = true;
			} else {
				data.sysAuth = false;
			}

			// 设置id
			data.lv = lv + "";
			data.id = data.key;
			if (data.auth.includes("0")) {
				adminIds.push(data.id);
			}
			delete data.auth;
			delete data.icon;
			// delete data.key;
			data.children &&
				data.children.forEach((child, index) =>
					recursive(child, lv + "-" + index)
				);
		};
		recursive(item, k);
	});
	return { newRouter, adminIds, routerMap };
};
export const setRouterId = (router) => {
	// let newRouter = JSON.parse(JSON.stringify(router));
	router.forEach((item, k) => {
		const recursive = (data, lv) => {
			// 设置id
			data.lv = lv + "";
			data.id = data.key;
			data.children &&
				data.children.forEach((child, index) =>
					recursive(child, lv + "-" + index)
				);
		};
		recursive(item, k);
	});
	return router;
};
export const traverseTreeSetProps = (
	treeData = [],
	props = {},
	icon = null
) => {
	const type = Object.prototype.toString.call(treeData);
	if (type === "[object Array]" && treeData.length > 0) {
		treeData.forEach((tree, k) => {
			const deepTree = (item, props, index) => {
				if (icon) {
					item["icon"] = icon;
				}
				Object.keys(props).forEach((key) => {
					item[key] = item[props[key]];
				});

				item.children &&
					item.children.forEach((child, j) =>
						deepTree(child, props, j)
					);
			};
			deepTree(tree, props, k);
		});
		return treeData;
	} else {
		return [];
	}
};
// 树节点过滤
export const treeFilterToArr = (treeData, predicate) => {
	let res = [];
	treeData.forEach((tree) => {
		const deepTree = (item) => {
			if (predicate(item)) {
				res.push(item);
			}
			item.children &&
				item.children.forEach((child) => deepTree(child, predicate));
		};
		deepTree(tree);
	});
	return res;
};
// 数组转树形结构数据
export const toTree = (arr, pidKey = "menuPid") => {
	let dataArr = JSON.parse(JSON.stringify(arr));
	let result = [];
	if (!Array.isArray(dataArr)) {
		return result;
	}
	dataArr.forEach((item) => {
		delete item.children;
	});
	let map = {};
	dataArr.forEach((item) => {
		map[item.id] = item;
	});
	dataArr.forEach((item) => {
		let parent = map[item[pidKey]];
		if (parent) {
			(parent.children || (parent.children = [])).push(item);
		} else {
			result.push(item);
		}
	});
	return result;
};
// 根据选中节点id过滤树节点并返回树形结构数据
export const filterTreeReturnTree = (
	sourceTree,
	targetKeys,
	pidKey = "menuPid"
) => {
	if (
		Array.isArray(sourceTree) &&
		sourceTree.length > 0 &&
		Array.isArray(targetKeys) &&
		targetKeys.length > 0
	) {
		let final = [];
		let arr = treeFilterToArr(sourceTree, (node) => {
			return targetKeys.includes(node.id);
		}); // 从树上过滤出所有勾选的节点
		// 过滤出所有的叶子节点
		final.push(
			...arr.filter(
				(item) => !item.children || item.children.length === 0
			)
		);
		// 从叶子结点开始找父节点
		let pIdArrs = final.map((item) => item[pidKey]);
		// 过滤树节点的回调方法
		const predicate = (node) => {
			return pIdArrs.includes(node.id);
		};
		// 循环找到所有父节点
		while (pIdArrs.length) {
			let pNodes = treeFilterToArr(sourceTree, predicate);
			pIdArrs = [...new Set(pNodes.map((item) => item[pidKey]))];
			// pNodes 去重
			let resArr = [];
			pNodes.forEach((p) => {
				if (!resArr.some((item) => item.id === p.id)) {
					resArr.push({ ...p, children: [] });
				}
			});
			final.push(...resArr);
		}
		// 去重
		let teagetArr = [];
		final.forEach((p) => {
			if (!teagetArr.some((item) => item.id === p.id)) {
				teagetArr.push({ ...p, children: [] });
			}
		});
		console.log("teagetArr>>>", teagetArr);
		// 将数组构建成树
		const tree = toTree(teagetArr, pidKey);
		console.log(tree);
		return tree;
	} else {
		return [];
	}
};
// 按钮权限
export function checkPermission(cacheData, btnSign = null) {
	if (!btnSign) return false;
	return true;
	// return cacheData.includes(btnSign);
}
