export default {
    getToken() {
        return window.localStorage.getItem('token');
    },
    saveToken(token) {
        window.localStorage.setItem('token', token);
    },
    clearToken() {
        window.localStorage.removeItem('token');
    },
    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    },
    getHMS(time) {
        const hour =
            parseInt(time / 3600) < 10
                ? "0" + parseInt(time / 3600)
                : parseInt(time / 3600);
        const min =
            parseInt((time % 3600) / 60) < 10
                ? "0" + parseInt((time % 3600) / 60)
                : parseInt((time % 3600) / 60);
        const sec =
            parseInt((time % 3600) % 60) < 10
                ? "0" + parseInt((time % 3600) % 60)
                : parseInt((time % 3600) % 60);
        return hour + ":" + min + ":" + sec;
    },

}