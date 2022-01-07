import { INIT_ORG_TREE } from "@/store/constant.js";
import { getUserCache } from "@/utils/toolfunc";
const initTree = getUserCache("orgTree") || [];
const orgTreeReducer = (preState = initTree, action) => {
	const { type, data } = action;
	switch (type) {
		case INIT_ORG_TREE:
			localStorage.setItem("orgTree", JSON.stringify(data));
			return data;
		default:
			return preState;
	}
};
export default orgTreeReducer;
