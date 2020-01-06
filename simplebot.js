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

board.on('ready', () => {
  try {
    log.setLevel('debug');
    log.debug('on board ready');

    registerBoardEventHandlers();

    driveIndicator = new DriveIndicator(10, 11, false, log);
    wheels = new TwoWheels(9, 3, 0.2, log);
    controller = new KeyboardController(wheels, driveIndicator, log);
  } catch (error) {
    console.error('Error in board on ready handler');
    console.error(error);
  }
});

const registerBoardEventHandlers = () => {
  board.on('exit', () => {
    log.debug('on board exit');
    cleanup();
  });

  log.debug('board exit handler registered');

  board.on('error', (err) => {
    log.error(JSON.stringify(err));
  });

  log.debug('board error handler registered');
};

const cleanup = () => {
  log.debug('starting cleanup...');

  if (wheels) {
    wheels.stop();
  }

  if (driveIndicator) {
    driveIndicator.cleanup();
  }
  
  log.debug('cleanup finished');
};
