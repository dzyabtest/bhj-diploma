/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    super.onSubmit();

    User.register(data, (err, response) => {
      if (!response.success) {
        return;
      }

      const regWin = App.getModal( 'register' );
      regWin.close();
      this.element.reset();

      App.setState( 'user-logged' );
      App.init();
    });

  }
}