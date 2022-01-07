import { GET_TENANT_ORGTREE_API } from "@/api/permApi";
import { INIT_ORG_TREE } from "@/store/constant.js";
import { getUserCache } from "@/utils/toolfunc";

export const initOrgTree = () => {
	return async (dispatch) => {
		try {
			const userInfo = getUserCache("userInfo");
			let res = await GET_TENANT_ORGTREE_API({
				tenantId: userInfo.tenantId,
			});
			if (!res) return;
			dispatch({ type: INIT_ORG_TREE, data: res.data });
		} catch (error) {
			// dispatch({type:INIT_MENU_TREE,data:[]})
		}
	};
};
