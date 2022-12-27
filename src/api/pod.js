import request from '@/utils/myRequest'

// 获取pod列表
export function getPodList(ns, page) {
  return request({
    url: '/v1/pods?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}
