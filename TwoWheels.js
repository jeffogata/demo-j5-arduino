const { Servo, Servos } = require('johnny-five');

const STOP = 0;
const FORWARD = 1;
const BACK = 2;
const SPIN_LEFT = 3;
const SPIN_RIGHT = 4;

module.exports = class TwoWheels {
  constructor({ leftWheelPin, rightWheelPin, initialSpeed, log }) {
    this.log = log;
    this.setSpeed(initialSpeed);
    this.both = createWheels(leftWheelPin, rightWheelPin, this.log);
    this.left = this.both[0];
    this.right = this.both[1];
    this.currentMove = STOP;
    this.areMoving = false;
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
    this.currentMove = STOP;
    this.areMoving = false;
    this.log.info('wheels stop');
  }

  forward() {
    this.both.cw(this.speed);
    this.currentMove = FORWARD;
    this.areMoving = true;
    this.log.info(`wheels forward at speed ${this.speed}`);
  }

  back() {
    this.both.ccw(this.speed);
    this.currentMove = BACK;
    this.areMoving = true;
    this.log.info(`wheels back at speed ${this.speed}`);
  }

  spinLeft() {
    this.left.ccw(this.speed);
    this.right.cw(this.speed);
    this.currentMove = SPIN_LEFT;
    this.areMoving = true;
    this.log.info(`wheels spin left at speed ${this.speed}`);
  }

  spinRight() {
    this.left.cw(this.speed);
    this.right.ccw(this.speed);
    this.currentMove = SPIN_RIGHT;
    this.areMoving = true;
    this.log.info(`wheels spin right at speed ${this.speed}`);
  }
};

const createWheels = (leftWheelPin, rightWheelPin, log) => {
  log.debug(`creating wheels left on ${leftWheelPin}, right on ${rightWheelPin}`);
  
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
    case FORWARD:
      wheels.forward();
      break;
    case BACK:
      wheels.back();
      break;
    case SPIN_LEFT:
      wheels.spinLeft();
      break;
    case SPIN_RIGHT:
      wheels.spinRight();
      break;
  };
}
