import { CURRENT_APP } from "../constant";
import logoRC from "@/asset/img/logo_rc.png";
const initApp = {
  appName: "",
  appIcon: logoRC,
};
const appReducer = (preState = initApp, action) => {
  const { type, data } = action;
  switch (type) {
    case CURRENT_APP:
      return data;
    default:
      return preState;
  }
};
export default appReducer;
