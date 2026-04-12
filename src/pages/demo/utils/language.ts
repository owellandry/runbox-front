export const getLanguage = (path: string) => {
  if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript';
  if (path.endsWith('.json'))                         return 'json';
  if (path.endsWith('.css'))                          return 'css';
  return 'javascript';
};
