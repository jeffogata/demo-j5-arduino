const { Led } = require('johnny-five');

module.exports = class DriveIndicator {
  constructor(movingPin, stoppedPin, isMoving, log) {
    this.log = log;
    this.movingLed = new Led(movingPin);
    this.stoppedLed = new Led(stoppedPin);

    if (isMoving) {
      this.indicateMoving();
    } else {
      this.indicateStopped();
    }

    log.debug(`drive indicator created, moving led on ${movingPin}, stopped led on ${stoppedPin}`);
  }

  indicateStopped() {
    if (this.isMoving === true) {
      this.movingLed.off().stop();
      this.stoppedLed.on();
      this.isMoving = false;
      this.log.debug('drive indicator :: stopped');
    }      
  }

  indicateMoving() {
    if (this.isMoving === false) {
      this.movingLed.on();
      this.stoppedLed.off().stop();
      this.isMoving = true;
      this.log.debug('drive indicator :: moving');
    }
  }
  
  cleanup() {
    this.movingLed.off().stop();
    this.stoppedLed.off().stop();
    this.log.debug('drive indicator cleaned up');
  }
};

