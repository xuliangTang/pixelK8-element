import request from '@/utils/myRequest'

// 获取deployments列表
export function getList(ns) {
  return request({
    url: '/v1/deployments?ns=' + ns,
    method: 'get'
  })
}
