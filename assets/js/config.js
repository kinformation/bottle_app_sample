/*
 * config.js
 * Copyright (c) 2017 HTKエンジニアリング All Rights Reserved.
 *
 * Distributed under terms of the MIT license.
 */
$(function() {
    $.ajaxSetup({ async: false });
    $.getJSON('/config', function(json) {
        $('#log_level').val(json['log_level']);
        $('#interval_sec').val(json['interval_sec']);
        $('#upper_limit').val(json['upper_limit']);
        $('#lower_limit').val(json['lower_limit']);
    });
});