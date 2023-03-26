import request from '@/utils/myRequest'

export function getTaskList(ns) {
  return request({
    url: '/v1/tekton/tasks?ns=' + ns,
    method: 'get'
  })
}

export function saveTask(data) {
  return request({
    url: '/v1/tekton/task',
    method: 'post',
    data
  })
}

export function deleteTask(ns, name) {
  return request({
    url: '/v1/tekton/task/' + ns + '/' + name,
    method: 'delete'
  })
}
