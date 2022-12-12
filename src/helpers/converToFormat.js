export const convertToSelectData = (data) => {
  return data.map(({ name }) => ({ label: name, value: name }));
};
