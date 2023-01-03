import request from '@/utils/myRequest'

// 获取configmap列表
export function getConfigmapList(ns, page) {
  return request({
    url: '/v1/configmaps?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}

// 创建configmap
export function createConfigmap(data) {
  return request({
    url: '/v1/configmap',
    method: 'post',
    data
  })
}

// 查看configmap
export function showConfigmap(ns, name) {
  return request({
    url: '/v1/configmap/' + ns + '/' + name,
    method: 'get',
  })
}

// 删除configmap
export function deleteConfigmap(ns, name) {
  return request({
    url: '/v1/configmap/' + ns + '/' + name,
    method: 'delete'
  })
}
