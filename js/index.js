import './index.styl'
import * as PIXI from 'pixi.js'
import { find } from 'lodash'
import { addClass, removeClass } from './comm'

const debug = require('debug')('CLIENT:DEMO')
function getCanvasSize () {
  let deviceWidth = document.documentElement.clientWidth || document.body.clientWidth
  let deviceHeight = document.documentElement.clientHeight || document.body.clientHeight
  return [ deviceWidth, deviceHeight ]
}

class Demo {
  constructor () {}
  init () {
    this.imgCacher = this.imgCacher.bind(this)
    this.setUpTimeline = this.setUpTimeline.bind(this)
    this.setUpScrollHandler = this.setUpScrollHandler.bind(this)
    this.wheelingHandler = this.wheelingHandler.bind(this)

    this.sprites = Array.from(Array(50).keys()).map((i, k) => ({
      url: `images/scroll${k + 1}.jpg`
    }))

    this.canvas = document.createElement('div')
    this.canvas.setAttribute('class', 'film')
    document.body.appendChild(this.canvas)

    this.canvasSize = getCanvasSize()

    Promise.all([
      this.imgCacher().then(() => debug('img loadin done')),
      this.setUpTimeline(),
      this.setUpScrollHandler()
    ]).then(() => {
      debug('Init sucessfully. Going to render img...')
      debug('this.timeline', this.timeline)
      document.body.setAttribute('style', `height: ${this.timeline[ this.timeline.length - 1 ].btm}px;`)
    })
  }

  async imgCacher () {
    await Promise.all([
      this.sprites.map((s, k) => new Promise ((resolve) => {
        const img = document.createElement('img')
        img.src = s.url
        img.onload = () => {
          this.canvas.appendChild(img)
          resolve()
        }
        img.setAttribute('index', k)
        k === 0 && addClass(img, 'active')
      }))
    ])
  }
  async setUpTimeline () {
    const parentTop = 0
    this.wheelPos = 0
    this.timeline = this.sprites.map((s, k) => ({
      top: parentTop + this.canvasSize[1] * k,
      btm: parentTop + this.canvasSize[1] * (k + 1),
      index: k
    }))
  }
  async setUpScrollHandler () {
    window.addEventListener('wheel', this.wheelingHandler)
  }
  wheelingHandler (e) {
    this.wheelPos += (0 - e.wheelDeltaY)
    this.wheelPos = this.wheelPos > 0
      ? this.wheelPos > this.timeline[ this.timeline.length - 1 ].btm
      ? this.timeline[ this.timeline.length - 1 ].btm
      : this.wheelPos
      : 0
    this.imgShouldRender = find(this.timeline, (img, k) => {
      if (this.wheelPos <= img.btm && this.wheelPos >= img.top) {
        const lastImg = this.canvas.querySelector('img.active')
        const thisImg = this.canvas.querySelector(`img[index='${k}']`)
        lastImg && removeClass(lastImg, 'active')
        thisImg && addClass(thisImg, 'active')
      }
      return this.wheelPos <= img.btm && this.wheelPos >= img.top
    })
    debug('this.wheelPos', this.timeline[ this.timeline.length - 1 ].btm, e.wheelDeltaY, this.wheelPos, this.imgShouldRender.index)
  }
}
window.addEventListener('load', () => {
  window.localStorage.debug = 'CLIENT:*'
  const demo = new Demo()
  demo.init()
})