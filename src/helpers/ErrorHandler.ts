export default {
  handleError: (error: Error) => {
    console.log(error);
    if (error.message) {
      // alert(error.message);
    }
  },
};
