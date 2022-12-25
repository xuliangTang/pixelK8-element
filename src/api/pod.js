import request from '@/utils/myRequest'

// 获取pod列表
export function getPodList(ns) {
  return request({
    url: '/v1/pods?ns=' + ns,
    method: 'get'
  })
}
