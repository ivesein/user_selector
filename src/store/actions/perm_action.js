import { CURRENT_APP_PERMISSION } from "../constant";

export const permAction = (data) => {
  return { type: CURRENT_APP_PERMISSION, data };
};
