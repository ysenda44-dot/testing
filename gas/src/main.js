/**
 * Google Apps Script の入口。スプレッドシートに紐づけて使う。
 *
 * スクリプト プロパティ（プロジェクトの設定 → スクリプト プロパティ）:
 *   API_URL                 例: https://kakeibo.<あなたのサブドメイン>.workers.dev/api/data
 *   INGEST_TOKEN            Cloudflare 側に設定したものと同じ文字列
 *   CF_ACCESS_CLIENT_ID     Cloudflare Access のサービストークン（ID）
 *   CF_ACCESS_CLIENT_SECRET Cloudflare Access のサービストークン（シークレット）
 * API_URL が空のあいだは、シートの更新だけ行い送信はしない。
 */

var SHEET_COLUMNS = {
  institutions: ['id', 'name', 'type', 'color1', 'color2', 'chip', 'sort'],
  accounts: ['id', 'institution_id', 'name', 'asset_class', 'currency', 'mail_match', 'note', 'sort', 'active'],
  balances: ['date', 'account_id', 'amount_jpy', 'amount_fx', 'fx_currency', 'source', 'memo'],
  transactions: ['tx_id', 'date', 'time', 'account_id', 'name', 'amount', 'fx', 'category', 'subcategory', 'status', 'transfer', 'source', 'source_id', 'memo'],
  rules: ['keyword', 'category', 'subcategory', 'priority'],
  log: ['time', 'level', 'message']
};

var DEFAULT_RULES = [
  ['セブン-イレブン', '食費', '食料品', 0],
  ['セブンイレブン', '食費', '食料品', 0],
  ['ローソン', '食費', '食料品', 0],
  ['ファミリーマート', '食費', '食料品', 0],
  ['イオン', '食費', '食料品', 0],
  ['スターバックス', '食費', 'カフェ', 0],
  ['ドトール', '食費', 'カフェ', 0],
  ['マクドナルド', '食費', '外食', 0],
  ['サイゼリヤ', '食費', '外食', 0],
  ['マツモトキヨシ', '日用品', 'ドラッグストア', 0],
  ['サンドラッグ', '日用品', 'ドラッグストア', 0],
  ['ウエルシア', '日用品', 'ドラッグストア', 0],
  ['ユニクロ', '衣服・美容', '衣服', 0],
  ['東京電力', '水道・光熱費', '電気', 0],
  ['東京ガス', '水道・光熱費', 'ガス', 0],
  ['東京メトロ', '交通費', '電車', 0],
  ['JR東日本', '交通費', '電車', 0],
  ['NETFLIX', '趣味・娯楽', '映画・音楽・ゲーム', 0],
  ['SPOTIFY', '趣味・娯楽', '映画・音楽・ゲーム', 0]
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('資産管理')
    .addItem('今すぐ更新', 'dailyUpdate')
    .addSeparator()
    .addItem('初期設定（シートを作る）', 'setup')
    .addItem('カード通知メールを過去60日分取り込む', 'backfillMails')
    .addItem('毎朝7時の自動実行を設定', 'installDailyTrigger')
    .addToUi();
}

/** シートを作り、分類ルールの例を入れる。何度実行しても既存の行は消さない。 */
function setup() {
  ensureSheets_();
  var rules = sheet_('rules');
  if (rules.getLastRow() < 2) {
    rules.getRange(2, 1, DEFAULT_RULES.length, DEFAULT_RULES[0].length).setValues(DEFAULT_RULES);
  }
  addValidation_();
  log_('info', '初期設定が完了しました');
}

function installDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'dailyUpdate') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('dailyUpdate').timeBased().everyDays(1).atHour(7).create();
  log_('info', '毎朝7時台に dailyUpdate を実行するよう設定しました');
}

function backfillMails() {
  ensureSheets_();
  var added = importSmbcCardMails_(60);
  log_('info', 'カード通知メール: ' + added + ' 件を追加しました（過去60日）');
}

/** 毎朝の処理: メール取り込み → 未分類の再分類 → 集計 → history 記録 → Cloudflare へ送信 */
function dailyUpdate() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30 * 1000)) {
    log_('warn', '前回の処理が実行中のためスキップしました');
    return;
  }
  try {
    ensureSheets_();
    var added = importSmbcCardMails_(7);
    var reclassified = reclassify_();
    var data = readAll_();
    var payload = buildPayload({
      institutions: data.institutions,
      accounts: data.accounts,
      balances: data.balances,
      transactions: data.transactions,
      history: data.history,
      now: new Date()
    });
    writeHistoryPoint_(payload.history[payload.history.length - 1]);
    payload.warnings.forEach(function (w) { log_('warn', w); });
    var sent = pushPayload_(payload);
    log_('info', '更新完了: メール ' + added + ' 件追加 / 再分類 ' + reclassified + ' 件 / ' + (sent ? '送信しました' : '送信先が未設定のため送信なし'));
  } catch (e) {
    log_('error', String(e && e.stack || e));
    throw e;
  } finally {
    lock.releaseLock();
  }
}

/* ---------------- メールの取り込み ---------------- */

function importSmbcCardMails_(days) {
  var txSheet = sheet_('transactions');
  var existing = {};
  readObjects_('transactions').forEach(function (t) {
    if (t.source_id) existing[String(t.source_id)] = true;
  });
  var accounts = readObjects_('accounts');
  var rules = readObjects_('rules');
  var query = SMBC_CARD_QUERY + ' newer_than:' + days + 'd';
  var rows = [];
  var start = 0;
  var pageSize = 100;
  while (true) {
    var threads = GmailApp.search(query, start, pageSize);
    threads.forEach(function (thread) {
      thread.getMessages().forEach(function (msg) {
        var id = msg.getId();
        if (existing[id]) return;
        if (msg.getFrom().indexOf(SMBC_CARD_SENDER) < 0) return;
        var tx = parseSmbcCardMail(msg.getPlainBody());
        if (!tx) {
          log_('warn', 'カード通知を読めませんでした: ' + msg.getSubject() + ' (' + id + ')');
          return;
        }
        var account = matchAccountByMail(accounts, tx.cardName);
        var accountId = account ? String(account.id) : 'unmatched';
        if (!account) {
          log_('warn', 'カード「' + tx.cardName + '」に対応する口座がありません。accounts の mail_match を設定してください');
        }
        var cat = classify(tx.merchant, rules);
        rows.push([
          'smbc-mail:' + id, tx.date, tx.time, accountId, tx.merchant,
          tx.amount === null ? '' : tx.amount, tx.fx, cat.category, cat.subcategory,
          '速報', false, 'smbc-mail', id, tx.kind
        ]);
        existing[id] = true;
      });
    });
    if (threads.length < pageSize) break;
    start += pageSize;
  }
  if (rows.length) {
    rows.sort(function (a, b) { return (a[1] + a[2]).localeCompare(b[1] + b[2]); });
    txSheet.getRange(txSheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    txSheet.getRange(2, 2, txSheet.getLastRow() - 1, 1).setNumberFormat('yyyy-mm-dd');
  }
  return rows.length;
}

/** 分類が「未分類」の取引に、いまの rules をもう一度当てる。手で直した分類は触らない。 */
function reclassify_() {
  var sheet = sheet_('transactions');
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return 0;
  var header = values[0];
  var iName = header.indexOf('name');
  var iCat = header.indexOf('category');
  var iSub = header.indexOf('subcategory');
  var rules = readObjects_('rules');
  var changed = 0;
  for (var r = 1; r < values.length; r++) {
    var cat = String(values[r][iCat] || '');
    if (cat && cat !== '未分類') continue;
    var c = classify(values[r][iName], rules);
    if (c.category === '未分類') continue;
    sheet.getRange(r + 1, iCat + 1, 1, 1).setValue(c.category);
    sheet.getRange(r + 1, iSub + 1, 1, 1).setValue(c.subcategory);
    changed++;
  }
  return changed;
}

/* ---------------- 送信 ---------------- */

function pushPayload_(payload) {
  var props = PropertiesService.getScriptProperties();
  var url = props.getProperty('API_URL');
  if (!url) return false;
  var token = props.getProperty('INGEST_TOKEN');
  if (!token) throw new Error('スクリプト プロパティ INGEST_TOKEN が未設定です');
  var headers = { Authorization: 'Bearer ' + token };
  var cid = props.getProperty('CF_ACCESS_CLIENT_ID');
  var csec = props.getProperty('CF_ACCESS_CLIENT_SECRET');
  if (cid && csec) {
    headers['CF-Access-Client-Id'] = cid;
    headers['CF-Access-Client-Secret'] = csec;
  }
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: headers,
    followRedirects: false,
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code !== 200) {
    throw new Error('Cloudflare への送信に失敗しました（HTTP ' + code + '）: ' + res.getContentText().slice(0, 300));
  }
  return true;
}

/* ---------------- シート操作 ---------------- */

function sheet_(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function ensureSheets_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSpreadsheetTimeZone() !== 'Asia/Tokyo') ss.setSpreadsheetTimeZone('Asia/Tokyo');
  var all = {};
  Object.keys(SHEET_COLUMNS).forEach(function (k) { all[k] = SHEET_COLUMNS[k]; });
  all.history = historyColumns();
  Object.keys(all).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, all[name].length).setValues([all[name]]).setFontWeight('bold');
      sh.setFrozenRows(1);
      // 時刻やメール ID が数値・時刻に自動変換されないよう、文字列の列にしておく
      if (name === 'transactions') {
        ['tx_id', 'time', 'source_id'].forEach(function (col) {
          var c = all[name].indexOf(col) + 1;
          sh.getRange(1, c, sh.getMaxRows(), 1).setNumberFormat('@');
        });
      }
    }
  });
}

function addValidation_() {
  var typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(INSTITUTION_TYPES, true).setAllowInvalid(false).build();
  sheet_('institutions').getRange('C2:C').setDataValidation(typeRule);
  var classRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(assetClassIds().concat([LIABILITY_CLASS]), true).setAllowInvalid(false).build();
  sheet_('accounts').getRange('D2:D').setDataValidation(classRule);
  sheet_('accounts').getRange('I2:I').insertCheckboxes();
  sheet_('transactions').getRange('K2:K').insertCheckboxes();
}

function readObjects_(name) {
  var sh = sheet_(name);
  if (!sh) return [];
  return rowsToObjects(sh.getDataRange().getValues());
}

function readAll_() {
  return {
    institutions: readObjects_('institutions'),
    accounts: readObjects_('accounts'),
    balances: readObjects_('balances'),
    transactions: readObjects_('transactions'),
    history: readObjects_('history')
  };
}

function writeHistoryPoint_(point) {
  if (!point) return;
  var sh = sheet_('history');
  var row = historyPointToRow(point);
  var last = sh.getLastRow();
  if (last >= 2) {
    var dates = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var i = dates.length - 1; i >= 0; i--) {
      if (toYmd(dates[i][0]) === point.date) {
        sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
        return;
      }
    }
  }
  sh.getRange(last + 1, 1, 1, row.length).setValues([row]);
}

function log_(level, message) {
  console.log('[' + level + '] ' + message);
  var sh = sheet_('log');
  if (!sh) return;
  sh.appendRow([new Date(), level, message]);
  var extra = sh.getLastRow() - 501;
  if (extra > 0) sh.deleteRows(2, extra);
}
