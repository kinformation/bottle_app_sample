<script type="text/javascript" src="js/app.js"></script>

<article>
    <form id="form"  class="form-inline">
        <div>
            自動更新：
            <input type="checkbox" id="auto_reload" checked data-toggle="toggle" data-width="80">
            [最終更新日時：<span id="last_update"></span>]
        </div>
        <div>
            <input type="datetime-local" class="form-control" id="start">　～　<input type="datetime-local" class="form-control" id="end">
        </div>
    </form>
    %if get('type') == 'jqplot':
        <div id="jp_chart" style="height: 200px;"></div>
    %elif get('type') == 'highcharts':
        <div id="hc_chart" style="height: 200px;"></div>
    %end
</article>

    <!-- ログテーブル -->
    % include('table.tpl')

<style>
    article {
        margin: 0 50px;
    }
    form>div {
        margin: 10px; 0;
    }
    </style>
</style>