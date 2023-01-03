import request from '@/utils/myRequest'

// 获取deployments列表
export function getDeploymentList(ns, page) {
  return request({
    url: '/v1/deployments?ns=' + ns + '&per_page=5&&page=' + page,
    method: 'get'
  })
}

// 删除deployment
export function deleteDeployment(ns, name) {
  return request({
    url: '/v1/deployment/' + ns + '/' + name,
    method: 'delete'
  })
}
