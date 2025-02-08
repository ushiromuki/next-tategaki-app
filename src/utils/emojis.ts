
const userEmojis = ['🐱', '🐶', '🐼', '🐨', '🦊', '🦁', '🐯', '🦒', '🦘', '🦔', '🐸', '🦜'];

export const getRandomEmoji = () => {
  return userEmojis[Math.floor(Math.random() * userEmojis.length)];
};
export const getRandomEmoji = () => {
  const emojis = ['👋', '🌟', '✨', '💫', '🎨', '📝', '✏️', '🖋️'];
  return emojis[Math.floor(Math.random() * emojis.length)];
};
