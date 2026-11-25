/**
 * スプレッドシートの行データから、画面に送る JSON（payload）を組み立てる。
 * Google のサービスを呼ばない純粋な関数だけを置き、手元でテストできるようにしている。
 */

var ASSET_CLASSES = [
  { id: 'realestate', name: '不動産', color: '#e59bb5' },
  { id: 'cash', name: '現金・預金', color: '#7fb08a' },
  { id: 'fund', name: '債券・ファンド', color: '#6d9fc4' },
  { id: 'stock', name: '上場株式', color: '#d98a4b' },
  { id: 'private', name: '非上場株式', color: '#8d84c4' },
  { id: 'point', name: 'ポイント', color: '#e8a13a' }
];
var LIABILITY_CLASS = 'liability';
var INSTITUTION_TYPES = ['bank', 'securities', 'card', 'emoney', 'other'];
var JST_OFFSET_MS = 9 * 60 * 60 * 1000;
var TX_WINDOW_DAYS = 400;

function assetClassIds() {
  return ASSET_CLASSES.map(function (c) { return c.id; });
}

function historyColumns() {
  return ['date'].concat(assetClassIds(), [LIABILITY_CLASS]);
}

function nfkc(value) {
  var s = String(value == null ? '' : value);
  return typeof s.normalize === 'function' ? s.normalize('NFKC') : s;
}

function isDateValue(v) {
  return Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime());
}

/** Date / "2026/11/5" / "2026-11-05" → "2026-11-05"（日本時間）。解釈できなければ ''。 */
function toYmd(v) {
  if (isDateValue(v)) {
    return new Date(v.getTime() + JST_OFFSET_MS).toISOString().slice(0, 10);
  }
  var m = nfkc(v).trim().match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
  if (!m) return '';
  return m[1] + '-' + pad2(m[2]) + '-' + pad2(m[3]);
}

/** Date → "2026-11-25T07:00:00+09:00" */
function toJstIso(date) {
  return new Date(date.getTime() + JST_OFFSET_MS).toISOString().slice(0, 19) + '+09:00';
}

function pad2(n) {
  return ('0' + Number(n)).slice(-2);
}

/** 数値・"1,234"・"¥-1,234" などを数値に。空なら null。 */
function toNumber(v) {
  if (typeof v === 'number') return isFinite(v) ? v : null;
  var s = nfkc(v).replace(/[,¥\\円\s]/g, '');
  if (s === '') return null;
  var n = Number(s);
  return isFinite(n) ? n : null;
}

function toBool(v) {
  if (typeof v === 'boolean') return v;
  var s = nfkc(v).trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === '○' || s === 'はい';
}

/** シートの2次元配列（1行目が見出し）をオブジェクトの配列に。空行は捨てる。 */
function rowsToObjects(values) {
  if (!values || values.length < 2) return [];
  var header = values[0].map(function (h) { return nfkc(h).trim(); });
  var out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var empty = true;
    var obj = {};
    for (var c = 0; c < header.length; c++) {
      if (!header[c]) continue;
      var cell = row[c];
      obj[header[c]] = cell;
      if (cell !== '' && cell !== null && cell !== undefined) empty = false;
    }
    if (!empty) out.push(obj);
  }
  return out;
}

/**
 * rules: [{keyword, category, subcategory, priority}]
 * 取引名に keyword が含まれるルールのうち、priority が大きいもの → keyword が長いものを採用する。
 */
function classify(name, rules) {
  var target = nfkc(name).toUpperCase();
  var best = null;
  (rules || []).forEach(function (rule) {
    var kw = nfkc(rule.keyword).trim().toUpperCase();
    if (!kw || target.indexOf(kw) < 0) return;
    var pr = toNumber(rule.priority) || 0;
    if (!best || pr > best.pr || (pr === best.pr && kw.length > best.kw.length)) {
      best = { pr: pr, kw: kw, rule: rule };
    }
  });
  if (!best) return { category: '未分類', subcategory: '未分類' };
  return {
    category: nfkc(best.rule.category).trim() || '未分類',
    subcategory: nfkc(best.rule.subcategory).trim() || '未分類'
  };
}

/** メールのカード名（例: 三井住友カード(NL)）に、accounts.mail_match が含まれる口座を探す。 */
function matchAccountByMail(accounts, cardName) {
  var target = nfkc(cardName).toUpperCase();
  var best = null;
  (accounts || []).forEach(function (a) {
    if (a.active !== undefined && a.active !== '' && !toBool(a.active)) return;
    var key = nfkc(a.mail_match).trim().toUpperCase();
    if (!key || target.indexOf(key) < 0) return;
    if (!best || key.length > best.key.length) best = { key: key, account: a };
  });
  return best ? best.account : null;
}

/** "19:17" / 時刻として保存された Date → "19:17"。 */
function toHm(v) {
  if (isDateValue(v)) {
    return new Date(v.getTime() + JST_OFFSET_MS).toISOString().slice(11, 16);
  }
  var m = nfkc(v).trim().match(/^(\d{1,2}):(\d{2})/);
  return m ? pad2(m[1]) + ':' + m[2] : '';
}

function normalizeTransaction(t) {
  return {
    id: nfkc(t.tx_id).trim(),
    date: toYmd(t.date),
    time: toHm(t.time),
    accountId: nfkc(t.account_id).trim(),
    name: nfkc(t.name).trim(),
    amount: toNumber(t.amount),
    fx: nfkc(t.fx).trim(),
    category: nfkc(t.category).trim() || '未分類',
    subcategory: nfkc(t.subcategory).trim() || '未分類',
    status: nfkc(t.status).trim() || '確定',
    transfer: toBool(t.transfer),
    memo: nfkc(t.memo).trim()
  };
}

/**
 * 口座ごとの残高を出す。
 * 最後に入力した残高（balances）を起点にし、その日より後の取引を足す。
 * 起点がない口座は、取引の合計だけで出す。
 */
function computeBalances(accounts, balances, transactions) {
  var anchors = {};
  (balances || []).forEach(function (b) {
    var id = nfkc(b.account_id).trim();
    var date = toYmd(b.date);
    var amount = toNumber(b.amount_jpy);
    if (!id || !date || amount === null) return;
    var prev = anchors[id];
    if (!prev || date >= prev.date) {
      anchors[id] = {
        date: date,
        amount: amount,
        fxAmount: toNumber(b.amount_fx),
        fxCurrency: nfkc(b.fx_currency).trim(),
        source: nfkc(b.source).trim() || '手入力'
      };
    }
  });

  var result = {};
  (accounts || []).forEach(function (a) {
    var id = nfkc(a.id).trim();
    if (!id) return;
    var anchor = anchors[id];
    result[id] = {
      balance: anchor ? anchor.amount : 0,
      fxAmount: anchor ? anchor.fxAmount : null,
      fxCurrency: anchor ? anchor.fxCurrency : '',
      asOf: anchor ? anchor.date : '',
      source: anchor ? anchor.source : '',
      estimated: false
    };
  });

  (transactions || []).forEach(function (t) {
    var r = result[t.accountId];
    if (!r || t.amount === null) return;
    var anchor = anchors[t.accountId];
    if (anchor && t.date <= anchor.date) return;
    r.balance += t.amount;
    r.estimated = true;
    if (!r.asOf || t.date > r.asOf) r.asOf = t.date;
  });

  Object.keys(result).forEach(function (id) {
    if (result[id].estimated) result[id].source = '推定';
  });
  return result;
}

function sortKey(v, fallback) {
  var n = toNumber(v);
  return n === null ? fallback : n;
}

/**
 * input: { institutions, accounts, balances, transactions, history, now }
 *   institutions〜history はシートの行オブジェクト（rowsToObjects の結果）
 */
function buildPayload(input) {
  var now = input.now || new Date();
  var today = toYmd(now);
  var classIds = assetClassIds();
  var validClasses = classIds.concat([LIABILITY_CLASS]);
  var warnings = [];

  var txs = (input.transactions || []).map(normalizeTransaction).filter(function (t) {
    return t.date;
  });

  var accounts = (input.accounts || []).filter(function (a) {
    return nfkc(a.id).trim() && (a.active === undefined || a.active === '' || toBool(a.active));
  });
  var balances = computeBalances(accounts, input.balances, txs);

  var institutions = (input.institutions || [])
    .map(function (inst, i) {
      var type = nfkc(inst.type).trim();
      if (INSTITUTION_TYPES.indexOf(type) < 0) {
        warnings.push('institutions: 種別「' + type + '」は使えないので other として扱います（' + inst.id + '）');
        type = 'other';
      }
      return {
        id: nfkc(inst.id).trim(),
        name: nfkc(inst.name).trim(),
        type: type,
        colors: [nfkc(inst.color1).trim() || '#5b6b7d', nfkc(inst.color2).trim() || nfkc(inst.color1).trim() || '#3f4b59'],
        chip: nfkc(inst.chip).trim(),
        _sort: sortKey(inst.sort, 1000 + i)
      };
    })
    .filter(function (inst) { return inst.id; })
    .sort(function (a, b) { return a._sort - b._sort; });

  var instById = {};
  institutions.forEach(function (inst) {
    inst.accounts = [];
    instById[inst.id] = inst;
  });

  accounts
    .map(function (a, i) {
      return { row: a, _sort: sortKey(a.sort, 1000 + i) };
    })
    .sort(function (a, b) { return a._sort - b._sort; })
    .forEach(function (item) {
      var a = item.row;
      var id = nfkc(a.id).trim();
      var inst = instById[nfkc(a.institution_id).trim()];
      if (!inst) {
        warnings.push('accounts: 金融機関「' + a.institution_id + '」が institutions にありません（' + id + '）');
        return;
      }
      var cls = nfkc(a.asset_class).trim();
      if (validClasses.indexOf(cls) < 0) {
        warnings.push('accounts: 資産クラス「' + cls + '」は使えないので cash として扱います（' + id + '）');
        cls = 'cash';
      }
      var b = balances[id];
      inst.accounts.push({
        id: id,
        name: nfkc(a.name).trim(),
        assetClass: cls,
        balance: b.balance,
        fxAmount: b.fxAmount,
        fxCurrency: b.fxCurrency,
        asOf: b.asOf,
        source: b.source,
        note: nfkc(a.note).trim()
      });
    });

  institutions.forEach(function (inst) { delete inst._sort; });

  var current = classTotals(institutions);
  var history = mergeHistory(input.history || [], { date: today, values: current });

  var since = toYmd(new Date(now.getTime() - TX_WINDOW_DAYS * 24 * 60 * 60 * 1000));
  var recentTxs = txs
    .filter(function (t) { return t.date >= since; })
    .sort(function (a, b) {
      return (b.date + b.time).localeCompare(a.date + a.time);
    });

  return {
    version: 1,
    generatedAt: toJstIso(now),
    classes: ASSET_CLASSES.slice(),
    institutions: institutions,
    transactions: recentTxs,
    history: history,
    warnings: warnings
  };
}

/** 口座の残高を資産クラスごとに合計する（負債は liability）。 */
function classTotals(institutions) {
  var totals = {};
  assetClassIds().concat([LIABILITY_CLASS]).forEach(function (id) { totals[id] = 0; });
  institutions.forEach(function (inst) {
    inst.accounts.forEach(function (a) {
      totals[a.assetClass] = (totals[a.assetClass] || 0) + a.balance;
    });
  });
  return totals;
}

/**
 * history シートの行（{date, cash, fund, ...}）と今日の値をまとめ、日付順の [{date, values}] にする。
 * 同じ日付があれば today の値で上書きする。
 */
function mergeHistory(historyRows, todayPoint) {
  var ids = assetClassIds().concat([LIABILITY_CLASS]);
  var byDate = {};
  historyRows.forEach(function (row) {
    var date = row.values ? row.date : toYmd(row.date);
    if (!date) return;
    var src = row.values || row;
    var values = {};
    ids.forEach(function (id) { values[id] = toNumber(src[id]) || 0; });
    byDate[date] = { date: date, values: values };
  });
  if (todayPoint) byDate[todayPoint.date] = { date: todayPoint.date, values: todayPoint.values };
  return Object.keys(byDate).sort().map(function (d) { return byDate[d]; });
}

/** history の1点を、シートに書く1行（historyColumns の順）に変換する。 */
function historyPointToRow(point) {
  return historyColumns().map(function (col) {
    return col === 'date' ? point.date : (point.values[col] || 0);
  });
}
