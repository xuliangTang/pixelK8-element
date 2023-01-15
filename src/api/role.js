import request from '@/utils/myRequest'

// 获取role列表
export function getRoleList(ns, page) {
  return request({
    url: '/v1/roles?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}

// 创建role
export function createRole(data) {
  return request({
    url: '/v1/role',
    method: 'post',
    data
  })
}

// 删除role
export function deleteRole(ns, name) {
  return request({
    url: '/v1/role/' + ns + '/' + name,
    method: 'delete'
  })
}
