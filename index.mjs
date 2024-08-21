import fs from 'fs'
import { sync } from 'glob'
import { decompress } from '@napi-rs/lzma/xz'

function checkWord(word) {
  if (!word) return
  if (word.search(/^(?!.*[-.",_\s!/*;:><~^]).*$/g) === -1) return false // 英数字以外の文字を含むもの
  if (word.search(/^[0-9]*$/g) !== -1) return false // 数字だけのもの
  if (word.search(/^[0-9]+[a-zA-Z]+$/g) !== -1) return false // 単位と思われるもの
  if (word.length > 12) return false // 必要以上に長いもの
  return true
}
function createPlainWord(word) {
  return word.trim().replace(/^[-/:-@#[-`{-~!]|[-/:-@#[-`{-~!]$/g, '')
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

async function generateOriginalDict() {
  const files = sync('./dict/original/*.tsv', {
    nodir: true,
  }).reverse()
  const result = new Map()
  for (const file of files) {
    const data = fs.readFileSync(file, {
      encoding: 'utf8',
    })
    const lines = data.split('\n')
    console.info('read', file, lines.length)
    let added = 0
    lines.forEach(line => {
      const [en, ja, , kana] = line.split('\t')
      const lowerEn = escapeRegExp(en.trim().toLowerCase())
      if (result.has(lowerEn)) return
      const word = kana || ja
      if (!word) {
        console.info('notfound', en)
        return
      }
      added++
      result.set(lowerEn, word.trim())
    })
    console.info('completed', file, added)
  }
  fs.writeFileSync('./output/d/original.json', JSON.stringify(Array.from(result.entries())))
}

async function generateThirdpartyDict() {
  const result = new Map()
  const files = sync('./dict/mecab-ipadic-neologd/seed/**/*.csv.xz', {
    nodir: true,
  }).reverse()
  for (const file of files) {
    const compressedData = fs.readFileSync(file)
    const decompressed = await decompress(compressedData)
    const data = decompressed.toString('utf8')
    const lines = data.split('\n')
    console.info('read', file, lines.length)
    let added = 0
    lines.forEach(line => {
      const [word, , , , , , , , , , hira, kana, kana2] = line.split(',')
      if (word.match(/^[a-zA-Z0-9!-/:-@[-`{-~]*$/)) {
        const plainWord = createPlainWord(word)
        if (!checkWord(plainWord)) return
        const escapedWord = escapeRegExp(plainWord).toLowerCase()
        if (result.has(escapedWord)) return // 同じ英語が既に登録されているもの
        const ja = kana2 || kana || hira
        if (!ja) {
          return
        }
        added++
        result.set(escapedWord, ja.trim())
      }
    })
    console.info('completed', file, added)
  }
  const bep = sync('./dict/bep/*.dic', {
    nodir: true,
  }).reverse()
  bep.forEach(file => {
    const data = fs.readFileSync(file, {
      encoding: 'utf8',
    })
    const lines = data.split('\n')
    console.info('read', file, lines.length)
    let added = 0
    lines.forEach(line => {
      const [en, kana] = line.split(' ')
      const plainWord = createPlainWord(en)
      if (!checkWord(plainWord)) return
      const escapedWord = escapeRegExp(plainWord).toLowerCase()
      if (result.has(escapedWord)) return // 同じ英語が既に登録されているもの
      if (!kana) {
        return
      }
      added++
      result.set(escapedWord, kana.trim())
    })
    console.info('completed', file, added)
  })

  const arr = Array.from(result.entries())
  console.info('all done', arr.length)
  fs.writeFileSync('./output/d/e2k-ja.json', JSON.stringify(arr))
}

async function main() {
  fs.rmSync('./output/d', { recursive: true, force: true })
  fs.mkdirSync('./output/d')
  await generateOriginalDict()
  await generateThirdpartyDict()
}

main()