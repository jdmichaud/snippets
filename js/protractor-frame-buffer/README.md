## Running e2e tests with protractor without a X server

When protractor starts, it will spawn a browser and use it to perform tests.
If you don't have a X server though (like on a CI machine), the browser will refuse to start.
You could always use phantomJS, but this would not test you application with a real world browser.

The alternative solution is to use a frame buffer like Xvfb. The browse will send out order to
the X server it is connected to, but this virtual X server will just write out to the main
memory instead of dispatching orders to the graphic cards.

Additionally, it can be faster than using a real X server and you can still perform screenshots.

## Usage

Use the beforeLaunch and onCleanup into the protractor configuration:
```
exports.config = {
  framework: 'jasmine',
  specs: ['../**/*.spec.js'],
  directConnect: true,
  capabilities: {
    browserName: 'chrome',
  },
  beforeLaunch: ciutils.beforeLaunch,
  onCleanUp: ciutils.onCleanUp,
};
```
