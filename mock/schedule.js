const mockjs= require('mockjs');
const { VUE_APP_APIHOST } = process.env;
const mock = {};



mock[`GET ${VUE_APP_APIHOST || ''}/schedule/list`] = (req, res) => {
  res.send({
    code: 0,
    data: mockjs.mock({
      total: 8,
      currentPage: 1,
      'list|8': [
        {
          jobId: '@integer(1)',
          'taskName|1': ['任务1', '任务2'],
          'taskGroup|1': ['李庆松的个人博客', '原创定制最好的网页插件小功能'],
          'description|1': ['http://liqingsong.cc', 'http://wyxgn.com'],
          'cron|1': ['header', 'footer'],
          'state|1': ['0', '1'],
        },
      ],
    }),
  });
};


mock[`GET ${VUE_APP_APIHOST || ''}/schedule/list/*`] = (req, res) => {
  res.send({
    code: 0,
    data: mockjs.mock({
      jobId: '@integer(1)',
      'taskName|1': ['ceshissss'],
      'taskGroup|1': ['原创定制最好的网页插件小功能'],
      'description|1': ['http://wyxgn.com'],
      'cron|1': ['header'],
      'state|1': ['0'],
    }),
  });
};

module.exports = {
  ...mock
};