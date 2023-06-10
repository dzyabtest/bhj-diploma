/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    super.onSubmit();

    Account.create(data, (err, response) => {
      if (response.success) {
        const newAccWin = App.getModal( 'createAccount' );
        newAccWin.close();
        this.element.reset();
    
        App.update();
    
      }
    });

  }
}