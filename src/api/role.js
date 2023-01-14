import request from '@/utils/myRequest'

// 获取role列表
export function getRoleList(ns, page) {
  return request({
    url: '/v1/roles?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}
