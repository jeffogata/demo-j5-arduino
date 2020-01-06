const { Board } = require('johnny-five');
const simpleNodeLogger = require('simple-node-logger');
const TwoWheels = require('./TwoWheels');
const DriveIndicator = require('./DriveIndicator');
const KeyboardController = require('./KeyboardController');

const board = new Board({ repl: false });
const log = simpleNodeLogger.createSimpleLogger();

let wheels;
let driveIndicator;
let controller;

// TODO: get level from command line args
log.setLevel('debug');

board.on('error', (err) => {
  log.error(JSON.stringify(err));
});

board.on('ready', () => {
  log.debug('on board ready');

  wheels = new TwoWheels({
    leftWheelPin: 9,
    rightWheelPin: 3,
    initialSpeed: 0.2,
    log
  });

  driveIndicator = new DriveIndicator({
    movingPin: 10,
    stoppedPin: 11,
    isMoving: false, 
    log
  });

  controller = new KeyboardController({
    wheels,
    driveIndicator,
    log
  });
});

board.on('exit', () => {
  log.debug('on board exit');
  log.debug('starting cleanup...');

  if (wheels) {
    wheels.stop();
  }

  if (driveIndicator) {
    driveIndicator.cleanup();
  }
  
  log.debug('cleanup finished');
});

console.log('registered board event handlers'); 