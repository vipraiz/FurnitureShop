new window.JustValidate('.subscribe__form', {
  rules: {
    email: {
      required: true,
      email: true,
    },
  },
  messages: {
    email: {
      required: 'You must enter an email',
      email: 'You must enter a valid email address',
    },
  },

  submitHandler: function (form, values, ajax) {
    console.log('submited');
    // ajax({
    //   url: 'https://just-validate-api.herokuapp.com/submit',
    //   method: 'POST',
    //   data: values,
    //   async: true,
    //   callback: function (response) {
    //     console.log(response);
    //   },
    // });
  },
});
