#!/usr/bin/env ruby
# -*- coding: utf-8 -*-

require "mqtt"
require "json"
require 'net/http'
require 'uri'

# -------------
# POST先サーバ情報
# -------------
url = URI.parse('http://localhost:8000/data')
http = Net::HTTP.new(url.host, url.port)
req = Net::HTTP::Post.new(url.path)
req["Content-Type"] = "application/json"

# -------------
# MQTT Subscript
# -------------
mqtt = MQTT::Client.connect(
  host: "192.168.2.105",
  port: 1883
)

mqtt.get("topic/test") do |t, message|
  # POSTリクエスト
  data = JSON.load(message)
  req.body = data.to_json
  res = http.request(req)

  # レスポンス出力
  puts "request -> #{data}"
  puts "code -> #{res.code}"
  puts "msg -> #{res.message}"
  puts "body -> #{res.body}"
end

