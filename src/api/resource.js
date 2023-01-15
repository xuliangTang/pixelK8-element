import request from '@/utils/myRequest'

// 获取resource列表
export function getResources() {
  return request({
    url: '/v1/resources',
    method: 'get'
  })
}
