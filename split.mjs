import fs from 'fs'

const json = JSON.parse(fs.readFileSync('./output/d/e2k-ja.json', { encoding: 'utf-8' }))

const step = Math.ceil(json.length / 3)
const data1 = json.slice(0, step)
const data2 = json.slice(step, step * 2)
const data3 = json.slice(step * 2)

console.info(data1.length, data2.length, data3.length, data1.length + data2.length + data3.length, json.length)
fs.writeFileSync('./output/d/e2k-ja-1.json', JSON.stringify(data1))
fs.writeFileSync('./output/d/e2k-ja-2.json', JSON.stringify(data2))
fs.writeFileSync('./output/d/e2k-ja-3.json', JSON.stringify(data3))