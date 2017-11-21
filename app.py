#! /usr/bin/python3
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2017 pi <pi@rpi01>
#
# Distributed under terms of the MIT license.
from bottle import *
from bottle_sqlite import SQLitePlugin
from datetime import datetime
import json
import random

# temperテーブル構造
#  0|time  |text|0||0
#  1|sensor|text|0||0
#  2|temper|real|0||0
dbfile = 'data/temper.db'
install(SQLitePlugin(dbfile=dbfile))

# # メインページ
# @route('/')
# def index():
#     return template('base', title="テストページ", type="jqplot")


# jqPlot描画ページ（メインページ）
@route('/')
@route('/jqplot')
def jqplot():
    return template('base', title="テストページ", type="jqplot")


# Highcharts描画ページ
@route('/highcharts')
def highcharts():
    return template('base', title="テストページ", type="highcharts")


# DBデータをJSONで返す
@route('/data')
def data(db):
    data = []
    query = db.execute('SELECT time, temper FROM temper ORDER BY time')
    for row in query:
        unix_time = str2ut(row['time'])
        data.append([unix_time, row['temper']])
    ret = HTTPResponse(status=200, body=json.dumps([data]))
    ret.set_header("Content-Type", "application/json")
    return ret


# 文字列(%Y-%m-%d %H:%M:%S)をUNIX時間に変換
# Highchartsは文字列を時間に変換できないため。jqPlotだけなら不要。
def str2ut(str):
    d = datetime.strptime(str, "%Y-%m-%d %H:%M:%S")
    return d.timestamp() * 1000


# DBデータにデータを登録
# usage: /push?temper=<数値>
# パラメタなければ、ランダムで入れる
@route('/push')
def push(db):
    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sensor = 'myraspi1'
    temper = request.query.temper
    try:
        float(temper)
    except ValueError:
        temper = random.uniform(0, 40)
    sql = "INSERT INTO temper (time, sensor, temper) VALUES ('{0}', '{1}', '{2}')".format(
        time, sensor, temper)
    db.execute(sql)
    return sql


# Javascript
@route('/js/<filename>')
def js_static(filename):
    return static_file(filename, root='./assets/js')


# lib
@route('/lib/<filepath:path>')
def lib_static(filepath):
    return static_file(filepath, root='./assets/lib')


# サーバ起動
run(host='0.0.0.0', port=8000, reloader=True)