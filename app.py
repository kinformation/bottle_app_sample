#! /usr/bin/python3
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# app.py
# Copyright (c) 2017 HTKエンジニアリング All Rights Reserved.
#
# Distributed under terms of the MIT license.
from bottle import *
from bottle_sqlite import SQLitePlugin
from datetime import datetime
import json

# temperテーブル構造
#  0|time  |text|0||0
#  1|sensor|text|0||0
#  2|temper|real|0||0
dbfile = 'data/temper.db'
install(SQLitePlugin(dbfile=dbfile))


# --------------
# グラフページ
# --------------
# jqPlot描画ページ（メインページ）
@route('/')
@route('/jqplot')
def jqplot():
    return template('base', title='テストページ', type='jqplot')


# Highcharts描画ページ
@route('/highcharts')
def highcharts():
    return template('base', title='テストページ', type='highcharts')


# --------------
# REST API
# --------------
# DBデータを返す
@get('/data')
def get_data(db):
    data = []
    query = db.execute('SELECT time, temper FROM temper ORDER BY time')
    for row in query:
        unix_time = str2ut(row['time'])
        data.append([unix_time, row['temper']])
    ret = HTTPResponse(status=200, body=json.dumps([data]))
    ret.set_header('Content-Type', 'application/json')
    return ret


# DBにデータを登録
@post('/data')
def post_data(db):
    data = request.json
    time = data['time']
    sensor = data['sensor']
    temper = data['temper']
    sql = "INSERT INTO temper (time, sensor, temper) VALUES ('{0}', '{1}', '{2}')".format(
        time, sensor, temper)
    db.execute(sql)
    return ""


# 文字列(%Y-%m-%d %H:%M:%S)をUNIX時間に変換
# Highchartsは文字列を時間に変換できないため。jqPlotだけなら不要。
def str2ut(str):
    d = datetime.strptime(str, '%Y-%m-%d %H:%M:%S')
    return d.timestamp() * 1000


# --------------
# 設定ページ関連
# --------------
conffile = 'app.conf'


# 設定編集ページ
@route('/edit_config')
def config():
    return template('base', title='設定ページ', type='config')


# 設定ファイル取得
@get('/config')
def config_get():
    return static_file(conffile, root='.', mimetype='application/json')


# 設定ファイル更新
@post('/config')
def config_post():
    conf = {}
    for key, val in request.forms.items():
        conf[key] = val
    fh = open(conffile, 'w')
    fh.write(json.dumps(conf))
    fh.close()
    redirect('/')


# --------------
# 静的コンテンツ
# --------------
# Javascript
@route('/js/<filename>')
def js_static(filename):
    return static_file(filename, root='./assets/js')


# lib
@route('/lib/<filepath:path>')
def lib_static(filepath):
    return static_file(filepath, root='./assets/lib')


if __name__ == '__main__':

    # サーバ起動
    run(host='0.0.0.0', port=8000, reloader=True)