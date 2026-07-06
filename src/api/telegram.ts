export const sendMessage = async (message: string): Promise<void> => {
  const response = await fetch('/api/telegram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }
};
