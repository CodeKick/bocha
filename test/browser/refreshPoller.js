(function () {
    let _setTimeout = window.setTimeout;

    poll();

    function poll() {
        let isFakeAjax = window.__sinon && window.__sinon.fakeServer.xhr === window.XMLHttpRequest;
        if (isFakeAjax) {
            _setTimeout(poll, 1000);
            return;
        }

        let xhr = new window.XMLHttpRequest();
        xhr.onerror = () => {
            _setTimeout(poll, 1000);
        };
        xhr.onload = () => {
            if (xhr.status === 200) {
                var time = parseInt(xhr.responseText);
                if (lastChangeTime === time) {
                    _setTimeout(poll, 200);
                }
                else {
                    window.location.reload();
                }
            }
            else {
                _setTimeout(poll, 1000);
            }
        };
        xhr.open('GET', '/last-change');
        xhr.send();
    }
})();