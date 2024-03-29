import request from '@/utils/myRequest'

// 获取ingress列表
export function getIngressList(ns, page) {
  return request({
    url: '/v1/ingress?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}

// 提交ingress
export function postIngress(data) {
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

// 获取ingress的yaml
export function getIngressForYaml(ns, name) {
  return request({
    url: '/v1/ingress/yaml/' + ns + '/' + name,
    method: 'get'
  })
}

// 生成auth密文
export function genAuthFile(data) {
  return request({
    url: '/v1/ingress/auth/secret',
    method: 'post',
    data
  })
}

// 获取ingress详情
export function getIngressInfo(ns, name) {
  return request({
    url: '/v1/ingress/' + ns + '/' + name,
    method: 'get'
  })
}
