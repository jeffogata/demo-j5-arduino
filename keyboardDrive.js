const createHandler = (wheels, log) => {
  return (character, key) => {

    log.debug(`drive handler received '${character}'`);

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
};

module.exports = {
  handler: createHandler,
};
