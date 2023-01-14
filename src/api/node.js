import request from '@/utils/myRequest'

// 获取node列表
export function getNodeList(page) {
  return request({
    url: '/v1/nodes?per_page=10&page=' + page,
    method: 'get'
  })
}

// 查看node
export function showNode(name) {
  return request({
    url: '/v1/node/' + name,
    method: 'get'
  })
}

// 更新node
export function updateNode(name, data) {
  return request({
    url: '/v1/node/' + name,
    method: 'patch',
    data
  })
}
