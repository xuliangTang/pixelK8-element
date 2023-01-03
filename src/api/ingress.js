import request from '@/utils/myRequest'

// 获取ingress列表
export function getIngressList(ns, page) {
  return request({
    url: '/v1/ingress?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}

// 创建ingress
export function createIngress(data) {
  return request({
    url: '/v1/ingress',
    method: 'post',
    data
  })
}

// 删除ingress
export function deleteIngress(ns, name) {
  return request({
    url: '/v1/ingress/' + ns + '/' + name,
    method: 'delete'
  })
}
