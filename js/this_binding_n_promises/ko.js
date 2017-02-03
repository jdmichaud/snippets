
const bar = {
  baz: function () {
    return new Promise(function (resolve, reject) {
      // resolve();
      reject();
    });
  },
};

class Foo {
  constructor(bar) {
    this.bar = bar;
  }

  fooz() {
    this.bar.baz().then((result) => {
      console.log('this:', this);
    }).catch(function () {
      console.log('this:', this);
    });
  };
};

const foo = new Foo(bar);

// Will return:
// undefined
foo.fooz();

