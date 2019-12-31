const { Board } = require('johnny-five');
const { logLevels } = require('./SimpleLogLevels');
const keypress = require('keypress');
const SimpleLog = require('./SimpleLog');
const TwoWheels = require('./TwoWheels');

const board = new Board({ repl: false });
const log = new SimpleLog(logLevels.trace);

const driveLoopMilliseconds = 100;

let isRunning = false;
let isExiting = false;
let driveLoopCount = 0;
let lastKeypress;

board.on('ready', () => {
  try {
    log.trace('on board ready');
    
    const wheels = new TwoWheels(9, 3, log);

    board.on('exit', async () => {
      console.log('\n');
      log.trace('on board exit');
      await cleanup(wheels);
    });

    log.trace('board exit handler registered');

    monitorKeystrokes(log);

    startDriveLoop(board, wheels, log);

    log.trace('after board.wait');
  } catch (error) {
    console.error('Error in board on ready handler');
    console.error(error);
  }
});

const monitorKeystrokes = (log) => {
  keypress(process.stdin);

  process.stdin.on('keypress', (ch, key) => {
    log.trace(`got keypress ${ch}`);

    lastKeypress = ch;

    if (key && key.ctrl && key.name == 'c') {
      process.kill(process.pid, 'SIGINT');
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
}

const cleanup = async (wheels) => {
  log.trace('starting cleanup...');

  isExiting = true;

  if (wheels) {
    wheels.stop();
  }

  // wait for eval loop to stop?
  log.trace('cleanup finished');
};

const startDriveLoop = (board, wheels, log) => {
  log.trace('starting drive loop...');
  isRunning = true;
  evalDriveCycle(board, wheels, log);
  log.trace('drive loop started');
};

const evalDriveCycle = (board, wheels, log) => {
  if (isExiting) {
    log.trace('exiting drive loop');
    isRunning = false;
    return;
  }
  
  if (driveLoopCount % 50 == 0) {
    log.trace(`starting drive loop ${driveLoopCount}...`);
  }

  // todo:  change from a loop to an event handler
  if (lastKeypress === 'w') {
    wheels.forward();
  } else if (lastKeypress === 'a') {
    wheels.spinLeft();
  } else if (lastKeypress === 's') {
    wheels.back();    
  } else if (lastKeypress === 'd') {
    wheels.spinRight();
  } else if (lastKeypress === ' ') {
    wheels.stop();
  }

  lastKeypress = '';

  board.wait(driveLoopMilliseconds, () => {
    evalDriveCycle(board, wheels, log);
  });

  if (driveLoopCount % 50 == 0) {
    log.trace(`drive loop ${driveLoopCount} completed`);
  }

  driveLoopCount++;
};
