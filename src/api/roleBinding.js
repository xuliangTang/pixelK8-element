import request from '@/utils/myRequest'

// 获取roleBinding列表
export function getRoleBindingList(ns, page) {
  return request({
    url: '/v1/roleBindings?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}

// 创建roleBinding
export function createRoleBinding(data) {
  return request({
    url: '/v1/roleBinding',
    method: 'post',
    data
  })
}

// 删除roleBinding
export function deleteRoleBinding(ns, name) {
  return request({
    url: '/v1/roleBinding/' + ns + '/' + name,
    method: 'delete'
  })
}
