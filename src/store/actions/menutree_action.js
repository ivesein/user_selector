import { GET_TENANT_USERTREE_API } from "@/api/permApi";
import { INIT_MENU_TREE } from "@/store/constant.js";
export const initMenuTree = () => {
	return async (dispatch) => {
		try {
			let res = await GET_TENANT_USERTREE_API();
			if (!res) return;
			dispatch({ type: INIT_MENU_TREE, data: res.data });
		} catch (error) {
			// dispatch({type:INIT_MENU_TREE,data:[]})
		}
	};
};
