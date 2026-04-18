export const getData = async (file: string, lang = 'de') => {
  const data = await import(`@/data/${lang}/${file}.json`);
  return data.default;
};
