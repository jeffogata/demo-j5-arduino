const { Board } = require('johnny-five');
const { logLevels } = require('./SimpleLogLevels');
const SimpleLog = require('./SimpleLog');
const TwoWheels = require('./TwoWheels');

const board = new Board({ repl: false });
const log = new SimpleLog(logLevels.trace);

board.on('ready', () => {
  try {
    log.trace('on board ready');
    
    const wheels = new TwoWheels(9, 3, log);

    wheels.forward();

    board.on('exit', () => {
      console.log('\n');
      log.trace('on board exit');
      cleanup(wheels);
    });

    log.trace('board exit handler registered');

    board.wait(1000, () => {
      log.trace('after wait 1 sec');
      wheels.stop();
    });

    log.trace('after board.wait');
  } catch (error) {
    console.error('Error in board on ready handler');
    console.error(error);
  }
});

const cleanup = (wheels) => {
  if (wheels) {
    wheels.stop();
  }
};

