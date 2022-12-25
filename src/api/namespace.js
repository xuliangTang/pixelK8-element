import request from '@/utils/myRequest'

// 获取namespace列表
export function getList() {
  return request({
    url: '/v1/namespaces',
    method: 'get'
  })
}
