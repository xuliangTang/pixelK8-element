import request from '@/utils/myRequest'

// 获取clusterRole列表
export function getClusterRoleList(page) {
  return request({
    url: '/v1/clusterRoles?per_page=10&page=' + page,
    method: 'get'
  })
}

// 获取全部clusterRole
export function getClusterRoleAll() {
  return request({
    url: '/v1/clusterRoles/all',
    method: 'get'
  })
}

// 查看clusterRole
export function showClusterRole(name) {
  return request({
    url: '/v1/clusterRole/' + name,
    method: 'get'
  })
}

// 创建clusterRole
export function createClusterRole(data) {
  return request({
    url: '/v1/clusterRole',
    method: 'post',
    data
  })
}

// 编辑clusterRole
export function updateClusterRole(name, data) {
  return request({
    url: '/v1/clusterRole/' + name,
    method: 'put',
    data
  })
}

// 删除clusterRole
export function deleteClusterRole(name) {
  return request({
    url: '/v1/clusterRole/' + name,
    method: 'delete'
  })
}
