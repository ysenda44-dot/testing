// 閉じたカードに出す状態チップ。公式情報に記載のない項目は出さない

export const RESERVATION = {
  none: { tone: 'ok', label: '予約不要' },
  required: { tone: 'warn', label: '要予約' },
  closed: { tone: 'muted', label: '受付終了' },
  unknown: { tone: 'muted', label: '申込の要否は記載なし' },
};

export function eventChips(event) {
  const chips = [];
  if (event.reservation === 'closed') chips.push({ key: 'res', ...RESERVATION.closed });
  if (event.annual) chips.push({ key: 'annual', tone: 'plain', label: '例年の行事' });
  if (event.priceChip) chips.push({ key: 'price', tone: 'plain', label: event.priceChip });
  else if (event.free === true) chips.push({ key: 'price', tone: 'ok', label: '無料' });
  else if (event.free === false) chips.push({ key: 'price', tone: 'plain', label: '有料' });
  if (event.reservation === 'required') chips.push({ key: 'res', ...RESERVATION.required });
  if (event.reservation === 'none') chips.push({ key: 'res', tone: 'plain', label: RESERVATION.none.label });
  if (event.indoor === true) chips.push({ key: 'indoor', tone: 'plain', label: '屋内' });
  if (event.indoor === false) chips.push({ key: 'indoor', tone: 'plain', label: '屋外' });
  if (event.residentsOnly) chips.push({ key: 'residents', tone: 'plain', label: '在住者向け' });
  return chips;
}
