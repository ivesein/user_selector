import xApi from "@/utils/xApi";
import service from '@/utils/service'

export const login = (params) => {
  return xApi.post("/userperm/cus_user/login", params);
};
export const getUserTree = (url) => {
  return xApi.get(url);
};
export const nomalGet = (params) => {
  return xApi.get(params.url, { params: params.data });
};
export const nomalPost = (params) => {
  return xApi.post(params.url, params.data);
};
export const nomalPut = (params) => {
  return xApi.put(params.url, params.data);
};
export const nomalDelete = (params) => {
  return xApi.delete(params.url, { data: params.data });
};
export const messageDelete = (url) => {
  return xApi.delete(url);
};
export const memberGetApi = (params) => {
  return service.get(params.url + params.data);
};
export const memberPutApi = (params) => {
  return xApi.put(params.url + params.data);
};
export const addTableData = (params) => {
  return xApi.post(params.url, params.data);
};
export const updateTableData = (params) => {
  return xApi.put(params.url, params.data);
};