import http from './public'
const baseUrl = '/api'
// 人员列表
export const getList = (params) => {
  return http.fetchGet(`${baseUrl}/random/list`, params)
}
// 添加人员
export const add = (params) => {
  return http.fetchPost(`${baseUrl}/random/add`, params)
}

// 更新人员
export const update = (params) => {
  return http.fetchPost(`${baseUrl}/random/update`, params)
}

export const getTodayLottery = (params) => {
  return http.fetchGet(`${baseUrl}/random/getTodayLottery`, params)
}
