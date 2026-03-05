const API_URL = import.meta.env.VITE_API_URL;

export const chatWithAI = async (message, token, chatHistory = [], userProfile = {}) => {
  if (!token) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        message,
        chat_history: chatHistory,
        user_profile: userProfile
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
};
