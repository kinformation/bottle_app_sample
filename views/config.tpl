<script type="text/javascript" src="js/config.js"></script>

<article>

<form id="form" action="/config" method="POST">
  <fieldset>
  <legend>設定</legend>
  <div>
    ログレベル：
    <select class="form-control" id="log_level" name="log_level">
      <option value="0">DEBUG</option>
      <option value="1">INFO</option>
      <option value="2">WARNING</option>
      <option value="3">ERROR</option>
    </select>
  </div>
  <div>
    更新間隔(秒)：
    <input type="number" id="interval_sec" name="interval_sec" min="10" max="600" step="1" placeholder="10〜600" class="form-control" required>
  </div>
  <div>
    上限気温：
    <input type="number" id="upper_limit" name="upper_limit" class="form-control" required>
  </div>
  <div>
    下限気温：
    <input type="number" id="lower_limit" name="lower_limit" class="form-control" required>
  </div>
  </fieldset>
  <button id="submit" class="btn btn-primary">設定ファイルを更新</button>
</form>

</article>

<style>
article {
  margin: 30px;
}
form div {
  margin: 10px 0;
}
</style>
