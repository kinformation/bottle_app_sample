<script type="text/javascript" src="js/app.js"></script>

<article>
  <form id="form" class="form-inline">
    <div>
      自動更新：
      <input type="checkbox" id="auto_reload" checked data-toggle="toggle" data-width="80">
      [最終更新日時：<span id="last_update"></span>]
    </div>
    <div>
      <input type="datetime-local" class="form-control" id="start">
      <span>　～　</span>
      <input type="datetime-local" class="form-control" id="end">
    </div>
  </form>
  %if get('type') == 'jqplot':
    <div id="jp_chart"></div>
  %elif get('type') == 'highcharts':
    <div id="hc_chart"></div>
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
#jp_chart,
#hc_chart {
  height: 200px;
}
</style>