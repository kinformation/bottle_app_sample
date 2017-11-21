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

* `/` : メインページ（'/jqplot'と同じ)
* `/jqplot` : jqPlotで温度センサ―データを描画
* `/highcharts` : Highchartsで温度センサ―データを描画
* `/data` :DBデータをJSONで返す
* `/push` :
  - `@temper=<数値(float)>`: 指定した数値を現在時刻の気温としてDB登録
    - `@パラメタなし`: ランダム値(0.0～40.0)を現在時刻の気温としてDB登録
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

# ライブラリ一覧

* [jQuery](https://jquery.com/)(v1.9.1)
* [Bootstrap3](https://getbootstrap.com/docs/3.3/)(v3.3.7)
* [jqPlot](http://www.jqplot.com/)(v1.0.9)
* [Highcharts](https://www.highcharts.com/)
