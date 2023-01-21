import request from '@/utils/myRequest'

// 获取clusterRole列表
export function getClusterRoleList(page) {
  return request({
    url: '/v1/clusterRoles?per_page=10&page=' + page,
    method: 'get'
  })
}
