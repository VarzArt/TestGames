const arcanGame = {
  arcCtx: undefined,
  platform: undefined,
  ball: undefined,
  width: 800,
  height: 450,
  cols: 7,
  rows: 4,
  score: 0,
  blocks: [],
  running: true,
  level: "Easy",
  scoreEl: document.getElementById("score"),
  sprites: {
    background: undefined,
    platform: undefined,
    ball: undefined,
    blocks: undefined,
  },
  init: function () {
    const restartBtn = document.getElementById("restart");
    const arcanoidCanvas = document.getElementById("arcanoidCanvas");
    this.arcCtx = arcanoidCanvas.getContext("2d");
    document.getElementById("easy").addEventListener("click", () => {
      this.level = "Easy";
    });
    document.getElementById("medium").addEventListener("click", () => {
      this.level = "Medium";
    });
    document.getElementById("hard").addEventListener("click", () => {
      this.level = "Hard";
    });

    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowRight") {
        this.platform.dx = this.platform.velocity;
      } else if (e.code === "ArrowLeft") {
        this.platform.dx = -this.platform.velocity;
      } else if (e.code === "Space") {
        this.platform.startBall();
      }
    });
    window.addEventListener("keyup", (e) => {
      this.platform.stop();
    });
    restartBtn.addEventListener("click", () => {
      window.location.reload();
    });
  },
  load: function () {
    for (let sprite in this.sprites) {
      this.sprites[sprite] = new Image();
      this.sprites[sprite].src = `/src/arcanoid/images/${sprite}.png`;
    }
  },
  create: function () {
    for (let row = 0; row < arcanGame.rows; row++) {
      for (let col = 0; col < arcanGame.cols; col++) {
        this.blocks.push({
          x: 110 * col + 20,
          y: 38 * row + 20,
          width: 100,
          height: 28,
          isAlive: true,
        });
      }
    }
  },
  start: function () {
    this.init();
    this.load();
    this.create();
    this.run();
  },
  render: function () {
    this.arcCtx.clearRect(0, 0, this.width, this.height);
    this.arcCtx.drawImage(this.sprites.background, 0, 0);
    this.arcCtx.drawImage(
      this.sprites.platform,
      this.platform.x,
      this.platform.y
    );
    this.arcCtx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
    this.blocks.forEach((el) => {
      if (el.isAlive) {
        this.arcCtx.drawImage(this.sprites.blocks, el.x, el.y);
      }
    });
  },
  update: function () {
    if (this.ball.collide(this.platform)) {
      this.ball.bumpPlatform(this.platform);
    }
    if (this.platform.dx) {
      this.platform.move();
    }
    if (this.ball.dx || this.ball.dy) {
      this.ball.move();
    }
    if (this.level === "Easy") {
      this.ball.velocity = 1;
      this.platform.velocity = 3;
    } else if (this.level === "Medium") {
      this.ball.velocity = 3;
      this.platform.velocity = 5;
    } else if (this.level === "Hard") {
      this.ball.velocity = 5;
      this.platform.velocity = 7;
    }

    this.blocks.forEach((el) => {
      if (el.isAlive) {
        if (this.ball.collide(el)) {
          this.ball.bumpBlock(el);
        }
      }
    });
    this.ball.checkWindow();
    this.platform.checkWindow();
  },

  run: function () {
    this.update();
    this.render();

    if (this.running) {
      window.requestAnimationFrame(() => {
        arcanGame.run();
      });
    }
  },

  over: function (message) {
    alert(message);
    this.running = false;
  },
};

arcanGame.ball = {
  width: 38,
  height: 38,
  frame: 0,
  x: 380,
  y: 362,
  dx: 0,
  dy: 0,
  velocity: 1,
  jump: function () {
    if (arcanGame.platform.dx > 0) {
      this.dx = this.velocity;
    } else if (arcanGame.platform.dx < 0) {
      this.dx = -this.velocity;
    } else {
      this.dx = 0;
    }
    this.dy = -this.velocity;
  },
  move: function () {
    this.x += this.dx;
    this.y += this.dy;
  },
  collide: function (el) {
    const x = this.x + this.dx;
    const y = this.y + this.dy;

    if (
      x + this.width > el.x &&
      x < el.x + el.width &&
      y + this.height > el.y &&
      y < el.y + el.height
    ) {
      return true;
    }
    return false;
  },
  bumpBlock: function (block) {
    this.dy *= -1;
    block.isAlive = false;
    arcanGame.score += 100;
    arcanGame.scoreEl.innerHTML = arcanGame.score;
    if (arcanGame.score >= arcanGame.blocks.length * 100) {
      arcanGame.over(`You win with score ${arcanGame.score}`);
      window.location.reload();
    }
  },
  onTheLeftSide: function (platform) {
    return this.x + this.width / 2 < platform.x + platform.width / 2;
  },
  bumpPlatform: function (platform) {
    this.dy = -this.velocity;
    this.dx = this.onTheLeftSide(platform) ? -this.velocity : this.velocity;
  },
  checkWindow: function () {
    const x = this.x + this.dx;
    const y = this.y + this.dy;
    if (x + this.width > arcanGame.width) {
      this.x = arcanGame.width - this.width;
      this.dx = -this.velocity;
    } else if (x < 0) {
      this.x = 0;
      this.dx = this.velocity;
    } else if (y < 0) {
      this.y = 0;
      this.dy = this.velocity;
    } else if (y + this.height > arcanGame.height) {
      arcanGame.over(`You lose with score ${arcanGame.score}`);
      window.location.reload();
    }
  },
};

arcanGame.platform = {
  x: 350,
  y: 400,
  velocity: 6,
  dx: 0,
  width: 100,
  height: 24,
  ball: arcanGame.ball,
  startBall: function () {
    if (this.ball) {
      this.ball.jump();
      this.ball = false;
    }
  },
  move: function () {
    this.x += this.dx;

    if (this.ball) {
      this.ball.x += this.dx;
    }
  },
  stop: function () {
    this.dx = 0;

    if (this.ball) {
      this.ball.dx = 0;
    }
  },
  checkWindow: function () {
    const x = this.x + this.dx;
    if (x + this.width > arcanGame.width) {
      this.x = arcanGame.width - this.width;
    } else if (x < 0) {
      this.x = 0;
    }
  },
};

window.onload = function () {
  arcanGame.start();
};
