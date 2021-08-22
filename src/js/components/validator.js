new window.JustValidate('.subscribe__form', {
  rules: {
    email: {
      required: true,
      email: true,
    },
  },
  messages: {
    email: {
      required: 'Вы должны ввести email',
      email: 'Введите корректный email',
    },
  },

  submitHandler: function (form, values, ajax) {
    console.log('submit');
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
