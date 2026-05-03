// Parallax
const parallax = document.getElementById('parallax');
if (parallax) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    parallax.style.transform = `translateY(${offset * 0.4}px)`;
  });
}

// Hamburger
const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('open');
  });
}

// Tetris
const canvas = document.getElementById('tetris');
const ctx = canvas ? canvas.getContext('2d') : null;

if (ctx) {
  const COLS = 12, ROWS = 20, BLOCK = 20;
  let board, piece, score, gameLoop;

  const SHAPES = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[1,1,1],[0,1,0]],
    [[1,1,1],[1,0,0]],
    [[1,1,1],[0,0,1]],
    [[1,1,0],[0,1,1]],
    [[0,1,1],[1,1,0]],
  ];

  const COLORS = ['#00f0f0','#f0f000','#f0a000','#0000f0','#00f000','#f00000','#a000f0'];

  function emptyBoard() {
    return Array.from({length: ROWS}, () => Array(COLS).fill(0));
  }

  function randomPiece() {
    const i = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[i],
      color: COLORS[i],
      x: Math.floor(COLS / 2) - 1,
      y: 0
    };
  }

  function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK, y * BLOCK, BLOCK - 1, BLOCK - 1);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => row.forEach((val, x) => {
      if (val) drawBlock(x, y, val);
    }));
    piece.shape.forEach((row, y) => row.forEach((val, x) => {
      if (val) drawBlock(piece.x + x, piece.y + y, piece.color);
    }));
  }

  function collides(px, py, shape) {
    return shape.some((row, y) => row.some((val, x) => {
      if (!val) return false;
      const nx = px + x, ny = py + y;
      return nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && board[ny][nx]);
    }));
  }

  function merge() {
    piece.shape.forEach((row, y) => row.forEach((val, x) => {
      if (val) board[piece.y + y][piece.x + x] = piece.color;
    }));
  }

  function clearLines() {
    let lines = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (board[y].every(v => v)) {
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(0));
        lines++;
        y++;
      }
    }
    score += lines * 100;
    document.getElementById('score').textContent = score;
  }

  function drop() {
    if (!collides(piece.x, piece.y + 1, piece.shape)) {
      piece.y++;
    } else {
      merge();
      clearLines();
      piece = randomPiece();
      if (collides(piece.x, piece.y, piece.shape)) {
        clearInterval(gameLoop);
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '20px Montserrat';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
        ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 30);
        document.getElementById('startBtn').textContent = 'Play Again';
        return;
      }
    }
    draw();
  }

  function rotate(shape) {
    return shape[0].map((_, i) => shape.map(row => row[i])).reverse();
  }

  window.startTetris = function() {
    board = emptyBoard();
    score = 0;
    document.getElementById('score').textContent = 0;
    document.getElementById('startBtn').textContent = 'Restart';
    piece = randomPiece();
    clearInterval(gameLoop);
    gameLoop = setInterval(drop, 400);
    draw();
  }

  window.moveLeft = function() {
    if (piece && !collides(piece.x - 1, piece.y, piece.shape)) { piece.x--; draw(); }
  }
  window.moveRight = function() {
    if (piece && !collides(piece.x + 1, piece.y, piece.shape)) { piece.x++; draw(); }
  }
  window.moveDown = function() {
    if (piece && !collides(piece.x, piece.y + 1, piece.shape)) { piece.y++; draw(); }
  }
  window.rotatePiece = function() {
    if (!piece) return;
    const rotated = rotate(piece.shape);
    if (!collides(piece.x, piece.y, rotated)) { piece.shape = rotated; draw(); }
  }

  document.addEventListener('keydown', e => {
    if (!piece || !gameLoop) return;
    if (e.key === 'ArrowLeft') window.moveLeft();
    if (e.key === 'ArrowRight') window.moveRight();
    if (e.key === 'ArrowDown') window.moveDown();
    if (e.key === 'ArrowUp') window.rotatePiece();
  });
}
