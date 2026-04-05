import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to   = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json({ error: 'from and to are required' }, { status: 400 });
  }

  const appId = process.env.YAHOO_APP_ID;
  if (!appId) {
    return NextResponse.json({ error: 'YAHOO_APP_ID is not configured' }, { status: 500 });
  }

  // 出発日時: 翌平日の09:00 (固定で十分)
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '') + '0900';

  const params = new URLSearchParams({
    appid:      appId,
    output:     'json',
    from,
    to,
    fromtime:   dateStr,
    searchType: 'arrival',
    ticket:     'ic',
    sort:       'cheap',
    count:      '1',
  });

  try {
    const res = await fetch(
      `https://map.yahooapis.jp/transit/V1/search?${params.toString()}`
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[transport] Yahoo API error:', res.status, errText);
      return NextResponse.json({ error: 'Yahoo API request failed', status: res.status }, { status: 500 });
    }

    const data = await res.json();
    const route = data.Feature?.[0]?.Property;

    if (!route) {
      return NextResponse.json({ error: 'No route found' }, { status: 404 });
    }

    // 運賃・所要時間
    const cost: number = route.TotalFare ?? 0;
    const minutes: number = route.TotalDuration ?? 0;

    // 交通手段名を取得（新幹線・飛行機などを優先表示）
    const sections: Array<{ Transport?: { Name?: string; Type?: string } }> =
      route.TransportSection ?? [];
    const methodNames = sections
      .map(s => s.Transport?.Name)
      .filter((n): n is string => !!n);

    let method = methodNames.join('+') || '電車';
    if (methodNames.some(n => n.includes('新幹線'))) method = '新幹線';
    else if (methodNames.some(n => n.includes('飛行機') || n.includes('航空'))) method = '飛行機';

    return NextResponse.json({ cost, minutes, method });
  } catch (err) {
    console.error('[transport] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch transport data' }, { status: 500 });
  }
}
