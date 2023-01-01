import request from '@/utils/myRequest'

// 获取secret列表
export function getSecretList(ns, page) {
  return request({
    url: '/v1/secrets?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}
