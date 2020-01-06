const { Board, Led } = require('johnny-five');
const keypress = require('keypress');
const simpleNodeLogger = require('simple-node-logger');
const TwoWheels = require('./TwoWheels');
const keyboardDrive = require('./keyboardDrive');

const board = new Board({ repl: false });
const log = simpleNodeLogger.createSimpleLogger();

let wheels;
let led;

board.on('ready', () => {
  try {
    log.setLevel('debug');
    log.debug('on board ready');

    wheels = new TwoWheels(9, 3, 0.2, log);
    led = new Led(11);

    setLight(false);

    registerBoardEventHandlers();

    const keyPressHandlers = [
      keyboardDrive.handler(wheels, log),
    ];

    monitorKeyPressEvents(keyPressHandlers);

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

const monitorKeyPressEvents = (handlers) => {
  keypress(process.stdin);

  process.stdin.on('keypress', (character, key) => {
    if (key && key.ctrl) {
      log.debug(`got CTRL+${character}`);
      if (key.name === 'c') {
        log.debug(`got keypress ^c`);
        process.kill(process.pid, 'SIGINT');  
      }
    } else {
      log.debug(`got key press ${character}`);
      handlers.forEach(handler => {
        handler(character, key);
      });
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
}

const setLight = (isMoving) => {
  /*
  if (isMoving) {
    led.off();
    led.on();
    log.debug('LED set to moving');
  } else {
    led.pulse(800);
    log.debug('LED set to stopped');
  }
  */
}

const cleanup = () => {
  log.debug('starting cleanup...');

  if (wheels) {
    wheels.stop();
  }

  led.stop().off();

  log.debug('cleanup finished');
};
