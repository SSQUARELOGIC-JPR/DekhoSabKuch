export const translateDynamic = (
  value: string,
  group: Record<string, string>
) => {
  if (!value) return value;

  const key = value.toLowerCase().replace(/\s+/g, '_');
  return group[key] || value;
};