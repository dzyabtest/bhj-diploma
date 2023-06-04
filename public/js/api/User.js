/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';

  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    const currentUser = {
      id: user.id,
      name: user.name
    };

    localStorage.setItem('user', JSON.stringify(currentUser));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    return JSON.parse(localStorage.getItem('user'));
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    const options = {
      url: this.URL + '/current',
  //    data: {id: User.current().id},
      method: 'GET',
      callback: (err, response) => {
        if ( response && response.user ) {
          User.setCurrent( response.user );
        }

      callback(err, response)
      } 
    };

    createRequest(options);
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    const options = {
      url: this.URL + '/register',
      method: 'POST',
      data: data
    };

    function reg(err, response) {
      callback(err, response);

      if (response.success) {
        const user = {
          id: response.user.id,
          name: response.user.name
        };

        User.setCurrent(user);
      }
    };
    
    options.callback = reg;

    createRequest(options);
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    const options = {
      url: this.URL + '/logout',
      method: 'POST',
      callback: (err, response) => {
        if (response && response.user) {
          this.unsetCurrent();
        }
        callback(err, response);
      }
    };

    createRequest(options);
    this.unsetCurrent();
  }
}
