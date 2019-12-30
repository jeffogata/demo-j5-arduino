const { Servo, Servos } = require('johnny-five');

module.exports = class TwoWheels {
  constructor(leftWheelPin, rightWheelPin, log) {
    this.log = log;
    this.both = createWheels(leftWheelPin, rightWheelPin, this.log);
    this.left = this.both[0];
    this.right = this.both[1];  
  }

  stop() {
    this.both.stop();
    this.log.info('wheels stop');
  }

  forward() {
    this.both.ccw(0.5);
    this.log.info('wheels forward');
  }

  back() {
    this.both.cw();
    this.log.info('wheels back');
  }

  left() {
    this.left.ccw();
    this.right.cw();
    this.log.info('wheels left');
  }

  right() {
    this.left.cw();
    this.right.ccw();
    this.log.info('wheels right');
  }

  // forwardLeft

  // forwardRight

  // backLeft

  // backRight
};

const createWheels = (leftWheelPin, rightWheelPin, log) => {
  log.trace(`creating wheels left on ${leftWheelPin}, right on ${rightWheelPin}`);
  
  const wheels = new Servos([{
      pin: leftWheelPin, 
      type: 'continuous',
    }, {
      pin: rightWheelPin,
      type: 'continuous',
      invert: true,
    },
  ]);

  wheels.stop();

  log.info('wheels created');

  return wheels;
};