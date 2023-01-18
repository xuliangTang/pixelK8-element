import request from '@/utils/myRequest'

// 获取role列表
export function getRoleList(ns, page) {
  return request({
    url: '/v1/roles?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}

// 获取全部role
export function getRoleAll(ns) {
  return request({
    url: '/v1/roles/all?ns=' + ns,
    method: 'get'
  })
}

// 查看role
export function showRole(ns, name) {
  return request({
    url: '/v1/role/' + ns + '/' + name,
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

// 编辑role
export function updateRole(ns, name, data) {
  return request({
    url: '/v1/role/' + ns + '/' + name,
    method: 'put',
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
