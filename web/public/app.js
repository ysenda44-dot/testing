/* 画面の描画。データは /api/data（?demo のときは sample-data.json）から読む。 */
(function () {
  'use strict';
  var L = window.MoneyLib;

  var ICONS = {
    food: '<path d="M5 3v7a2 2 0 0 0 2 2v9M7 3v5M11 3v5a2 2 0 0 1-2 2M17 3c-1.7 1-2.5 3-2.5 5.5 0 2 .8 3.5 2.5 3.5v9"/>',
    cafe: '<path d="M4 9h13v6a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5V9Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M7 5.5c0 1-1 1-1 2M11 5.5c0 1-1 1-1 2"/>',
    shop: '<path d="M5 8h14l-1.2 12a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10"/>',
    util: '<path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11Z"/>',
    train: '<rect x="5" y="3" width="14" height="13" rx="2.5"/><path d="M5 10h14M9 20l1.5-4M15 20l-1.5-4"/>',
    fun: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m10.5 9.5 4.5 2.5-4.5 2.5v-5Z"/>',
    health: '<path d="M12 20.5S4 15.5 4 9.8A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.8c0 5.7-8 10.7-8 10.7Z"/>',
    house: '<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 17.5h2"/>',
    salary: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/>',
    transfer: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
    other: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>'
  };

  var CATEGORY = {
    '食費': { color: '#e4572e', icon: 'food' },
    '日用品': { color: '#2f9e63', icon: 'shop' },
    '趣味・娯楽': { color: '#d0577a', icon: 'fun' },
    '交際費': { color: '#c2522b', icon: 'food' },
    '交通費': { color: '#7a6fd0', icon: 'train' },
    '衣服・美容': { color: '#b05fc4', icon: 'shop' },
    '健康・医療': { color: '#d0577a', icon: 'health' },
    '自動車': { color: '#5b6b7d', icon: 'train' },
    '教養・教育': { color: '#3a8fb7', icon: 'other' },
    '特別な支出': { color: '#8a6d3b', icon: 'other' },
    '水道・光熱費': { color: '#1f7ae0', icon: 'util' },
    '通信費': { color: '#3aa6b9', icon: 'phone' },
    '住宅': { color: '#2f9e63', icon: 'house' },
    '税・社会保障': { color: '#6b7686', icon: 'other' },
    '保険': { color: '#4f8a8b', icon: 'health' },
    '給与': { color: '#1f7ae0', icon: 'salary' },
    '副収入': { color: '#2f9e63', icon: 'salary' },
    '事業・副業': { color: '#2f9e63', icon: 'salary' },
    '一時所得': { color: '#3aa6b9', icon: 'salary' },
    '配当所得': { color: '#d98a4b', icon: 'salary' },
    'ポイント・その他': { color: '#e8a13a', icon: 'salary' }
  };
  var FALLBACK_COLORS = ['#9aa3b0', '#c2522b', '#3a8fb7', '#8a6d3b', '#4f8a8b', '#b05fc4'];

  var SECTION_TITLES = { bank: '銀行', securities: '証券', card: 'カード（利用残高）', emoney: '電子マネー・QR決済', other: 'その他の資産' };
  var SECTION_ORDER = ['bank', 'securities', 'card', 'emoney', 'other'];
  var TX_PAGE = 120;

  var state = {
    data: null,
    demo: new URLSearchParams(location.search).has('demo'),
    today: '',
    months: [],
    monthIdx: 0,
    ei: 'expense',
    period: 'all',
    filter: '',
    txLimit: TX_PAGE,
    accountIndex: {}
  };

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function svgIcon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.other) + '</svg>';
  }

  function catStyle(name, i) {
    return CATEGORY[name] || { color: FALLBACK_COLORS[(i || 0) % FALLBACK_COLORS.length], icon: 'other' };
  }

  function txIcon(tx) {
    if (tx.transfer) return { color: '#9aa3b0', icon: 'transfer' };
    if (tx.subcategory === 'カフェ') return { color: '#e4572e', icon: 'cafe' };
    if (tx.amount > 0 && !CATEGORY[tx.category]) return { color: '#1f7ae0', icon: 'salary' };
    return catStyle(tx.category);
  }

  /* ---------------- 読み込み ---------------- */

  function load(isRefresh) {
    var url = state.demo ? 'sample-data.json' : '/api/data';
    return fetch(url, { cache: 'no-store', credentials: 'same-origin', redirect: 'error' })
      .then(function (res) {
        if (!res.ok) {
          var err = new Error('HTTP ' + res.status);
          err.status = res.status;
          throw err;
        }
        return res.json();
      })
      .then(function (data) {
        setData(data);
        $('overlay').hidden = true;
        if (isRefresh) showToast(updatedText());
      })
      .catch(function (err) {
        showError(err, isRefresh);
      });
  }

  function showError(err, isRefresh) {
    var msg;
    if (err.status === 404) {
      msg = 'まだデータが届いていません。<br>スプレッドシートのメニュー「資産管理 → 今すぐ更新」を一度実行してください。';
    } else if (err.status === 401 || err.status === 403) {
      msg = 'このデータを見る権限が確認できませんでした。<br>Cloudflare Access の設定を確認してください。';
    } else if (err.status) {
      msg = '読み込みに失敗しました（HTTP ' + err.status + '）。';
    } else {
      msg = '読み込みに失敗しました。<br>ログインの有効期限が切れた可能性があります。再読み込みしてください。';
    }
    if (isRefresh && state.data) {
      showToast('更新に失敗しました');
      return;
    }
    $('overlayText').innerHTML = msg;
    $('retryBtn').hidden = false;
    $('demoLink').hidden = state.demo;
    $('overlay').hidden = false;
  }

  function setData(data) {
    state.data = data;
    state.today = L.todayFrom(data.generatedAt);
    state.accountIndex = {};
    (data.institutions || []).forEach(function (inst) {
      (inst.accounts || []).forEach(function (a) {
        state.accountIndex[a.id] = { account: a, institution: inst };
      });
    });
    state.months = L.availableMonths(data.transactions || [], state.today);
    state.monthIdx = state.months.length - 1;
    document.body.classList.toggle('demo', state.demo);
    renderAll();
  }

  function updatedText() {
    var g = state.data && state.data.generatedAt;
    if (!g) return '';
    return L.shortDate(g.slice(0, 10)) + ' ' + g.slice(11, 16) + ' 時点のデータです';
  }

  function renderAll() {
    renderTx();
    renderBudget();
    renderAccounts();
    renderAssets();
  }

  function accountLabel(accountId) {
    var hit = state.accountIndex[accountId];
    if (!hit) return accountId === 'unmatched' ? '口座未設定' : accountId || '';
    var inst = hit.institution;
    return inst.accounts.length > 1 ? inst.name + '（' + hit.account.name + '）' : inst.name;
  }

  /* ---------------- 入出金 ---------------- */

  function renderTx() {
    var txs = state.data.transactions || [];
    var q = state.filter.toLowerCase();
    var filtered = q
      ? txs.filter(function (t) {
          return [t.name, t.category, t.subcategory, t.memo].join(' ').toLowerCase().indexOf(q) >= 0;
        })
      : txs;
    var shown = filtered.slice(0, state.txLimit);
    var groups = L.groupByDate(shown);
    var html = '';
    if (!groups.length) {
      html = '<p class="empty">' + (q ? '該当する明細がありません。' : 'まだ明細がありません。') + '</p>';
    }
    groups.forEach(function (g) {
      html += '<div class="datehead"><span>' + esc(g.label) + '</span><span class="dsum">支出 ' + esc(L.signedYen(g.expense)) + '</span></div>';
      g.items.forEach(function (t) {
        var st = txIcon(t);
        var cls = t.transfer ? ' transfer' : t.amount > 0 ? ' income' : '';
        var meta = (t.transfer ? '振替' : esc(t.category) + (t.subcategory && t.subcategory !== '未分類' ? '・' + esc(t.subcategory) : '')) +
          ' ／ ' + esc(accountLabel(t.accountId));
        var tag = t.status === '速報' ? '<span class="tag">速報</span>' : '';
        var amount = typeof t.amount === 'number' ? L.signedYen(t.amount) : '—';
        html += '<div class="tx">' +
          '<span class="ic" style="background:' + esc(st.color) + '">' + svgIcon(st.icon) + '</span>' +
          '<span class="mid"><span class="name">' + esc(t.name) + '</span><span class="meta">' + tag + meta + '</span></span>' +
          '<span class="amt' + cls + '"><span class="v">' + esc(amount) + '</span>' +
          (t.fx ? '<span class="fx">' + esc(t.fx) + '</span>' : '') + '</span></div>';
      });
    });
    if (filtered.length > shown.length) {
      html += '<button class="morebtn" id="moreTx">さらに表示（残り ' + (filtered.length - shown.length) + ' 件）</button>';
    }
    $('txList').innerHTML = html;
    var more = $('moreTx');
    if (more) more.addEventListener('click', function () { state.txLimit += TX_PAGE; renderTx(); });

    var mk = L.monthKey(state.today);
    var sum = L.monthlySummary(txs, mk);
    $('txMonthLabel').textContent = +mk.slice(5, 7) + '月の支出合計';
    $('txMonthTotal').textContent = L.signedYen(-sum.expense);
    $('txNote').textContent = (state.demo ? 'サンプルデータを表示しています。 ' : '') + updatedText();
  }

  /* ---------------- 家計簿 ---------------- */

  function drawDonut(cats, total) {
    var cx = 84, cy = 84, r = 66, sw = 25, C = 2 * Math.PI * r, off = 0;
    var html = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--surface2)" stroke-width="' + sw + '"/>';
    cats.forEach(function (c, i) {
      var frac = total ? c.amount / total : 0;
      if (frac <= 0) return;
      var len = Math.max(frac * C - 2.5, 0.5);
      html += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + esc(catStyle(c.name, i).color) +
        '" stroke-width="' + sw + '" stroke-dasharray="' + len + ' ' + (C - len) + '" stroke-dashoffset="' + -off + '"/>';
      off += frac * C;
    });
    $('donut').innerHTML = html;
  }

  function renderBudget() {
    var mk = state.months[state.monthIdx];
    var s = L.monthlySummary(state.data.transactions || [], mk);
    $('mLabel').textContent = L.monthLabel(mk);
    $('mRange').textContent = L.monthRangeLabel(mk, state.today);
    $('mPrev').disabled = state.monthIdx === 0;
    $('mNext').disabled = state.monthIdx === state.months.length - 1;
    $('sumInc').textContent = L.yen(s.income);
    $('sumExp').textContent = L.yen(s.expense);
    var bal = s.income - s.expense;
    $('sumBal').textContent = (bal < 0 ? '−' : '') + L.yen(bal);

    var expense = state.ei === 'expense';
    var cats = expense ? s.expenseCats : s.incomeCats;
    var total = expense ? s.expense : s.income;
    $('donutLabel').textContent = expense ? '支出合計' : '収入合計';
    $('donutValue').textContent = L.yen(total);
    drawDonut(cats, total);

    var list = $('catList');
    if (!cats.length) {
      list.innerHTML = '<p class="empty">この月の' + (expense ? '支出' : '収入') + 'はまだありません。</p>';
      return;
    }
    list.innerHTML = cats.map(function (c, i) {
      var pct = total ? (c.amount / total) * 100 : 0;
      var color = esc(catStyle(c.name, i).color);
      var subs = c.subs.map(function (sb) {
        return '<span class="sub"><span>' + esc(sb.name) + '</span><b>' + esc(L.yen(sb.amount)) + '</b></span>';
      }).join('');
      return '<button class="cat"><span class="r1"><span class="dot" style="background:' + color + '"></span>' +
        '<span class="nm">' + esc(c.name) + '</span><span class="pc">' + pct.toFixed(2) + '%</span>' +
        '<span class="am">' + esc(L.yen(c.amount)) + '</span></span>' +
        '<span class="bar"><i style="width:' + pct + '%;background:' + color + '"></i></span>' +
        '<span class="subs">' + subs + '</span></button>';
    }).join('');
    Array.prototype.forEach.call(list.querySelectorAll('.cat'), function (b) {
      b.addEventListener('click', function () { b.classList.toggle('open'); });
    });
  }

  /* ---------------- 口座 ---------------- */

  function sourceLabel(a) {
    if (!a.asOf) return '未入力';
    return L.shortDate(a.asOf) + ' ' + (a.source || '');
  }

  function renderAccounts() {
    var t = L.totals(state.data);
    $('netValue').textContent = (t.net < 0 ? '-' : '') + L.yen(t.net);
    $('netDetail').textContent = '資産 ' + L.yen(t.assets) + ' ／ 負債 ' + L.yen(t.liabilities);

    var byType = {};
    (state.data.institutions || []).forEach(function (inst) {
      if (!inst.accounts || !inst.accounts.length) return;
      (byType[inst.type] = byType[inst.type] || []).push(inst);
    });

    var html = '';
    SECTION_ORDER.forEach(function (type) {
      var insts = byType[type];
      if (!insts) return;
      html += '<div class="secttl">' + SECTION_TITLES[type] + '</div>';
      if (type === 'bank' || type === 'securities') {
        var sum = 0;
        insts.forEach(function (inst) {
          var latest = inst.accounts.reduce(function (m, a) { return a.asOf > m.asOf ? a : m; }, inst.accounts[0]);
          html += '<div class="bank" style="background:linear-gradient(135deg,' + esc(inst.colors[0]) + ',' + esc(inst.colors[1]) + ')">' +
            '<div class="bhead"><span>' + esc(inst.name) + '</span><span class="upd">' + esc(sourceLabel(latest)) + '</span></div>';
          inst.accounts.forEach(function (a) {
            sum += a.balance;
            var fx = a.fxAmount !== null && a.fxAmount !== undefined && a.fxCurrency
              ? '<span class="f">' + esc(Number(a.fxAmount).toLocaleString('ja-JP', { maximumFractionDigits: 2 })) + ' ' + esc(a.fxCurrency) + '</span>'
              : '';
            html += '<div class="acct"><span class="an">' + esc(a.name) + '</span><span class="av"><span class="j">' +
              esc(L.signedYen(a.balance)) + '</span>' + fx + '</span></div>';
          });
          html += '</div>';
        });
        html += '<div class="banktotal"><span>' + SECTION_TITLES[type] + '合計（' + insts.length + '社）</span><b>' + esc(L.yen(sum)) + '</b></div>';
      } else {
        insts.forEach(function (inst) {
          inst.accounts.forEach(function (a) {
            var name = type === 'other' ? a.name : inst.accounts.length > 1 ? inst.name + '（' + a.name + '）' : inst.name;
            var chip = inst.chip || inst.name.slice(0, 4);
            var value = a.assetClass === 'liability' ? L.yen(a.balance) : L.signedYen(a.balance);
            html += '<div class="cardrow"><span class="chip" style="background:' + esc(inst.colors[0]) + '">' + esc(chip) + '</span>' +
              '<span class="cm"><span class="cn">' + esc(name) + '</span><span class="cd">' + esc(a.note || '') + '</span></span>' +
              '<span class="ca"><span class="v">' + esc(value) + '</span><span class="d">' + esc(sourceLabel(a)) + '</span></span></div>';
          });
        });
      }
    });
    $('accountSections').innerHTML = html || '<p class="empty">口座がまだ登録されていません。<br>スプレッドシートの institutions と accounts に追加してください。</p>';
  }

  /* ---------------- 資産 ---------------- */

  function changeHtml(n) {
    if (n === null) return '<span class="c flat">—</span>';
    if (Math.round(n) === 0) return '<span class="c flat">±¥0</span>';
    return '<span class="c ' + (n > 0 ? 'up' : 'down') + '">' + (n > 0 ? '▲ +' : '▼ −') + esc(L.yen(n)) + '</span>';
  }

  function renderAssets() {
    var data = state.data;
    var classes = data.classes || [];
    var ids = classes.map(function (c) { return c.id; });
    var t = L.totals(data);
    var history = data.history || [];
    var prevPoint = L.pointAtOrBefore(history, L.prevMonthEnd(state.today));
    var firstPoint = history[0] || null;
    var prevTotal = prevPoint ? L.pointTotal(prevPoint, ids) : null;
    var firstTotal = firstPoint ? L.pointTotal(firstPoint, ids) : null;

    var p = state.today.split('-');
    $('asOfLabel').textContent = p.length === 3 ? p[0] + '年' + +p[1] + '月' + +p[2] + '日時点' : '';
    $('assetTotal').textContent = L.yen(t.assets);
    $('assetChips').innerHTML =
      '<span>前月比 ' + diffChip(prevTotal === null ? null : t.assets - prevTotal) + '</span>' +
      '<span>全期間比 ' + diffChip(firstTotal === null ? null : t.assets - firstTotal) + '</span>';
    $('prevMonthValue').textContent = prevTotal === null ? '—' : L.yen(prevTotal);

    renderChart(ids, classes);

    $('trendList').innerHTML = classes.map(function (c) {
      var change = prevPoint ? t.byClass[c.id] - (+(prevPoint.values[c.id] || 0)) : null;
      return '<div class="brow"><span class="dot" style="background:' + esc(c.color) + '"></span><span class="nm">' + esc(c.name) + '</span>' +
        '<span class="av"><span class="j">' + esc(L.yen(t.byClass[c.id] || 0)) + '</span>' + changeHtml(change) + '</span></div>';
    }).join('');

    $('breakTotal').textContent = '合計 ' + L.yen(t.assets);
    $('stackbar').innerHTML = classes.map(function (c) {
      var share = t.assets > 0 ? Math.max(0, t.byClass[c.id] || 0) / t.assets * 100 : 0;
      return '<i style="width:' + share + '%;background:' + esc(c.color) + '" title="' + esc(c.name) + '"></i>';
    }).join('');
    $('breakList').innerHTML = classes.map(function (c) {
      var share = t.assets > 0 ? (t.byClass[c.id] || 0) / t.assets * 100 : 0;
      return '<div class="brow"><span class="dot" style="background:' + esc(c.color) + '"></span>' +
        '<span class="nm">' + esc(c.name) + '<small>構成比 ' + share.toFixed(1) + '%</small></span>' +
        '<span class="av"><span class="j">' + esc(L.yen(t.byClass[c.id] || 0)) + '</span></span></div>';
    }).join('');
  }

  function diffChip(n) {
    if (n === null) return '<b class="flat">—</b>';
    return '<b class="' + (n > 0 ? 'up' : n < 0 ? 'down' : 'flat') + '">' + (n < 0 ? '-' : '+') + esc(L.yen(n)) + '</b>';
  }

  function renderChart(ids, classes) {
    var points = L.filterPeriod(state.data.history || [], state.period, state.today);
    var box = { left: 52, right: 372, top: 14, bottom: 168 };
    var chart = L.stackedArea(points, ids, box);
    if (!chart) {
      $('chartBox').innerHTML = '<p class="empty">推移グラフは、2日分以上の記録がたまると表示されます。</p>';
      return;
    }
    var colors = {};
    classes.forEach(function (c) { colors[c.id] = c.color; });
    var svg = '<svg viewBox="0 0 380 196" role="img" aria-label="資産クラス別の積み上げ推移グラフ">';
    chart.yLabels.forEach(function (l) {
      svg += '<line x1="' + box.left + '" y1="' + l.y + '" x2="' + box.right + '" y2="' + l.y + '" stroke="var(--line)"/>' +
        '<text x="6" y="' + (l.y + 3) + '" font-size="9" fill="var(--faint)">' + esc(l.text) + '</text>';
    });
    chart.layers.forEach(function (layer) {
      svg += '<path d="' + layer.d + '" fill="' + esc(colors[layer.id]) + '"/>';
    });
    chart.xLabels.forEach(function (l) {
      svg += '<text x="' + l.x + '" y="186" font-size="9" fill="var(--faint)" text-anchor="' + l.anchor + '">' + esc(l.text) + '</text>';
    });
    svg += '</svg>';
    $('chartBox').innerHTML = svg;
  }

  /* ---------------- 操作 ---------------- */

  var toastTimer = null;
  function showToast(text) {
    if (!text) return;
    var toast = $('toast');
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  function bindEvents() {
    var tabBtns = document.querySelectorAll('.tabbar button');
    Array.prototype.forEach.call(tabBtns, function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(tabBtns, function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        Array.prototype.forEach.call(document.querySelectorAll('.view'), function (v) { v.classList.remove('active'); });
        $(b.dataset.view).classList.add('active');
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('.refreshBtn'), function (b) {
      b.addEventListener('click', function () {
        b.classList.remove('spinning');
        void b.offsetWidth;
        b.classList.add('spinning');
        load(true);
      });
    });

    $('searchBtn').addEventListener('click', function () {
      var sb = $('searchbar');
      sb.classList.toggle('open');
      if (sb.classList.contains('open')) $('searchInput').focus();
    });
    $('searchInput').addEventListener('input', function (e) {
      state.filter = e.target.value.trim();
      state.txLimit = TX_PAGE;
      if (state.data) renderTx();
    });

    $('mPrev').addEventListener('click', function () {
      if (state.monthIdx > 0) { state.monthIdx--; renderBudget(); }
    });
    $('mNext').addEventListener('click', function () {
      if (state.monthIdx < state.months.length - 1) { state.monthIdx++; renderBudget(); }
    });
    Array.prototype.forEach.call(document.querySelectorAll('#eiSeg button'), function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('#eiSeg button'), function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        state.ei = b.dataset.ei;
        renderBudget();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('#assetSeg button'), function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('#assetSeg button'), function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var trend = b.dataset.av === 'trend';
        $('trendPane').style.display = trend ? '' : 'none';
        $('breakPane').style.display = trend ? 'none' : '';
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('#periods button'), function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('#periods button'), function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        state.period = b.dataset.p;
        if (state.data) renderChart(state.data.classes.map(function (c) { return c.id; }), state.data.classes);
      });
    });

    $('retryBtn').addEventListener('click', function () {
      $('overlayText').textContent = '読み込み中…';
      $('retryBtn').hidden = true;
      location.reload();
    });
  }

  bindEvents();
  load(false);
})();
