import fs from 'fs'

const json = JSON.parse(fs.readFileSync('./output/d/e2k-ja-all.json', { encoding: 'utf-8' }))

const step = 5000
const count = Math.ceil(json.length / step)
const data = json.slice(0, 2000)
fs.writeFileSync('./output/d/e2k-ja.json', JSON.stringify(data))

let total = 0
for (let i = 0; i < count; i++) {
  const data = json.slice(step * i, step * (i + 1))
  fs.writeFileSync(`./output/d/e2k-ja-${i + 1}.json`, JSON.stringify(data))

  console.info(`./output/d/e2k-ja-${i + 1}.json`, data.length)
  total += data.length
}
console.info(total, json.length)