import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkinDate = searchParams.get('checkinDate');
  const checkoutDate = searchParams.get('checkoutDate');
  const adultNum = searchParams.get('adultNum');
  const largeAreaCode = searchParams.get('largeAreaCode');

  if (!checkinDate || !checkoutDate || !adultNum || !largeAreaCode) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const appId = process.env.RAKUTEN_APP_ID;
  console.log('[lodging] RAKUTEN_APP_ID:', appId ? `${appId.slice(0, 4)}****` : 'undefined');

  if (!appId || appId === 'ここに取得したアプリIDを入力') {
    return NextResponse.json({ error: 'RAKUTEN_APP_ID is not configured' }, { status: 500 });
  }

  const params = new URLSearchParams({
    applicationId: appId,
    format: 'json',
    checkinDate,
    checkoutDate,
    adultNum,
    largeClassCode: largeAreaCode,
    hits: '10',
    sort: '+roomCharge',
  });

  const requestUrl = `https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20170426?${params.toString()}`;
  console.log('[lodging] Request URL:', requestUrl.replace(appId, `${appId.slice(0, 4)}****`));

  try {
    const res = await fetch(requestUrl, {
      headers: {
        Referer: 'http://example.com',
      },
    });

    console.log('[lodging] Rakuten API status:', res.status, res.statusText);
    if (!res.ok) {
      const errBody = await res.text();
      console.log('[lodging] Rakuten API error body:', errBody);
      return NextResponse.json({ error: 'Rakuten API request failed', status: res.status, detail: errBody }, { status: 500 });
    }

    const data = await res.json();

    if (!data.hotels || data.hotels.length === 0) {
      return NextResponse.json({ error: 'No hotels found' }, { status: 404 });
    }

    type HotelEntry = {
      hotel: Array<{ hotelBasicInfo?: { hotelName: string; hotelMinCharge: number } }>;
    };

    const hotels = data.hotels as HotelEntry[];

    const prices = hotels
      .map(h => h.hotel[0]?.hotelBasicInfo?.hotelMinCharge)
      .filter((p): p is number => typeof p === 'number' && p > 0);

    const names = hotels
      .slice(0, 3)
      .map(h => h.hotel[0]?.hotelBasicInfo?.hotelName)
      .filter((n): n is string => typeof n === 'string');

    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const standardPrice =
      prices.length > 0
        ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        : null;

    return NextResponse.json({ minPrice, standardPrice, hotelNames: names });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch lodging data' }, { status: 500 });
  }
}
