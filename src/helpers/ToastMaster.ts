const makeText = (text: string | object) => {
  alert(typeof text === 'object' ? text.fa : text);
};

export default {
  makeText,
};
