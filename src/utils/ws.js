const NewClient = function() {
  const ws = new WebSocket('ws://localhost:8081/v1/ws');
  ws.onopen = function() {
    console.log('open')
  }
  ws.onclose = function(e) {
    console.log('close')
  }
  ws.onerror = function(e) {
    console.log(e)
  }
  return ws
}

const NewPodContainerClient = function(ns, podName, containerName) {
  const ws = new WebSocket('ws://localhost:8081/v1/ws/pod/' + ns + '/' + podName + '/terminal?container_name=' + containerName)
  ws.onopen = function() {
    console.log('open')
  }
  ws.onclose = function(e) {
    console.log('close')
  }
  ws.onerror = function(e) {
    console.log(e)
  }
  return ws
}

export { NewClient, NewPodContainerClient }

