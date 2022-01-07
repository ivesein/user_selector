export function getUserCache(key) {
	let userinfo = localStorage.getItem(key)
	if (userinfo !== "" && userinfo !== undefined && userinfo !== null) {
		return JSON.parse(userinfo)
	} else {
		return false
	}
}

export function treeTransArray(tree) {
	let key = "children"
	var nodes = JSON.parse(JSON.stringify(tree))
	var r = []

	if (Array.isArray(nodes)) {
		for (var i = 0, l = nodes.length; i < l; i++) {
			r.push(nodes[i]) // 取每项数据放入一个新数组

			if (Array.isArray(nodes[i][key]) && nodes[i][key].length > 0)
				// 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
				r = r.concat(treeTransArray(nodes[i][key], key))
			delete nodes[i][key]
		}
	}

	return r
}

export function arrayConvertTree(array) {
	let data = array
	// 删除 所有 children,以防止多次调用
	data.forEach(function (item) {
		delete item.children
	})

	// 将数据存储为 以 id 为 KEY 的 map 索引数据列
	var map = {}
	data.forEach(function (item) {
		map[item.id] = item
	})
	var val = []
	data.forEach(function (item) {
		var parent = map[item.parentId]
		if (parent) {
			(parent.children || (parent.children = [])).push(item)
		} else {
			val.push(item)
		}
	})
	return val
}