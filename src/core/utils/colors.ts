export const getBadgeColor = (text: string): string => {
  const colors = [
    '#00C48C', // Green
    '#00B8D9', // Cyan
    '#6554C0', // Purple
    '#FF5630', // Red
    '#FFAB00', // Yellow
    '#36B37E', // Emerald
    '#0065FF', // Blue
  ];
  
  if (!text) return colors[0];
  
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
