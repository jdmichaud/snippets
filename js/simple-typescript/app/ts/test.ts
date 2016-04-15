define(function () {
  namespace Test {
    interface TestInterface {
      function api(i:number, s:string): string;
    }

    export class TestClass: implements TestInterface {
      function api(i:number, s:string): string {
        console.log(i);
        console.log(s);
        return s;
      }
    }
  }
)};
