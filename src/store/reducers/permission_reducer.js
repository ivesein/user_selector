import { CURRENT_APP_PERMISSION } from "../constant";
import { getUserCache } from "@/utils/toolfunc";
const initAppPerm = getUserCache("AppBtnPermission") || [];
const permReducer = (preState = initAppPerm, action) => {
  const { type, data } = action;
  switch (type) {
    case CURRENT_APP_PERMISSION:
      localStorage.setItem("AppBtnPermission", JSON.stringify(data));
      return data;
    default:
      return preState;
  }
};
export default permReducer;
