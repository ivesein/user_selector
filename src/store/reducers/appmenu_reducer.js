import { CURRENT_APP_MENU } from "../constant";
import { getUserCache } from "@/utils/toolfunc";

const initAppMenu = getUserCache("currentMenu") || [];
const appmenuReducer = (preState = initAppMenu, action) => {
  const { type, data } = action;
  switch (type) {
    case CURRENT_APP_MENU:
      localStorage.setItem("currentMenu", JSON.stringify(data));
      return data;
    default:
      return preState;
  }
};
export default appmenuReducer;
