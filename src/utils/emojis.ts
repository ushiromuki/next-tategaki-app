
const userEmojis = ['🐱', '🐶', '🐼', '🐨', '🦊', '🦁', '🐯', '🦒', '🦘', '🦔', '🐸', '🦜'];

export const getRandomEmoji = () => {
  return userEmojis[Math.floor(Math.random() * userEmojis.length)];
};
