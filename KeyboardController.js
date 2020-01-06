const keypress = require('keypress');

module.exports = class KeyboardController {
  constructor({ wheels, driveIndicator, log }) {
    wheels.stop();

    const driveHandler = createDriveHandler(wheels, driveIndicator, log);

    monitorKeyPressEvents(driveHandler, log);
  }
};

const monitorKeyPressEvents = (driveHandler, log) => {
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
      driveHandler(character, key);
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
}

const createDriveHandler = (wheels, driveIndicator, log) => {
  return (character, key) => {

    log.debug(`drive handler received '${character}'`);

    if (character === 'w') {
      wheels.forward();
      driveIndicator.indicateMoving();
    } else if (character === 'a') {
      wheels.spinLeft();
      driveIndicator.indicateMoving();
    } else if (character === 's') {
      wheels.back();    
      driveIndicator.indicateMoving();
    } else if (character === 'd') {
      wheels.spinRight();
      driveIndicator.indicateMoving();
    } else if (character === ' ') {
      wheels.stop();
      driveIndicator.indicateStopped();
    } else if (character >= '0' && character <= '9') {
      let speed = parseInt(character) / 10;
      if (speed === 0) {
        speed = 1;
      }
      wheels.setSpeed(speed);
    }
  };
};
