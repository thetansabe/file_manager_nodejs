$().ready(function() {
    
    //validate register form
    $("#register-form").validate({
      wrapper: 'div',
      onfocusout: true,
      onkeyup: false,
      onclick: false,
      rules: {
        "name": {
          required: true,
          maxlength: 30
        },
        "email": {
          email: true,
          required: true,
          maxlength: 30
        },
        "password":{
          required: true,
          minlength: 7
        },
        "rePassword": {
          equalTo: "#password",
        }
      },
      messages:{
        "name": {
          required: 'Thieu thong tin ho va ten',
          maxlength: 'Phai it hon 30 ki tu',
        },
        "email": {
          email: 'Sai dinh dang email',
          required: 'Thieu thong tin email',
          maxlength: 'Phai it hon 30 ki tu',
        },
        "password":{
          required: 'Thieu thong tin password',
          minlength: 'Password phai tu 7 ki tu tro len',
        },
        "rePassword": {
          equalTo: 'Phai nhap giong voi password',
        }
      }
    });

    //validate login form
    $("#login-form").validate({
      wrapper: 'div',
      onfocusout: true,
      onkeyup: false,
      onclick: false,
      rules: {
        "email": {
          email: true,
          required: true,
          maxlength: 30
        },
        "password":{
          required: true,
          minlength: 7
        },
      },
      messages:{
        "email": {
          email: 'Sai dinh dang email',
          required: 'Thieu thong tin email',
          maxlength: 'Phai it hon 30 ki tu',
        },
        "password":{
          required: 'Thieu thong tin password',
          minlength: 'Password phai tu 7 ki tu tro len',
        }
      }
    });
});
