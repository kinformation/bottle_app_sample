<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>{{title or 'No title'}}</title>

    <!-- jQuery -->
    <script type="text/javascript" src="lib/jquery-1.9.1.min.js"></script>

    <!-- jqplot -->
    <script type="text/javascript" src="lib/jqPlot/jquery.jqplot.min.js"></script>
    <script type="text/javascript" src="lib/jqPlot/plugins/jqplot.dateAxisRenderer.js"></script>
    <link rel="stylesheet" type="text/css" href="lib/jqPlot/jquery.jqplot.css" />

    <!-- bootstrap -->
    <link rel="stylesheet" href="lib/bootstrap-3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="lib/bootstrap-3.3.7/css/bootstrap-theme.min.css">
    <script type="text/javascript" src="lib/bootstrap-3.3.7/js/bootstrap.min.js"></script>

    <!-- bootstrap-toggle -->
    <link rel="stylesheet" type="text/css" href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css">
    <script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>

    <!--  highcharts -->
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
</head>

<body>

    <!-- ナビゲーションバー -->
    % include('navbar.tpl')

    <!-- メインコンテンツ -->

    %if get('type') != 'config':
        % include('main.tpl')
    %else:
        % include('config.tpl')
    %end

    <!-- フッター -->
    % include('footer.tpl')

</body>

</html>