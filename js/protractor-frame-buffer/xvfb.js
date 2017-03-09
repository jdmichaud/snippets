const spawn = require('child_process').spawn;

const xvfb = {};
xvfb.xvfbProcess = undefined;
/*
 * When starting the integration tests, protractor will check if we are running
 * on CI without an X server running. If this is the case, we will run the
 * virtual frame buffer.
 */
xvfb.beforeLaunch = function beforeLaunch() {
  if (process.env.CI_TYPE === 'linux_headless') {
    // To improve the stability of the CI, kill a potential dangling instance of Xvfb
    xvfb.xvfbProcess = spawn('pkill', ['Xvfb']);
    xvfb.xvfbProcess = spawn('rm', ['-rf', '/tmp/.X99-lock']);
    // Start the virtual frame buffer for the headfull browser to start
    var args = [
      ':99',
      '-ac',
      '-screen',
      '0',
      '1024x768x24',
    ];
    console.log('Start virtual frame buffer');
    xvfb.xvfbProcess = spawn('/usr/bin/Xvfb', args);
    xvfb.xvfbProcess.stderr.on('data', function (data) {
      console.log(`Xvfb: ${data}`);
    });
  }
};

/*
 * Kill the virtual frame buffer if it was running.
 */
xvfb.onCleanUp = function onCleanUp() {
  if (xvfb.xvfbProcess) {
    console.log('Kill virtual frame buffer');
    xvfb.xvfbProcess.kill('SIGKILL');
    xvfb.xvfbProcess = spawn('rm', ['-rf', '/tmp/.X99-lock']);
  }
};

module.exports = xvfb;
