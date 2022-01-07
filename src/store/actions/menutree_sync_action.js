import { INIT_MENU_TREE } from "@/store/constant.js";
export const initMenuTreeSync = (data) => {
  return { type: INIT_MENU_TREE, data };
};
