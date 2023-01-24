import request from '@/utils/myRequest'

// 获取userAccount列表
export function getUserAccountList(page) {
  return request({
    url: '/v1/userAccounts?per_page=10&page=' + page,
    method: 'get'
  })
}

// 创建userAccount
export function createUserAccount(data) {
  return request({
    url: '/v1/userAccount',
    method: 'post',
    data
  })
}

// 删除userAccount
export function deleteUserAccount(cn) {
  return request({
    url: '/v1/userAccount/' + cn,
    method: 'delete'
  })
}
