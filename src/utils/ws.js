const NewClient = function() {
  var ws = new WebSocket('ws://localhost:8081/v1/ws')
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
export { NewClient }

