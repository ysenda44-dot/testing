const pad = (n) => String(n).padStart(2, '0');

function toCalStamp(iso, hm) {
  const [h, m] = hm.split(':').map(Number);
  return `${iso.replaceAll('-', '')}T${pad(h)}${pad(m)}00`;
}

function addMinutes(hm, minutes) {
  const [h, m] = hm.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
}

/** その日の開始・終了時刻。終了が未定なら開始の1時間後にする */
export function hoursOn(event, iso) {
  const h = event.hours?.[iso] || event.hours?.default;
  if (!h) return null;
  const [start, end] = h;
  return { start, end: end || addMinutes(start, 60), endKnown: Boolean(end) };
}

export function googleCalendarUrl(event, venue, iso, pageUrl) {
  const h = hoursOn(event, iso);
  const dates = h
    ? `${toCalStamp(iso, h.start)}/${toCalStamp(iso, h.end)}`
    : `${iso.replaceAll('-', '')}/${iso.replaceAll('-', '')}`;
  const details = [
    event.description,
    h && !h.endKnown ? '※終了時刻は公式情報に記載がないため、仮に1時間で登録しています。' : '',
    `公式情報: ${event.sourceUrl}`,
    pageUrl ? `イベントページ: ${pageUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates,
    ctz: 'Asia/Tokyo',
    location: [venue.name, event.room, venue.address].filter(Boolean).join(' '),
    details,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function mapUrl(venue) {
  const [lat, lng] = venue.coordinates;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function directionsUrl(venue) {
  const [lat, lng] = venue.coordinates;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** このサイト内で、その日・そのイベントを開くURL */
export function eventPageUrl(eventId, iso) {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('d', iso);
  url.searchParams.set('e', eventId);
  return url.toString();
}
