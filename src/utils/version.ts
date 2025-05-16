
export const getLatestVersion = (content: string): string => {
  const versionRegex = /\[(\d+\.\d+\.\d+)\]/;
  const matches = content.match(new RegExp(versionRegex, 'g'));
  if (!matches) return '0.0.0';
  
  return matches[0].match(versionRegex)![1];
};
