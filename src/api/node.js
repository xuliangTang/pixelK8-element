import request from '@/utils/myRequest'

// 获取node列表
export function getNodeList(page) {
  return request({
    url: '/v1/nodes?per_page=10&page=' + page,
    method: 'get'
  })
}
