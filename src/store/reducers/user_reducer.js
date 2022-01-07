import { UPDATE_USER } from "@/store/constant.js";
import { getUserCache } from "@/utils/toolfunc";
const initUser = getUserCache("userInfo") || null;

const userReducer = (userState = initUser, action) => {
  const { type, data } = action;
  switch (type) {
    case UPDATE_USER:
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    default:
      return userState;
  }
};
export default userReducer;
