const baseUrl = `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/`;

export const sendMessage = async (message: string): Promise<void> => {
  const response = await fetch(`${baseUrl}sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: process.env.NEXT_PUBLIC_CHAT_ID,
      text: message,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }
};
