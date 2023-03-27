import moment from 'moment'
export function formatDate(date, format) {
  if (date) {
    return moment(date).format(format)
  }
  return ''
}
export function objIsEqual(obj1, obj2) {
  var o1 = obj1 instanceof Object
  var o2 = obj2 instanceof Object
  // 判断是不是对象
  if (!o1 || !o2) {
    return obj1 === obj2
  }

  // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,
  // 例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }

  for (var o in obj1) {
    var t1 = obj1[o] instanceof Object
    var t2 = obj2[o] instanceof Object
    if (t1 && t2) {
      return objIsEqual(obj1[o], obj2[o])
    } else if (obj1[o] !== obj2[o]) {
      return false
    }
  }
  return true
}
export function trim(x) {
  if (x === undefined || x === null) return x
  return x.replace(/^\s+|\s+$/gm, '')
}
export function isEmptyObject(obj) { // 判定对象是否为空  如 {}
  if (obj === null || obj === undefined) return true
  var objStr = JSON.stringify(obj)
  return objStr === '{}' || objStr === '[]' // 空数组也要干掉
  // return Object.keys(obj).length===0   //这句话有问题
}
export function clearEmptyObject(obj) { // 清除 空对象属性 ,是一个递归
  for (var key in obj) {
    if (isEmptyObject(obj[key])) {
      isEdited = true
      delete obj[key]
      continue
    }
    if (typeof obj[key] === 'object') { // 如果是对象, object和array 都会 返回object
      if (Array.isArray(obj[key])) { // 数组要遍历
        for (var i = 0; i < obj[key].length; i++) {
          clearEmptyObject(obj[key][i])
        }
      } else {
        if (isEmptyObject(obj[key])) {
          isEdited = true
          delete obj[key]
        } else {
          clearEmptyObject(obj[key])
        }
      }
    }
  }
  return obj
}
export function initIfNil(obj, destKey, v) { //  支持多级
  if (v === undefined) { v = {} }
  var destObject = 'obj' // 凑字符串
  var destArray = destKey.split('.')
  for (var j = 0; j < destArray.length; j++) {
    destObject += '[\'' + destArray[j] + '\']'
    if (j === destArray.length - 1) { eval('if(' + destObject + '===undefined) ' + destObject + '=v;') } else {
      // 如果不是最后一个，必须是对象
      eval('if(' + destObject + '===undefined) ' + destObject + '={};')
    }
  }
  return copyObject(obj)
}

// 快捷插入
export function fastPathDeploy(obj) {
  if (obj.metadata === undefined || obj.metadata.name === undefined || obj.metadata.name === '') {
    alert('请先填写name')
  }
  // obj=initIfNil(obj,"metadata.name",'')
  //   if(obj.metadata.name===''){
  //     alert("请先填写name")
  //     return
  //   }
  //   const name=obj.metadata.name
  // obj=initIfNil(obj,"spec.selector.matchLabels",{app:name})
  // obj=initIfNil(obj,"spec.template",{metadata:{app:name},spec:{containers:[]}})

  return obj
}
export function copyObject(obj) {
  var str = JSON.stringify(obj)
  return JSON.parse(str)
}

export function clearEmptyObject_2(obj) { // 剔除对象的空属性
  var _newObj = {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) { // 判断对象中是否有这个属性
      if (isEmptyObject(obj[key])) continue
      _newObj[key] = typeof obj[key] === 'object' ? (
        obj[key] instanceof Array ? clearEmptyArray(obj[key]) : clearEmptyObject_2(obj[key])
      ) : obj[key]
    }
  }
  return _newObj
}
function clearEmptyArray(arr) { // 剔除数组中的空值
  var err = []

  arr.forEach((item, index) => {
    if (isEmptyObject(item)) return
    err.push(
      typeof item === 'object' ? (
        item instanceof Array ? clearEmptyArray(item) : clearEmptyObject_2(item)
      ) : item
    )
  })
  return err
}

// 循环清理
let isEdited = false
export function clearAll(obj) {
  isEdited = false
  obj = clearEmptyObject(obj)
  while (isEdited) {
    isEdited = false
    obj = clearEmptyObject(obj)
  }
  return obj
}
