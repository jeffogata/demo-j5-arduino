const { Servo, Servos } = require('johnny-five');

const move = Object.freeze({
  stop: 0,
  forward: 1,
  back: 2,
  spinLeft: 3,
  spinRight: 4
});

module.exports = class TwoWheels {
  constructor(leftWheelPin, rightWheelPin, initialSpeed, log) {
    this.log = log;
    this.setSpeed(initialSpeed);
    this.both = createWheels(leftWheelPin, rightWheelPin, this.log);
    this.left = this.both[0];
    this.right = this.both[1];
    this.currentMove = move.stop;
  }

  setSpeed(speed) {
    this.speed = 
      (!speed || speed < 0) ? 0 :
      (speed > 1) ? 1 :
      speed;

    if (this.currentMove) {
      redoMove(this);
    } else {
      this.log.info(`wheels speed set to ${this.speed}`);
    }
  }

  stop() {
    this.both.stop();
    this.currentMove = move.stop;
    this.log.info('wheels stop');
  }

  forward() {
    this.both.cw(this.speed);
    this.currentMove = move.forward;
    this.log.info(`wheels forward at speed ${this.speed}`);
  }

  back() {
    this.both.ccw(this.speed);
    this.currentMove = move.back;
    this.log.info(`wheels back at speed ${this.speed}`);
  }

  spinLeft() {
    this.left.ccw(this.speed);
    this.right.cw(this.speed);
    this.currentMove = move.spinLeft;
    this.log.info(`wheels spin left at speed ${this.speed}`);
  }

  spinRight() {
    this.left.cw(this.speed);
    this.right.ccw(this.speed);
    this.currentMove = move.spinRight;
    this.log.info(`wheels spin right at speed ${this.speed}`);
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

const redoMove = (wheels) => {
  switch (wheels.currentMove) {
    case move.forward:
      wheels.forward();
      break;
    case move.back:
      wheels.back();
      break;
    case move.spinLeft:
      wheels.spinLeft();
      break;
    case move.spinRight:
      wheels.spinRight();
      break;
  };
}