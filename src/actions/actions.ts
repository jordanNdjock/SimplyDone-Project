'use server'
 
export async function sendNotifs(): Promise<void> {
  const url = 'https://api.onesignal.com/notifications?c=push';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Key ${process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      contents: {en: 'Your message body here.'},
      included_segments: ['Test Users']
    })
  };
  
  fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));
};