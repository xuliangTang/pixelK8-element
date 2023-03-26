import request from '@/utils/myRequest'

export function getTaskList(ns) {
  return request({
    url: '/v1/tekton/tasks?ns=' + ns,
    method: 'get'
  })
}

export function getTask(ns,name) {
  return request({
    url: '/v1/tekton/task/' + ns + '/' + name,
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

export function updateTask(data) {
  return request({
    url: '/v1/tekton/task',
    method: 'put',
    data
  })
}

export function deleteTask(ns, name) {
  return request({
    url: '/v1/tekton/task/' + ns + '/' + name,
    method: 'delete'
  })
}
