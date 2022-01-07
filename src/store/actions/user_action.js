// import { getUserTree } from "@/api/superApi";
import { UPDATE_USER } from "@/store/constant.js";

export const userUpdateAction = (data) => {
  return { type: UPDATE_USER, data };
};
