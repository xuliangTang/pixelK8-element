import request from '@/utils/myRequest'

// 获取configmap列表
export function getConfigmapList(ns, page) {
  return request({
    url: '/v1/configmaps?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}
