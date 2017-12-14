bottle(Python製Webフレームワーク) サンプルAPP

Python 3.5.3で起動確認

# bottleインストール

`pip3 install bottle3`

# 使い方

## 起動

`python3 ./app.py`

## アクセス

http://<サーバIPアドレス>:8000/

## ページ

* `/` : メイン画面（'/jqplot'と同じ)
* `/jqplot` : jqPlotで温度センサ―データを描画
* `/highcharts` : Highchartsで温度センサ―データを描画
* `/data` : SQLite REST API
  - `@GET`: DBデータを返す
  - `@POST`: DBへデータ登録(JSON)
* `/edit_config` : 設定編集画面
* `/config` :
  - `@GET`: 設定ファイルの中身を返す
  - `@POST`: 編集画面の情報をJSON形式で設定ファイルに保存
* `/js`: 静的javasctipt
* `/lib`: 静的ライブラリ(JS,CSS)

# 温度データDB(SQLite)

```
sqlite3 data/temper.db
sqlite> .read data/CREATE_TABLE_TEMPER.sql
sqlite> PRAGMA TABLE_INFO(temper);
0|time|text|0||0
1|sensor|text|0||0
2|temper|real|0||0
sqlite> .exit
```

# メインページ機能

* プロットデータ自動更新
* 描画範囲(X軸)指定
* 上限、下限アラートログ出力

# ライブラリ一覧

* [jQuery](https://jquery.com/)(v1.9.1)
* [Bootstrap3](https://getbootstrap.com/docs/3.3/)(v3.3.7)
* [jqPlot](http://www.jqplot.com/)(v1.0.9)
* [Highcharts](https://www.highcharts.com/)

# 設定ファイル(app.conf)

``` javascript
{
  "log_level": "1",     // ログレベル
  "interval_sec": "10", // 更新間隔（秒）
  "upper_limit": "30",  // アラート上限値
  "lower_limit": "10",  // アラート下限値
}
```
