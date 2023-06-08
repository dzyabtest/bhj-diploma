const sidebarBtn = document.querySelector('a.sidebar-toggle');
const sidebarMini = document.querySelector('body.sidebar-mini');

/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    sidebarBtn.addEventListener('click', ()=>{
      sidebarMini.classList.toggle('sidebar-open');
      sidebarMini.classList.toggle('sidebar-collapse');
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const loginElement = document.querySelector('li.menu-item_login');
    const loginWin = App.getModal( 'login' );
    loginElement.addEventListener('click', (e) => {
      loginWin.open();
    });

    const regElement = document.querySelector('li.menu-item_register');
    const regWin = App.getModal( 'register' );
    regElement.addEventListener('click', (e) => {
      regWin.open();
    });

    const logoutElement = document.querySelector('li.menu-item_logout');
    logoutElement.addEventListener('click', (e) => {
      User.logout((err, response) => {
        if (response.success) {
          App.setState( 'init' );
        }
      });
    });
  }
}