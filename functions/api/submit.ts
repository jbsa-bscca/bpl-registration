export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    
    const playerName = formData.get('playerName') as string;
    const contactNumber = formData.get('contactNumber') as string;
    const villageName = formData.get('villageName') as string;
    const playerRole = formData.get('playerRole') as string;
    const battingRole = formData.get('battingRole') as string;
    const bowlingRole = formData.get('bowlingRole') as string;
    const playerPhoto = formData.get('playerPhoto') as File;
    const paymentScreenshot = formData.get('paymentScreenshot') as File;

    if (!playerName || !playerPhoto || !paymentScreenshot) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram Environment Variables');
      return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const caption = `🏏 *New Registration* 🏏\n\n` +
      `👤 *Name:* ${playerName}\n` +
      `📞 *Contact:* ${contactNumber}\n` +
      `🏡 *Village/Team:* ${villageName}\n` +
      `🎯 *Role:* ${playerRole}\n` +
      `🏏 *Batting:* ${battingRole}\n` +
      `🎳 *Bowling:* ${bowlingRole}\n\n` +
      `Please find the player photo attached.`;

    // 1. Send Player Photo with details as caption
    const playerPhotoData = new FormData();
    playerPhotoData.append('chat_id', TELEGRAM_CHAT_ID);
    playerPhotoData.append('photo', playerPhoto);
    playerPhotoData.append('caption', caption);
    playerPhotoData.append('parse_mode', 'Markdown');

    const photoResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: playerPhotoData
    });

    if (!photoResponse.ok) {
      const err = await photoResponse.text();
      console.error('Telegram API Error (Photo):', err);
      throw new Error('Failed to send data to Telegram');
    }

    // 2. Send Payment Screenshot
    const paymentCaption = `💰 *Payment Screenshot* for ${playerName}`;
    const paymentPhotoData = new FormData();
    paymentPhotoData.append('chat_id', TELEGRAM_CHAT_ID);
    paymentPhotoData.append('photo', paymentScreenshot);
    paymentPhotoData.append('caption', paymentCaption);
    paymentPhotoData.append('parse_mode', 'Markdown');

    const paymentResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: paymentPhotoData
    });

    if (!paymentResponse.ok) {
      console.error('Telegram API Error (Payment):', await paymentResponse.text());
      // Even if payment screenshot fails, we already sent the main data. Still throwing error so client knows.
      throw new Error('Failed to send payment screenshot to Telegram');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error processing form:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
