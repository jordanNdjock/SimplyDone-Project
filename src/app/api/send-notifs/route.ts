import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, title, message } = body;

  const url = 'https://onesignal.com/api/v1/notifications?c=push';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      headings: { en: title },
      contents: { en: message },
      target_channel: 'push',
      include_external_user_ids: [userId],
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur OneSignal:", error);
    return NextResponse.json({ error: "Erreur envoi notification" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "✅ API /send-notifs opérationnelle" });
}