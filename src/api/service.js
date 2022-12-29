import request from '@/utils/myRequest'

// 获取service列表
export function getServiceAll(ns) {
  return request({
    url: '/v1/service/all?ns=' + ns,
    method: 'get'
  })
}
