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

// 给roleBinding增加user
export function addUserToRoleBinding(ns, name, data) {
  return request({
    url: '/v1/roleBinding/' + ns + '/' + name + '/user',
    method: 'patch',
    data
  })
}

// 从roleBinding移除user
export function removeUserFromRoleBinding(ns, name, data) {
  return request({
    url: '/v1/roleBinding/' + ns + '/' + name + '/user/remove',
    method: 'patch',
    data
  })
}
