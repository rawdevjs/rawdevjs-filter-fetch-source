'use strict'

const fetch = require('isomorphic-fetch')

function nodeBuffer () {
  let buffer = new Buffer(0)

  return new Promise((resolve, reject) => {
    this.on('end', () => {
      resolve(buffer)
    })

    this.on('error', (err) => {
      reject(err)
    })

    this.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk])
    })
  })
}

function nodeArrayBuffer () {
  return this.buffer().then((buffer) => {
    return buffer.buffer
  })
}

function responsePolyfill (res) {
  if (!process.browser) {
    res.buffer = nodeBuffer.bind(res.body)
    res.arrayBuffer = nodeArrayBuffer.bind(res.body)
  }
}

class FetchSource {
  constructor () {
    this.label = 'fetch source'
    this.inPlace = false
    this.dirty = true
  }

  process (url) {
    return fetch(url).then((res) => {
      responsePolyfill(res)

      return res.arrayBuffer()
    })
  }
}

module.exports = FetchSource
