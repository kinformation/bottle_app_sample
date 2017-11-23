/*
 * app.js
 * Copyright (c) 2017 HTKエンジニアリング All Rights Reserved.
 *
 * Distributed under terms of the MIT license.
 */
$(function() {

    // ======================
    // ログ出力
    // ======================
    const logger = {
        DEBUG: {
            code: 0,
            name: 'DEBUG',
            bootstrap: ''
        },
        INFO: {
            code: 1,
            name: 'INFO',
            bootstrap: 'info'
        },
        WARNING: {
            code: 2,
            name: 'WARNING',
            bootstrap: 'warning'
        },
        ERROR: {
            code: 3,
            name: 'ERROR',
            bootstrap: 'danger'
        },
    }
    var LOG_LEVEL = logger.INFO;

    function log(level, msg) {
        // 設定レベル以下のログは出さない
        if (LOG_LEVEL > level.code) { return; }
        $('#log_tbody').prepend(
            '<tr class="' + level.bootstrap + '">' +
            '  <td>' + formatDate() + '</td>' +
            '  <td>' + level.name + '</td>' +
            '  <td>' + msg + '</td>' +
            '</tr>'
        );
    }

    // フォーマット済み(YYYY/MM/DD hh:mm:ss)の現在時刻を返却する
    function formatDate() {
        var date = new Date();
        var ret = date.getFullYear() + '/';
        ret = ret + ('0' + (date.getMonth() + 1)).slice(-2) + '/';
        ret = ret + ('0' + date.getDate()).slice(-2) + ' ';
        ret = ret + ('0' + date.getHours()).slice(-2) + ':';
        ret = ret + ('0' + date.getMinutes()).slice(-2) + ':';
        ret = ret + ('0' + date.getSeconds()).slice(-2);
        return ret;
    }

    // ======================
    // 設定ファイル読み込み
    // ======================
    var gConf;

    function getConfig() {
        // グローバル変数に反映するため、非同期停止
        $.ajaxSetup({ async: false });
        $.getJSON('/config', function(json) {
            gConf = json;
        });
        // 非同期再開
        $.ajaxSetup({ async: true });
    }
    // 設定読み込み
    getConfig();
    LOG_LEVEL = gConf['log_level'];
    log(logger.INFO, '設定ファイルを読み込みました。');
    for (var key in gConf) {
        log(logger.DEBUG, key + ':' + gConf[key]);
    }

    // ======================
    // プロットデータ取得
    // ======================
    function ajaxDataRenderer() {
        var ret = '[[[]]]';
        $.ajax({
            async: false,
            url: '/data',
            type: 'GET',
            // dataType: 'json',
        }).done(function(data) {
            ret = data;
        });
        return ret;
    }

    // ======================
    // jqPlot描画
    // ======================
    var jp_options = {
        title: '温度センサー',
        dataRenderer: ajaxDataRenderer,
        axes: {
            xaxis: {
                renderer: $.jqplot.DateAxisRenderer,
                tickOptions: { formatString: '%m/%d %H:%M' },
            },
            yaxis: {
                label: '気温(℃)'
            }
        },
    }
    if ($('#jp_chart')[0]) {
        var jqplot = $.jqplot('jp_chart', [], jp_options);
    }

    // ======================
    // highcharts描画
    // ======================
    var hc_options = {
        credits: {
            enabled: false
        },
        chart: {
            type: 'line'
        },
        title: {
            text: '温度センサー'
        },
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%m/%d %k:%M}',
            }
        },
        yAxis: {
            title: {
                text: '気温(℃)'
            }
        },
        series: [{
            showInLegend: false,
            data: ajaxDataRenderer()[0]
        }]
    }
    if ($('#hc_chart')[0]) {
        var highcharts = Highcharts.setOptions({ global: { timezoneOffset: -9 * 60 } });
        highcharts = Highcharts.chart('hc_chart', hc_options);
    }

    // ======================
    // 更新日時表示
    // ======================
    function setLastUpdate() {
        $('#last_update').text(formatDate());
    }
    // ページロード時更新
    setLastUpdate();

    // ======================
    // グラフ自動更新
    // ======================
    const INTERVAL = gConf['interval_sec'] * 1000; //単位はミリ秒
    setInterval(function() {
        if ($('#auto_reload').prop('checked')) {
            log(logger.DEBUG, '自動更新がチェックされています。');

            // グラフ更新
            var new_data = ajaxDataRenderer();
            if (document.getElementById('jp_chart') != null) {
                var opts = jp_options;
                opts.data = new_data;
                opts.clear = true;
                jqplot.replot(opts);
            } else if (document.getElementById('hc_chart') != null) {
                var opts = hc_options;
                highcharts.destroy()
                opts.series[0].data = new_data[0];
                highcharts = Highcharts.chart('hc_chart', opts);
            }
            log(logger.INFO, 'グラフを更新しました。');

            //上限下限チェック
            checkTemperLimit(new_data[0][new_data[0].length - 1][1]);

            // 最終日付を更新
            setLastUpdate();
        } else {
            log(logger.DEBUG, '自動更新がチェックされていません。');
        }
    }, INTERVAL);

    // ======================
    // 開始・終了日時
    // ======================
    $('#start').change(function() {
        var unix_time = str2unixtime($('#start').val());
        var opts = jp_options;
        opts.axes.xaxis.min = unix_time;
        jqplot.replot(opts);
        log(logger.INFO, 'グラフの開始時刻を変更しました。');
        log(logger.DEBUG, '日時 = ' + $('#start').val());
    });

    $('#end').change(function() {
        unix_time = str2unixtime($('#end').val());
        var opts = jp_options;
        opts.axes.xaxis.max = unix_time;
        jqplot.replot(opts);
        log(logger.INFO, 'グラフの終了時刻を変更しました。');
        log(logger.DEBUG, '日時 = ' + $('#end').val());
    });

    // 'YYYY-MM-DDTHH:MM' -> UnixTime
    function str2unixtime(str) {
        var date = new Date(str);
        return date.getTime();
    }

    // ======================
    // 上限・下限アラート
    // ======================
    const UPPER = gConf['upper_limit'];
    const LOWER = gConf['lower_limit'];
    var limit_status = 0; // 1:上限超え 0:平常 -1:下限超え

    function checkTemperLimit(temp) {
        if (temp >= UPPER && limit_status != 1) {
            var msg = '上限値を超えました。' + '(' + temp.toFixed(1) + '℃)';
            log(logger.WARNING, msg);
            limit_status = 1;
        } else if (temp <= LOWER && limit_status != -1) {
            var msg = '下限値を超えました。' + '(' + temp.toFixed(1) + '℃)';
            log(logger.WARNING, msg);
            limit_status = -1;
        } else if (temp < UPPER && temp > LOWER) {
            limit_status = 0;
        }
    }
});