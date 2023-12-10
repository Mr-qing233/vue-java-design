import request from "@/utils/request";
import type { Information } from "@/utils/typeInterface";

//获取省略全部信息
export function getInformationLimit() {
  return request({
    method: "get",
    url: "/information",
  });
}

export function getInformationById(id: Number) {
  return request({
    method: "get",
    url: "/information/getById/" + id,
  });
}

export function postUpdateInformationById(info: Information) {
  return request({
    method: "post",
    url: "/information/updateByInfoId",
    data: info,
  });
}

export function postNewInfo(info: Information) {
  return request({
    method: "post",
    url: "/information/saveNewInfo",
    data: info,
  });
}
export function deleteInfoById(id: Number) {
  return request({
    method: "delete",
    url: "/information/deleteInfoById/" + id,
  });
}
