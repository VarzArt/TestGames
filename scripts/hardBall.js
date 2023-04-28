const hardBall = {
  width: 660,
  height: 700,
  ballCtx: undefined,
  running: true,
  counter: undefined,
  ball: {
    x: 310,
    y: 150,
    dy: 0,
    height: 38,
    k: 1,
    velocity: 1,
    start: function () {
      if (!this.dy) {
        this.dy = Math.sqrt(this.velocity);
      }
    },
    move: function () {
      this.y += this.dy;
      if (this.y % 2 === 0) {
        this.dy += this.velocity;
      }
      if (this.dy === 0) {
        this.dy = this.velocity;
      }
    },
    collide: function (el) {
      const y = this.y + this.dy;

      if (y + this.height > el.y && y < el.y + el.height) {
        return true;
      }
      return false;
    },
    bump: function () {
      this.dy = -21 + this.k * Math.sqrt(this.velocity);
      this.k += 2;
    },
  },
  ground: {
    x: 80,
    y: 540,
    height: 160,
  },
  sprites: {
    background: undefined,
    ball: undefined,
    ground: undefined,
  },
  init: function () {
    const hardBallCanvas = document.getElementById("hardBallCanvas");
    this.ballCtx = hardBallCanvas.getContext("2d");
    const startBtn = document.getElementById("hardBallStart");
    const restartBtn = document.getElementById("hardBallRestat");

    restartBtn.addEventListener("click", () => {
      window.location.reload();
    });

    startBtn.addEventListener("click", () => {
      this.ball.start();
    });
  },
  load: function () {
    for (let sprite in this.sprites) {
      this.sprites[sprite] = new Image();
      this.sprites[sprite].src = `/src/simpleBall/images/${sprite}.png`;
    }
  },
  start: function () {
    this.init();
    this.load();
    this.run();
  },
  update: function () {
    if (this.ball.collide(this.ground)) {
      this.ball.bump();
    }
    if (this.ball.dy) {
      this.ball.move();
    }
  },
  render: function () {
    this.ballCtx.clearRect(0, 0, this.width, this.height);
    this.ballCtx.drawImage(this.sprites.background, 80, 0);
    this.ballCtx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
    this.ballCtx.drawImage(this.sprites.ground, this.ground.x, this.ground.y);
  },
  run: function () {
    this.render();
    this.update();

    if (this.running) {
      window.requestAnimationFrame(() => {
        hardBall.run();
      });
    }
  },
};

hardBall.start();
