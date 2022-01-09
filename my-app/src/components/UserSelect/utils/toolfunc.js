
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


export const uuid=()=> {
	var temp_url = URL.createObjectURL(new Blob());
	var uuid = temp_url.toString(); // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
	URL.revokeObjectURL(temp_url);
	return uuid.slice(uuid.lastIndexOf("/") + 1);
  }