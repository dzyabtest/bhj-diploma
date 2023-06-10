/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();

  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const user = User.current();
  
    if (user) {
      const data = {
        name: user.name,
        flRender: false};
    
        Account.list(data, (err, response) => {
          const accSelect = this.element.querySelector('.accounts-select');
          accSelect.innerHTML = '';
  
          response.data.forEach(item => {
            let optionElement = document.createElement('option');
            accSelect.append(optionElement);
            optionElement.setAttribute('value', item.id);
            optionElement.textContent = item.name;
          });
        })
      };

  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    super.onSubmit();

    Transaction.create(data, (err, response) => {
      let newTransactionWin;

      if (response.success) {
        if (data.type == 'income') {
          newTransactionWin = App.getModal( 'newIncome' );
        }
        else
        {
          newTransactionWin = App.getModal( 'newExpense' );
        };
        newTransactionWin.close();
        this.element.reset();
    
        App.update();
    
      }
    });

  }
}