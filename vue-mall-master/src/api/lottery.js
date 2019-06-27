import http from './public'
const baseUrl = '/api'
// 人员列表
export const getList = (params) => {
  return http.fetchGet(`${baseUrl}/lottery/list`, params)
}
// 添加人员
export const add = (params) => {
  return http.fetchPost(`${baseUrl}/lottery/add`, params)
}

// 更新人员
export const update = (params) => {
  return http.fetchPost(`${baseUrl}/lottery/update`, params)
}
