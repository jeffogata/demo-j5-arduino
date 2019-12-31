const { Board } = require('johnny-five');
const { logLevels } = require('./SimpleLogLevels');
const keypress = require('keypress');
const SimpleLog = require('./SimpleLog');
const TwoWheels = require('./TwoWheels');

const board = new Board({ repl: false });
const log = new SimpleLog(logLevels.trace);

let wheels;

board.on('ready', () => {
  try {
    log.trace('on board ready');
    
    wheels = new TwoWheels(9, 3, log);

    registerBoardEventHandlers();

    const keyPressHandlers = [
      createDriveKeyPressHandler(),
    ];

    monitorKeyPressEvents(keyPressHandlers);

    log.trace('after board.wait');
  } catch (error) {
    console.error('Error in board on ready handler');
    console.error(error);
  }
});

const registerBoardEventHandlers = () => {
  board.on('exit', () => {
    log.trace('on board exit');
    cleanup(wheels);
  });

  log.trace('board exit handler registered');

  board.on('error', (err) => {
    log.error(JSON.stringify(err));
  });

  log.trace('board error handler registered');
};

const monitorKeyPressEvents = (handlers) => {
  keypress(process.stdin);

  process.stdin.on('keypress', (character, key) => {
    if (key && key.ctrl && key.name === 'c') {
      log.trace(`got keypress ^c`);
      process.kill(process.pid, 'SIGINT');
    } else {
      log.trace(`got key press ${character}`);
      handlers.forEach(handler => {
        handler(character, key);
      });
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
}

const createDriveKeyPressHandler = () => {
  return (character, key) => {

    log.trace(`drive handler received '${character}'`);

    if (character === 'w') {
      wheels.forward();
    } else if (character === 'a') {
      wheels.spinLeft();
    } else if (character === 's') {
      wheels.back();    
    } else if (character === 'd') {
      wheels.spinRight();
    } else if (character === ' ') {
      wheels.stop();
    } else if (character >= '0' && character <= '9') {
      let speed = parseInt(character) / 10;
      if (speed === 0) {
        speed = 1;
      }
      wheels.setSpeed(speed);
    }
  };
}

const cleanup = (wheels) => {
  log.trace('starting cleanup...');

  if (wheels) {
    wheels.stop();
  }

  log.trace('cleanup finished');
};
