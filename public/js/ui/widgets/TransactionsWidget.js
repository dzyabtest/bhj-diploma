/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;

    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeElement = document.querySelector('.create-income-button');

    incomeElement.onclick = () => {
    const incomeWin = App.getModal( 'newIncome' );
    incomeWin.open();
    }

    const expenseElement = document.querySelector('.create-expense-button');

    expenseElement.onclick = () => {
    const expenseWin = App.getModal( 'newExpense' );
    expenseWin.open();
    }
  }
}
