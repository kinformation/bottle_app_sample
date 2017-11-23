<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">{{title}}</a>
    </div>
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li
          %if get('type') == 'jqplot':
            class="active"
          %end
        >
          <a href="/jqplot">jqPlot</a>
        </li>
        <li
          %if get('type') == 'highcharts':
            class="active"
          %end
        >
          <a href="/highcharts">Highcharts</a>
        </li>
        <li
          %if get('type') == 'config':
            class="active"
          %end
        >
          <a href="/edit_config">設定</a>
        </li>
      </ul>
    </div>
  </div>
</nav>