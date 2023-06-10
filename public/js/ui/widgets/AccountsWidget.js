/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;

    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const accWidgetElement = document.querySelector('ul.accounts-panel');
    const accElements =  Array.from(accWidgetElement.querySelectorAll('li.account'));

    accElements.forEach(item => {
      item.onclick = (e) => {
        this.onSelectAccount(e.srcElement.closest('.account'));
      };
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    this.clear();

    Account.list(User.current(), (err, response) => {
      this.renderItem(response.data);
      this.registerEvents();
    })
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accWidgetElement = document.querySelector('ul.accounts-panel');
    const accElements =  Array.from(accWidgetElement.querySelectorAll('li.account'));

    accElements.forEach(item => {item.remove()});
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const currentElement =  document.querySelector('.account.active');
    
    if (currentElement) {
      currentElement.classList.remove('active');
    };
    
    element.classList.add('active');
    App.showPage( 'transactions', { account_id: element.getAttribute('data-id')});
}

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const li = document.createElement('li');

    li.classList.add('account');
    li.setAttribute('data-id', item.id)

    li.insertAdjacentHTML('beforeend', '<a href="#"><span>' + item.name + '</span> / <span>' + item.sum + ' ₽</span></a>');

    return li;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    if (!data) {
      return;
    };

    const accWidgetElement = document.querySelector('ul.accounts-panel');

    data.forEach(item => {
      let accountElement = this.getAccountHTML(item);

      accWidgetElement.append(accountElement);
    });
  }
}
