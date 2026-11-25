/**
 * 利用通知メールの本文から取引を取り出す。
 * Google のサービスを呼ばない純粋な関数だけを置き、手元でテストできるようにしている。
 */

var SMBC_CARD_QUERY = 'from:statement@vpass.ne.jp subject:ご利用のお知らせ';
var SMBC_CARD_SENDER = 'statement@vpass.ne.jp';

function normalizeMailText(body) {
  return nfkc(body).replace(/\r\n?/g, '\n').replace(/　/g, ' ');
}

/**
 * 三井住友カード「ご利用のお知らせ」の本文を読む。
 * 取り出せなければ null（カードの利用以外のお知らせなど）。
 *
 * 戻り値: { cardName, date: 'YYYY-MM-DD', time: 'HH:MM', merchant, kind, amount, fx }
 *   amount は円（支出はマイナス）。外貨のみで円が書かれていない場合は null で、fx に "12.34 USD" を入れる。
 */
function parseSmbcCardMail(body) {
  var text = normalizeMailText(body);
  return parseSmbcPlainFormat_(text) || parseSmbcSummaryFormat_(text);
}

/** テキスト形式: 「◇利用日:2026/11/24 19:17」「◇利用先:…」「◇利用金額:587円」が行ごとに並ぶ */
function parseSmbcPlainFormat_(text) {
  var date = text.match(/利用日(?:時)?\s*:\s*(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/);
  var merchant = text.match(/利用先\s*:\s*(.+)/);
  var amountLine = text.match(/利用金額\s*:\s*(.+)/);
  if (!date || !merchant || !amountLine) return null;
  var kind = text.match(/利用取引\s*:\s*(.+)/);
  var card = text.match(/ご利用カード\s*:\s*(.+)/);
  var money = parseAmount_(amountLine[1]);
  if (!money) return null;
  var kindText = kind ? kind[1].trim() : '';
  return {
    cardName: card ? card[1].trim() : '',
    date: date[1] + '-' + pad2(date[2]) + '-' + pad2(date[3]),
    time: date[4] ? pad2(date[4]) + ':' + date[5] : '',
    merchant: merchant[1].trim(),
    kind: kindText,
    amount: signForKind_(money.yen, kindText),
    fx: money.fx
  };
}

/** 要約形式: 「…(NL)についてカードの利用内容…ご利用日時:2026/11/24 19:17 イオン(買物) 587円」 */
function parseSmbcSummaryFormat_(text) {
  var flat = text.replace(/\s+/g, ' ');
  var m = flat.match(/ご利用日時\s*:\s*(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})\s+(.+?)\(([^()]*)\)\s*([\d,]+(?:\.\d+)?\s*(?:円|[A-Z]{3}))/);
  if (!m) return null;
  var money = parseAmount_(m[8]);
  if (!money) return null;
  var card = flat.match(/([^\s。]+?)について(?:カードの)?(?:ご)?利用内容/);
  return {
    cardName: card ? card[1].trim() : '',
    date: m[1] + '-' + pad2(m[2]) + '-' + pad2(m[3]),
    time: pad2(m[4]) + ':' + m[5],
    merchant: m[6].trim(),
    kind: m[7].trim(),
    amount: signForKind_(money.yen, m[7]),
    fx: money.fx
  };
}

/** "1,234円" / "12.34 USD" / "12.34USD(1,900円)" → { yen: 1234 | null, fx: '' | '12.34 USD' } */
function parseAmount_(s) {
  var yen = s.match(/([\d,]+)\s*円/);
  var fx = s.match(/([\d,]+(?:\.\d+)?)\s*([A-Z]{3})\b/);
  if (!yen && !fx) return null;
  return {
    yen: yen ? Number(yen[1].replace(/,/g, '')) : null,
    fx: fx ? fx[1] + ' ' + fx[2] : ''
  };
}

/** 支出はマイナス。取消・返品はプラス。 */
function signForKind_(yen, kind) {
  if (yen === null) return null;
  return /取消|返品|キャンセル/.test(kind || '') ? yen : -yen;
}
