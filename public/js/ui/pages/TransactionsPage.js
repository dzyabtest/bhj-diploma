/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {

  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      alert('На страницу транзакций передан пустой элемент!');
      return;
    }
    if (!document.body.contains(element)) {
      alert('На страницу транзакций передан отсутствующий элемент!');
      return;
    }

    this.element = element;
    this.lastOptions = {};

    this.registerEvents();

    this.renderTitle('Название счёта');
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    const currentElement =  document.querySelector('.account.active');
    const options = this.lastOptions;
    let accId = '';
    this.clear();
    
    if (currentElement) {
      accId = element.getAttribute('data-id');
      options.account_id = accId;

      this.render(options);
    }

  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const createAccBtn = document.querySelector('span.create-account');
  
    createAccBtn.onclick = () => {
      const newAccWin = App.getModal( 'createAccount' );
      newAccWin.open();
    };

    const removeAccBtn = document.querySelector('button.remove-account');

    removeAccBtn.onclick = () => {
      this.removeAccount();
    };

    const delBtns = Array.from(document.querySelectorAll('.transaction__remove'));
    delBtns.forEach(item => {
      let dataId = item.getAttribute('data-id');
      item.onclick = () => {
        this.removeTransaction(dataId);
      };
    })

  }
  

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    };

    const activeAccElement = document.querySelector('li.active');

    if (!activeAccElement) {
      return;
    }

    const data = {id: this.lastOptions.account_id};

    if (confirm('Вы действительно хотите удалить счёт?')) {
      Account.remove(data, (err, response) => {
        if (response.success) {
          this.clear();
          App.updateWidgets();
          App.updateForms();
        };
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (!id) {
      return;
    };

    if (confirm('Удалить транзакцию?')) {
      let atrSelector = '[data-id="' + id +'"]';
      const transactionBtn = document.querySelector('button.transaction__remove' + atrSelector);
      const transactionElement = transactionBtn.closest('.transaction');

      const data = {id: id};

      Transaction.remove(data, (err, resp) => {

        if (resp.success) {
          transactionElement.remove();
        };

      });
    };
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options) {
      this.renderTitle('Название счёта');
      return;
    }

    const accId = options.account_id;

    this.lastOptions = options;

    Account.get(accId, (err, response) => {
      if (response.success) {
        this.renderTitle(response.data.name);

        const data = {
          name: User.current().name,
          account_id: response.data.id,
          flRender: true
        };

        Transaction.list(data, (errTr, responseTr) => {
          if (data.flRender) {
            this.renderTransactions(responseTr.data);
          };

          this.registerEvents();

        });
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = {};
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const titleElement = document.querySelector(' .content-title');

    titleElement.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
    };

    let formDate = new Date(date);

    return formDate.toLocaleString("ru", options);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const transactionElement = document.createElement('div');
    transactionElement.classList.add('transaction', 'row');
    if (item.type == 'income') {
      transactionElement.classList.add('transaction_income');
    };
    if (item.type == 'expense') {
      transactionElement.classList.add('transaction_expense');
    };

      const detailsElement = document.createElement('div');
      transactionElement.append(detailsElement);
      detailsElement.classList.add('col-md-7','transaction__details');

        const iconElement = document.createElement('div');
        detailsElement.append(iconElement);
        iconElement.classList.add('transaction__icon');
        
          const faElement = document.createElement('span');
          iconElement.append(faElement);
          faElement.classList.add('fa', 'fa-money', 'fa-2x');

        const infoElement = document.createElement('div');
        detailsElement.append(infoElement);
        infoElement.classList.add('transaction__info');

          const titleElement = document.createElement('h4');
          infoElement.append(titleElement);
          titleElement.classList.add('transaction__title');
          titleElement.textContent = item.name;

          const dataElement = document.createElement('div');
          infoElement.append(dataElement);
          dataElement.classList.add('transaction__date');
          dataElement.textContent = this.formatDate(item.created_at);

      const finElement = document.createElement('div');
      transactionElement.append(finElement);
      finElement.classList.add('col-md-3');

        const sumElement = document.createElement('div');
        finElement.append(sumElement);
        sumElement.classList.add('transaction__summ');
        sumElement.textContent = item.sum;
        sumElement.insertAdjacentHTML('beforeend', '<span class="currency">₽</span>');

      const controlsElement = document.createElement('div');
      transactionElement.append(controlsElement);
      controlsElement.classList.add('col-md-2', 'transaction__controls');
      
        const btnElement = document.createElement('button');
        controlsElement.append(btnElement);
        btnElement.classList.add('btn', 'btn-danger', 'transaction__remove');
        btnElement.setAttribute('data-id', item.id);
        btnElement.insertAdjacentHTML('beforeend','<i class="fa fa-trash"></i>')
        
    return transactionElement;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const contentElement = document.querySelector('.content');

    contentElement.innerHTML = '';

    data.forEach(item => {
      contentElement.append(this.getTransactionHTML(item));
    })

  }
}