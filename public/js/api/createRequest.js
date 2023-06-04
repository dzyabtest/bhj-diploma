/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const url = new URL('http://localhost:8000' + options.url);
    const data = options.data;
    const method = options.method;
    const callback = options.callback;

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.onload = (err, response) => {
        if (xhr.status == '200') {
            response =  xhr.response;
            err = null;

            callback(err, response);
        }
        else {
            response = null;
            err = xhr.status;
            callback(err, response);
        }
    };

    xhr.onerror = (err, response) => {
        response = null;
        err = 'Сайт недоступен.';
        callback(err, response);
    }

    if (method == 'GET') {
        for (let key in data) {
            url.searchParams.append(key, data[key]);
        }

        xhr.open(method, url);
        xhr.send();
    }
    else {
        const formData = new FormData(); 

        for (let key in data) {
            formData.set(key, data[key]);
        }

        xhr.open(method, url);
        xhr.send(formData);
    };

}
