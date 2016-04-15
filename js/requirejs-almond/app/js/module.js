define(function () {
  return {
    append: function (id) {
      console.log('append called');
      $('#' + id).append('module loaded');
    },
  };
});
