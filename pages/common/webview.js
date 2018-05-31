Page({
  data: {
    url: '',
  },
  onLoad: function (query) {
    this.setData({
      url: query.url
    });
  }
})