#!/usr/bin/env ruby
# -*- coding: utf-8 -*-

require "mqtt"
require "json"
require "date"

# -------------
# CPU温度取得
# -------------
sysfile = "/sys/class/thermal/thermal_zone0/temp"

# ファイル読み取り
str = ''
File.open(sysfile, "r") do |f|
  str = (f.read).chomp
end

# データ加工
temp = str.to_i       # 文字列 -> 数値
temp = temp / 1000.0  # 単位を℃に変換

# -------------
# 返却JSONデータ生成
# -------------
my_sensor = "rpi01"
time = Time.now.strftime('%Y-%m-%d %H:%M:%S')

json = {
  time:   time,
  sensor: my_sensor,
  temper: temp
}.to_json

# -------------
# MQTT Publish
# -------------
mqtt = MQTT::Client.connect(
  host: "192.168.2.105",
  port: 1883
)
topic = "topic/test"

mqtt.publish(topic, json)

