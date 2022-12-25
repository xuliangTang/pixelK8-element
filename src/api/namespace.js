import request from '@/utils/myRequest'

// 获取namespace列表
export function getNsList() {
  return request({
    url: '/v1/namespaces',
    method: 'get'
  })
}
