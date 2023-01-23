import request from '@/utils/myRequest'

// 获取clusterRoleBinding列表
export function getClusterRoleBindingList(page) {
  return request({
    url: '/v1/clusterRoleBindings?per_page=10&page=' + page,
    method: 'get'
  })
}

// 给clusterRoleBinding增加user
export function addUserToClusterRoleBinding(name, data) {
  return request({
    url: '/v1/clusterRoleBinding/' + name + '/user',
    method: 'patch',
    data
  })
}

// 从clusterRoleBinding移除user
export function removeUserFromClusterRoleBinding(name, data) {
  return request({
    url: '/v1/clusterRoleBinding/' + name + '/user/remove',
    method: 'patch',
    data
  })
}

// 创建clusterRoleBinding
export function createClusterRoleBinding(data) {
  return request({
    url: '/v1/clusterRoleBinding',
    method: 'post',
    data
  })
}

// 删除clusterRoleBinding
export function deleteClusterRoleBinding(name) {
  return request({
    url: '/v1/clusterRoleBinding/' + name,
    method: 'delete'
  })
}
