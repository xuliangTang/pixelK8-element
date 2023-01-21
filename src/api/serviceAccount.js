import request from '@/utils/myRequest'

// 获取serviceAccount列表
export function getServiceAccountList(ns, page) {
  return request({
    url: '/v1/serviceAccounts?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}

// 删除serviceAccount
export function deleteServiceAccount(ns, name) {
  return request({
    url: '/v1/serviceAccount/' + ns + '/' + name,
    method: 'delete'
  })
}
