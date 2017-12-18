export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  if(hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function getData(el, name, val) {
  let prefix = 'data-'
  name = prefix + name
  if(val) {
    el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

const elementStyle = document.createElement('div').style

let verdor = (()=>{
  let transform = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for(let key in transform) {
    if(elementStyle[transform[key]] !== undefined) {
      return key
    }
    return false
  }
})()

export function prefixStyle(style) {
  if(verdor === false) {
    return false
  }
  if(verdor === 'standard') {
    return style
  }
  return verdor + style.charAt(0).toUpperCase() + style.substr(1)
}