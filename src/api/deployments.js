import request from '@/utils/myRequest'

// 创建deployment
export function createDeployment(data, fastmod) {
  return request({
    url: '/v1/deployment?fastmod=' + fastmod,
    method: 'post',
    data
  })
}

// 编辑deployment
export function updateDeployment(ns, data) {
  return request({
    url: '/v1/deployment/' + ns,
    method: 'put',
    data
  })
}

// 获取deployments列表
export function getDeploymentList(ns, page) {
  return request({
    url: '/v1/deployments?ns=' + ns + '&per_page=5&&page=' + page,
    method: 'get'
  })
}

// 删除deployment
export function deleteDeployment(ns, name) {
  return request({
    url: '/v1/deployment/' + ns + '/' + name,
    method: 'delete'
  })
}

// 获取原生deployment
export function showDeployment(ns, name) {
  return request({
    url: '/v1/deployment/' + ns + '/' + name,
    method: 'get'
  })
}

// 查看deployment
export function deploymentInfo(ns, name) {
  return request({
    url: '/v1/deployment/' + ns + '/' + name + '/info',
    method: 'get'
  })
}

// 获取deployment下的pods
export function getDeploymentPods(ns, name) {
  return request({
    url: '/v1/deployment/' + ns + '/' + name + '/pods',
    method: 'get'
  })
}
