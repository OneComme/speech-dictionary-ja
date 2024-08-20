# speech-dictionary-ja

日本語の読み上げをより自然するための変換辞書データ

この辞書は元データより下記に該当するものは除外し、正規表現文字列はエスケープ処理を施しています

- 英語でないもの
- 英数字以外の文字列を含むもの
- 数字だけのもの
- 数字＋単位と思われるもの
- 12文字より長い単語

## ライセンス
GPL 2.0

オリジナル以外のデータは下記辞書を使用または参照しています

### dict/mecab-ipdic-neologd

Apache License, Version 2.0

Copyright (c) 2015-2019 Toshinori Sato (@overlast) All rights reserved.

### dict/bep-eng.dic

License GPL
- modified hankaku kana to zenkaku kana
- added basic japanese letters
by M.Ohtsuka(mash)
