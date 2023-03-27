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

export function getPipelineList(ns) {
  return request({
    url: '/v1/tekton/pipelines?ns=' + ns,
    method: 'get'
  })
}

export function updatePipeline(data) {
  return request({
    url: '/v1/tekton/pipeline',
    method: 'put',
    data
  })
}

export function savePipeline(data) {
  return request({
    url: '/v1/tekton/pipeline',
    method: 'post',
    data
  })
}

export function getPipeline(ns, name) {
  return request({
    url: '/v1/tekton/pipeline/' + ns + '/' + name,
    method: 'get'
  })
}

export function deletePipeline(ns,name) {
  return request({
    url: '/v1/tekton/pipeline/' + ns + '/' + name,
    method: 'delete'
  })
}

export function getPipelineRunList(ns) {
  return request({
    url: '/v1/tekton/pipelineruns?ns=' + ns,
    method: 'get'
  })
}

export function getPipelineRun(ns, name) {
  return request({
    url: '/v1/tekton/pipelinerun/' + ns + '/' + name,
    method: 'get'
  })
}

export function deletePipelineRun(ns, name) {
  return request({
    url: '/v1/tekton/pipelinerun/' + ns + '/' + name,
    method: 'delete'
  })
}

export function updatePipelineRun(data) {
  return request({
    url: '/v1/tekton/pipelinerun',
    method: 'put',
    data
  })
}

export function savePipelineRun(data) {
  return request({
    url: '/v1/tekton/pipelinerun',
    method: 'post',
    data
  })
}
