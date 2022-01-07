import { INIT_MENU_TREE } from "@/store/constant.js";
const initMenu = [];
const menuReducer = (preState = initMenu, action) => {
  const { type, data } = action;
  switch (type) {
    case INIT_MENU_TREE:
      return data;
    default:
      return preState;
  }
};
export default menuReducer;
