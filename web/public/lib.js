/* 画面で使う計算（DOM に触らない純粋な関数）。テストからも読み込む。 */
(function (root) {
  'use strict';

  var WEEK = ['日', '月', '火', '水', '木', '金', '土'];
  var DAY_MS = 24 * 60 * 60 * 1000;

  function yen(n) {
    return '¥' + Math.round(Math.abs(n)).toLocaleString('ja-JP');
  }

  function signedYen(n) {
    return (n < 0 ? '¥-' : '¥') + Math.round(Math.abs(n)).toLocaleString('ja-JP');
  }

  function compactYen(n) {
    var a = Math.abs(n);
    var s = n < 0 ? '-' : '';
    if (a >= 1e8) return s + trimZeros((a / 1e8).toFixed(2)) + '億円';
    if (a >= 1e4) return s + Math.round(a / 1e4) + '万円';
    return s + Math.round(a) + '円';
  }

  function trimZeros(s) {
    return s.replace(/\.?0+$/, '');
  }

  function parseYmd(ymd) {
    var p = ymd.split('-');
    return Date.UTC(+p[0], +p[1] - 1, +p[2]);
  }

  function ymdFromMs(ms) {
    return new Date(ms).toISOString().slice(0, 10);
  }

  function dateLabel(ymd) {
    var p = ymd.split('-');
    var w = new Date(parseYmd(ymd)).getUTCDay();
    return p[0] + '年' + +p[1] + '月' + +p[2] + '日（' + WEEK[w] + '）';
  }

  function shortDate(ymd) {
    if (!ymd) return '';
    var p = ymd.split('-');
    return +p[1] + '/' + +p[2];
  }

  function monthKey(ymd) {
    return ymd.slice(0, 7);
  }

  function monthLabel(mk) {
    return mk.slice(0, 4) + '年' + +mk.slice(5, 7) + '月';
  }

  function lastDayOfMonth(mk) {
    return new Date(Date.UTC(+mk.slice(0, 4), +mk.slice(5, 7), 0)).getUTCDate();
  }

  /** "2026-11-25T07:00:00+09:00" → "2026-11-25" */
  function todayFrom(generatedAt) {
    return String(generatedAt || '').slice(0, 10);
  }

  /** 家計簿に数える取引か（振替と、円の金額がないものは除く） */
  function isCountable(tx) {
    return !tx.transfer && typeof tx.amount === 'number' && isFinite(tx.amount);
  }

  function sortTxDesc(txs) {
    return txs.slice().sort(function (a, b) {
      return (b.date + (b.time || '')).localeCompare(a.date + (a.time || ''));
    });
  }

  /** 日付ごとにまとめる（新しい順） */
  function groupByDate(txs) {
    var groups = [];
    var byDate = {};
    sortTxDesc(txs).forEach(function (tx) {
      var g = byDate[tx.date];
      if (!g) {
        g = byDate[tx.date] = { date: tx.date, label: dateLabel(tx.date), items: [], expense: 0 };
        groups.push(g);
      }
      g.items.push(tx);
      if (isCountable(tx) && tx.amount < 0) g.expense += tx.amount;
    });
    return groups;
  }

  function addTo(map, cat, sub, amount) {
    var c = map[cat] || (map[cat] = { name: cat, amount: 0, subs: {} });
    c.amount += amount;
    c.subs[sub] = (c.subs[sub] || 0) + amount;
  }

  function toCatList(map) {
    return Object.keys(map)
      .map(function (k) {
        var c = map[k];
        var subs = Object.keys(c.subs)
          .map(function (s) { return { name: s, amount: c.subs[s] }; })
          .sort(function (a, b) { return b.amount - a.amount; });
        return { name: c.name, amount: c.amount, subs: subs };
      })
      .sort(function (a, b) { return b.amount - a.amount; });
  }

  /** ある月の収入・支出と、大項目・中項目ごとの内訳 */
  function monthlySummary(txs, mk) {
    var income = 0;
    var expense = 0;
    var inc = {};
    var exp = {};
    txs.forEach(function (tx) {
      if (!isCountable(tx) || monthKey(tx.date) !== mk) return;
      var cat = tx.category || '未分類';
      var sub = tx.subcategory || '未分類';
      if (tx.amount < 0) {
        expense += -tx.amount;
        addTo(exp, cat, sub, -tx.amount);
      } else if (tx.amount > 0) {
        income += tx.amount;
        addTo(inc, cat, sub, tx.amount);
      }
    });
    return { income: income, expense: expense, expenseCats: toCatList(exp), incomeCats: toCatList(inc) };
  }

  /** 取引がある月 + 今月（古い順） */
  function availableMonths(txs, today) {
    var set = {};
    txs.forEach(function (tx) { if (tx.date) set[monthKey(tx.date)] = true; });
    if (today) set[monthKey(today)] = true;
    return Object.keys(set).sort();
  }

  function monthRangeLabel(mk, today) {
    var m = +mk.slice(5, 7);
    var end = today && monthKey(today) === mk ? +today.slice(8, 10) : lastDayOfMonth(mk);
    return m + '月1日 〜 ' + m + '月' + end + '日';
  }

  /** 口座の残高を資産クラスごとに合計。liability は負債（マイナス）。 */
  function totals(data) {
    var byClass = {};
    (data.classes || []).forEach(function (c) { byClass[c.id] = 0; });
    var liabilities = 0;
    (data.institutions || []).forEach(function (inst) {
      (inst.accounts || []).forEach(function (a) {
        if (a.assetClass === 'liability') {
          liabilities += a.balance;
        } else {
          byClass[a.assetClass] = (byClass[a.assetClass] || 0) + a.balance;
        }
      });
    });
    var assets = 0;
    Object.keys(byClass).forEach(function (k) { assets += byClass[k]; });
    return { byClass: byClass, assets: assets, liabilities: liabilities, net: assets + liabilities };
  }

  function pointTotal(point, classIds) {
    var s = 0;
    classIds.forEach(function (id) { s += +(point.values[id] || 0); });
    return s;
  }

  /** ymd 以前で一番新しい点 */
  function pointAtOrBefore(history, ymd) {
    var found = null;
    for (var i = 0; i < history.length; i++) {
      if (history[i].date <= ymd) found = history[i];
      else break;
    }
    return found;
  }

  function prevMonthEnd(today) {
    var y = +today.slice(0, 4);
    var m = +today.slice(5, 7);
    return ymdFromMs(Date.UTC(y, m - 1, 0));
  }

  function filterPeriod(history, period, today) {
    var years = { '1y': 1, '3y': 3, '5y': 5 }[period];
    if (!years || !today) return history;
    var cutoff = +today.slice(0, 4) - years + today.slice(4);
    return history.filter(function (p) { return p.date >= cutoff; });
  }

  function niceMax(v) {
    if (!(v > 0)) return 1;
    var e = Math.pow(10, Math.floor(Math.log(v) / Math.LN10));
    var f = v / e;
    var steps = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
    for (var i = 0; i < steps.length; i++) if (f <= steps[i] + 1e-9) return steps[i] * e;
    return 10 * e;
  }

  function downsample(points, max) {
    if (points.length <= max) return points;
    var out = [];
    var step = (points.length - 1) / (max - 1);
    for (var i = 0; i < max; i++) out.push(points[Math.round(i * step)]);
    return out;
  }

  function f1(n) {
    return Math.round(n * 10) / 10;
  }

  /**
   * 積み上げ面グラフの path を作る。
   * box: { left, right, top, bottom }（SVG 座標）
   */
  function stackedArea(points, classIds, box) {
    if (!points || points.length < 2) return null;
    var pts = downsample(points, 360);
    var t0 = parseYmd(pts[0].date);
    var t1 = parseYmd(pts[pts.length - 1].date);
    if (t1 === t0) t1 = t0 + DAY_MS;
    var cum = pts.map(function (p) {
      var acc = 0;
      return classIds.map(function (id) {
        acc += Math.max(0, +(p.values[id] || 0));
        return acc;
      });
    });
    var top = 0;
    cum.forEach(function (c) { if (c[c.length - 1] > top) top = c[c.length - 1]; });
    var max = niceMax(top);
    var w = box.right - box.left;
    var h = box.bottom - box.top;
    var xs = pts.map(function (p) { return box.left + ((parseYmd(p.date) - t0) / (t1 - t0)) * w; });
    function y(v) { return box.bottom - (v / max) * h; }

    var layers = classIds.map(function (id, i) {
      var upper = xs.map(function (x, k) { return f1(x) + ',' + f1(y(cum[k][i])); });
      var lower = xs
        .map(function (x, k) { return f1(x) + ',' + f1(y(i === 0 ? 0 : cum[k][i - 1])); })
        .reverse();
      return { id: id, d: 'M' + upper.join(' L') + ' L' + lower.join(' L') + ' Z' };
    });

    var xLabels = [0, 0.25, 0.5, 0.75, 1].map(function (r) {
      var d = new Date(t0 + r * (t1 - t0));
      return {
        x: box.left + r * w,
        anchor: r === 0 ? 'start' : r === 1 ? 'end' : 'middle',
        text: String(d.getUTCFullYear()).slice(2) + '年' + (d.getUTCMonth() + 1) + '月'
      };
    });
    var yLabels = [
      { y: box.top, text: compactYen(max) },
      { y: box.top + h / 2, text: compactYen(max / 2) },
      { y: box.bottom, text: '0円' }
    ];
    return { layers: layers, xLabels: xLabels, yLabels: yLabels, max: max };
  }

  root.MoneyLib = {
    yen: yen,
    signedYen: signedYen,
    compactYen: compactYen,
    dateLabel: dateLabel,
    shortDate: shortDate,
    monthKey: monthKey,
    monthLabel: monthLabel,
    monthRangeLabel: monthRangeLabel,
    todayFrom: todayFrom,
    isCountable: isCountable,
    groupByDate: groupByDate,
    monthlySummary: monthlySummary,
    availableMonths: availableMonths,
    totals: totals,
    pointTotal: pointTotal,
    pointAtOrBefore: pointAtOrBefore,
    prevMonthEnd: prevMonthEnd,
    filterPeriod: filterPeriod,
    niceMax: niceMax,
    stackedArea: stackedArea
  };
})(typeof window !== 'undefined' ? window : globalThis);
