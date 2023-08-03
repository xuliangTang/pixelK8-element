import request from '@/utils/myRequest'

// 获取secret列表
export function getSecretList(ns, page, per_page = 5) {
  return request({
    url: '/v1/secrets?ns=' + ns + '&per_page=' + per_page + '&page=' + page,
    method: 'get'
  })
}

// 创建secret
export function createSecret(data) {
  return request({
    url: '/v1/secret',
    method: 'post',
    data
  })
}

// 查看secret
export function showSecret(ns, name) {
  return request({
    url: '/v1/secret/' + ns + '/' + name,
    method: 'get'
  })
}

// 删除secret
export function deleteSecret(ns, name) {
  return request({
    url: '/v1/secret/' + ns + '/' + name,
    method: 'delete'
  })
}
