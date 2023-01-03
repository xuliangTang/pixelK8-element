import request from '@/utils/myRequest'

// 获取pod列表
export function getPodList(ns, page) {
  return request({
    url: '/v1/pods?ns=' + ns + '&per_page=5&page=' + page,
    method: 'get'
  })
}

// 获取pod的容器列表
export function getPodContainers(ns, podName) {
  return request({
    url: '/v1/pod/' + ns + '/' + podName + '/containers',
    method: 'get'
  })
}
// 获取pod的日志
export function getPodLogs(ns, podName, containerName) {
  return request({
    url: '/v1/pod/' + ns + '/' + podName + '/logs?container_name=' + containerName,
    method: 'get'
  })
}

// 删除pod
export function deletePod(ns, name) {
  return request({
    url: '/v1/pod/' + ns + '/' + name,
    method: 'delete'
  })
}

