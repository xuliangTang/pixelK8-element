import request from '@/utils/myRequest'

export function getTaskList(ns) {
  return request({
    url: '/v1/tekton/tasks?ns=' + ns,
    method: 'get'
  })
}
