(function () {
  // 将配置信息放在window对象上,使其变成全局都可以访问的
  window.meta_config = {
    development: {
      BASE_URL: 'http://work.paytunnel.cn:18080/secretassessment',
      outside: 'http://work.paytunnel.cn:18080/gms-admin-vue2/#/login',
    },
    development2: {
      BASE_URL: 'https://www.paytunnel.cn/secretassessment',
      outside: 'https://www.paytunnel.cn/gms-admin-vue2/#/login',
    },
    production: {
      BASE_URL: 'http://work.paytunnel.cn:18080/secretassessment',
      outside: 'http://work.paytunnel.cn:18080/enter-collect/',
    },
  };

  window.getMetaConfig = function (env, id) {
    return id ? window.meta_config[env][id] : window.meta_config[env];
  };
})();
