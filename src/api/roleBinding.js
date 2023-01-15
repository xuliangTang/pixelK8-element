import request from '@/utils/myRequest'

// 获取roleBinding列表
export function getRoleBindingList(ns, page) {
  return request({
    url: '/v1/roleBindings?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}
