import request from '@/utils/myRequest'

// 获取所有service
export function getServiceAll(ns) {
  return request({
    url: '/v1/service/all?ns=' + ns,
    method: 'get'
  })
}

// 获取service列表
export function getServiceList(ns, page) {
  return request({
    url: '/v1/services?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}
