const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const groundHeight = 50;
const groundY = canvas.height - groundHeight;

// Sprite sheet configurations for player and AI
const playerSpriteSheets = {
  idle: { src: "/assets/character/Fighter/Idle.png", frameWidth: 128, frameHeight: 128, frameCount: 8 },
  walk: { src: "/assets/character/Fighter/Walk.png", frameWidth: 128, frameHeight: 128, frameCount: 7 },
  jump: { src: "/assets/character/Fighter/Jump.png", frameWidth: 128, frameHeight: 128, frameCount: 8 },
  crouch: { src: "/assets/character/Fighter/Attack_2.png", frameWidth: 128, frameHeight: 128, frameCount: 7 },
  attack: { src: "/assets/character/Fighter/Attack_1.png", frameWidth: 128, frameHeight: 128, frameCount: 7 },
  hurt: { src: "/assets/character/Fighter/Hurt.png", frameWidth: 128, frameHeight: 128, frameCount: 3 },
};

const aiSpriteSheets = {
  idle: { src: "/assets/character/Samurai/Idle.png", frameWidth: 128, frameHeight: 128, frameCount: 7 },
  walk: { src: "/assets/character/Samurai/Walk.png", frameWidth: 128, frameHeight: 128, frameCount: 6 },
  jump: { src: "/assets/character/Samurai/Jump.png", frameWidth: 128, frameHeight: 128, frameCount: 9 },
  crouch: { src: "/assets/character/Samurai/Attack_1.png", frameWidth: 128, frameHeight: 128, frameCount: 2 },
  attack: { src: "/assets/character/Samurai/Attack_2.png", frameWidth: 128, frameHeight: 128, frameCount: 4 },
  hurt: { src: "/assets/character/Samurai/Hurt.png", frameWidth: 128, frameHeight: 128, frameCount: 3 },
};

const zombieSpriteSheets = {
  idle: { src: "/assets/character/Zombie/Idle.png", frameWidth: 96, frameHeight: 96, frameCount: 8 },
  walk: { src: "/assets/character/Zombie/Walk.png", frameWidth: 96, frameHeight: 96, frameCount: 8 },
  jump: { src: "/assets/character/Zombie/Jump.png", frameWidth: 96, frameHeight: 96, frameCount: 8 },
  crouch: { src: "/assets/character/Zombie/Bite.png", frameWidth: 96, frameHeight: 96, frameCount: 2 },
  attack: { src: "/assets/character/Zombie/Attack_2.png", frameWidth: 96, frameHeight: 96, frameCount: 4 },
  hurt: { src: "/assets/character/Zombie/Hurt.png", frameWidth: 96, frameHeight: 96, frameCount: 3 },
};
const cardSpriteSheets = {
    rotating: { src: "/assets/map/Card.png", frameWidth: 24, frameHeight: 24, frameCount: 8},
};

const checkpointSpriteSheet = {
  src: "/assets/map/Checkpoint.png", // Replace with your checkpoint sprite image
  frameWidth: 48,
  frameHeight: 48,
  frameCount: 1, 
};

const loadedCheckpointSpriteSheet = new Image();
loadedCheckpointSpriteSheet.src = checkpointSpriteSheet.src;
loadedCheckpointSpriteSheet.onerror = () =>
  console.error(`Failed to load ${checkpointSpriteSheet.src}`);

const checkpoints = [
  { x: canvas.width / 2, y: groundY - 100, frame: 0, lastFrameChange: performance.now(), activated: false },
  { x: canvas.width / 1.5, y: groundY - 100, frame: 0, lastFrameChange: performance.now(), activated: false },
];

// Preload all sprite sheets
const loadedPlayerSpriteSheets = {};
const loadedAISpriteSheets = {};
const loadedZombieSpriteSheets = {};
const loadedCardSpriteSheets = {};


function preloadSpriteSheets(spriteSheets, loadedSheets) {
  Object.keys(spriteSheets).forEach((state) => {
    const img = new Image();
    img.src = spriteSheets[state].src;
    img.onerror = () => console.error(`Failed to load ${spriteSheets[state].src}`);
    loadedSheets[state] = img;
  });
}
preloadSpriteSheets(playerSpriteSheets, loadedPlayerSpriteSheets);
preloadSpriteSheets(aiSpriteSheets, loadedAISpriteSheets);
preloadSpriteSheets(zombieSpriteSheets, loadedZombieSpriteSheets);
preloadSpriteSheets(cardSpriteSheets, loadedCardSpriteSheets);

// Function to spawn a wave of zombies
function spawnZombieWave(count) {
  for (let i = 0; i < count; i++) {
    const zombieX = Math.random() > 0.5 ? -128 : canvas.width; // Spawn left or right
    zombies.push(createZombie(zombieX, groundY - 128));
  }
}

// Example usage: spawn a wave of 5 zombies every 10 seconds
setInterval(() => {
  spawnZombieWave(5);
}, 10000);

// Finish line properties
const finishLine = {
    x: canvas.width - 150, // Near the end of the level
    y: groundY - 150, // Above the ground
    width: 48,
    height: 48,
    spriteSheets: cardSpriteSheets,
    loadedSprites: loadedCardSpriteSheets,
    frame: 0,
    lastFrameChange: performance.now(),
    frameInterval: 100, // Time between frames in milliseconds
};

// Function to check if player reaches the finish line
function checkFinishLine() {
    if (
        player.x < finishLine.x + finishLine.width &&
        player.x + player.width > finishLine.x &&
        player.y < finishLine.y + finishLine.height &&
        player.y + player.height > finishLine.y
    ) {
        console.log("Level Complete!");
        loadNextLevel();
    }
}

// Function to animate and draw the finish line
function drawFinishLine() {
    const spriteSheet = finishLine.loadedSprites["rotating"];
    const { frameWidth, frameHeight, frameCount } = finishLine.spriteSheets["rotating"];
    const currentTime = performance.now();

    if (currentTime - finishLine.lastFrameChange > finishLine.frameInterval) {
        finishLine.frame = (finishLine.frame + 1) % frameCount; // Loop through frames
        finishLine.lastFrameChange = currentTime;
    }

    ctx.drawImage(
        spriteSheet,
        finishLine.frame * frameWidth, // Frame x position on sprite sheet
        0,                             // Frame y position
        frameWidth,
        frameHeight,
        finishLine.x,
        finishLine.y,
        finishLine.width,
        finishLine.height
    );
}

// Function to load the next level
function loadNextLevel() {
    currentLevel++;
    if (currentLevel > 2) { // Assuming you have 2 levels
        currentLevel = 1; // Loop back to the first level
    }
    loadLevel(currentLevel);
}

// Player properties
const player = {
    x: canvas.width / 4,
    y: groundY - 128,
    width: 128,
    height: 128,
    dx: 2, 
    dy: 0, 
    gravity: 0.5,
    isJumping: false,
    isCrouching: false,
    state: "idle",
    direction: "right",
    frame: 0,
    lastFrameChange: performance.now(),
    hurtTimer: 0,
    spriteSheets: playerSpriteSheets,
    loadedSprites: loadedPlayerSpriteSheets,
    health: 100,
    maxHealth: 100,
    attackCooldown: 0,
    checkpoint: { x: canvas.width / 4, y: groundY - 128 }, // Initial checkpoint
    isRespawning: false, // Respawn state
};

// Function to reset player to the last checkpoint
function respawnPlayer() {
    player.health = player.maxHealth;
    player.x = player.checkpoint.x;
    player.y = player.checkpoint.y;
    player.state = "idle";
    player.isRespawning = false; // End respawn process
}

// Function to handle player death
function checkPlayerDeath() {
    if (player.health <= 0 && !player.isRespawning) {
        player.isRespawning = true; // Prevent multiple respawn triggers
        setTimeout(() => {
            respawnPlayer();
        }, 1000); // Delay for respawn
    }
}

// AI companion properties
const ai = {
    x: (canvas.width * 3) / 4,
    y: groundY - 128,
    width: 128,
    height: 128,
    dx: 1, 
    dy: 0,
    gravity: 0.5,
    state: "idle",
    direction: "right",
    isJumping: false,
    frame: 0,
    lastFrameChange: performance.now(),
    hurtTimer: 0,
    spriteSheets: aiSpriteSheets,
    loadedSprites: loadedAISpriteSheets,
    health: 100,
    maxHealth: 100,
};

// Health bar dimensions
const healthBarWidth = 100;
const healthBarHeight = 10;

// Zombie properties
const zombies = [];

function createZombie(x, y) {
    return {
        x,
        y,
        width: 96,
        height: 96,
        dx: 1,
        health: 25,
        maxHealth: 25,
        state: "walk",
        direction: "left",
        frame: 0,
        lastFrameChange: performance.now(),
        gravity: 0.5,
        dy: 0,
        loadedSprites: loadedZombieSpriteSheets, 
        spriteSheets: zombieSpriteSheets,       
    };
}

// Spawn zombies periodically
setInterval(() => {
    const zombieX = Math.random() > 0.5 ? -128 : canvas.width; // Spawn left or right
    zombies.push(createZombie(zombieX, groundY - 128));
}, 3000);

// Keyboard input handling
let keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    if (e.key === "w" && !player.isJumping) {
        player.isJumping = true;
        player.dy = -10;
    }

    if (e.key === "s") {
        player.isCrouching = true;
    }

    if (e.key === "k") {
        gameRunning = true;
        animate();
    }

    if (e.key === "p") {
        gamePaused = !gamePaused;
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
    if (e.key === "s") player.isCrouching = false;
});

// Handle player attacking zombies
document.addEventListener("keydown", (e) => {
    if (e.key === "f" && player.attackCooldown <= 0) {
        player.state = "attack";
        player.attackCooldown = 500; // Cooldown in milliseconds
        zombies.forEach((zombie) => handleCombat(player, zombie));
    }
});

// Player movement and physics
function updatePlayer() {
    if (player.attackCooldown > 0) {
        player.attackCooldown -= 16.67; // Assuming ~60 FPS
    }

    if (player.state === "attack" && player.attackCooldown <= 0) {
        // Revert to idle/walk state after attack
        if (keys["a"]) {
            player.state = "walk";
        } else if (keys["d"]) {
            player.state = "walk";
        } else {
            player.state = "idle";
        }
    }

    if (player.y + player.height < groundY) {
        player.dy += player.gravity;
    }
    player.y += player.dy;
    if (player.y + player.height >= groundY) {
        player.dy = 0;
        player.isJumping = false;
        player.y = groundY - player.height;
    }

    if (keys["a"] && player.state !== "attack") {
        player.x -= player.dx;
        player.direction = "left";
        player.state = "walk";
    } else if (keys["d"] && player.state !== "attack") {
        player.x += player.dx;
        player.direction = "right";
        player.state = "walk";
    } else if (player.state !== "attack") {
        player.state = "idle";
    }
}

function updateDirection(entity, target) {
    if (entity.x < target.x) {
        entity.direction = "right";
    } else {
        entity.direction = "left";
    }
}

function updateAI() {
    const distanceToPlayer = Math.abs(player.x - ai.x);

    if (distanceToPlayer > 200) {
        ai.state = "walk";
        ai.x += ai.x > player.x ? -ai.dx : ai.dx;
        updateDirection(ai, player);
    } else {
        updateDirection(ai, player);
        console.log(ai.dx)
        ai.state = "idle";
    }

    if (player.isJumping && !ai.isJumping && Math.random() > 0.75) {
        ai.isJumping = true;
        ai.dy = -10;
    }

    if (ai.y + ai.height < groundY) {
        ai.dy += ai.gravity;
    }
    ai.y += ai.dy;

    if (ai.y + ai.height >= groundY) {
        ai.dy = 0;
        ai.isJumping = false;
        ai.y = groundY - ai.height;
    }
}

function drawGround() {
    ctx.fillStyle = "brown";
    ctx.fillRect(0, groundY, canvas.width, groundHeight);
}

function drawEntity(entity, ctx) {
  const spriteSheet = entity.loadedSprites[entity.state];
  const { frameWidth, frameHeight, frameCount } = entity.spriteSheets[entity.state];
  const currentTime = performance.now();

  if (currentTime - entity.lastFrameChange > 125) {
    entity.frame = (entity.frame + 1) % frameCount;
    entity.lastFrameChange = currentTime;
  }

  ctx.save();

  if (entity.hurtTimer > 0) {
    ctx.filter = "brightness(1.5)";
  }

  if (entity.direction === "left") {
    ctx.scale(-1, 1);
    ctx.drawImage(
      spriteSheet,
      entity.frame * frameWidth,
      0,
      frameWidth,
      frameHeight,
      -entity.x - entity.width,
      entity.y,
      entity.width,
      entity.height
    );
  } else {
    ctx.drawImage(
      spriteSheet,
      entity.frame * frameWidth,
      0,
      frameWidth,
      frameHeight,
      entity.x,
      entity.y,
      entity.width,
      entity.height
    );
  }

  ctx.restore();

  if (entity.hurtTimer > 0) {
    entity.hurtTimer -= 16.67; 
  }
}

function drawMenu() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px ownFont";
    ctx.textAlign = "center";

    ctx.fillText("Press 'K' to Start", canvas.width / 2, canvas.height / 2 - 50);
}

function drawPauseMenu() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px ownFont";
    ctx.fillText("Paused", canvas.width / 2 - 50, canvas.height / 2);
}
function updateAIState() {
    if (ai.isJumping) {
        ai.state = "jump";
    } else if (Math.abs(player.x - ai.x) > 200) {
        ai.state = "walk";
    } else {
        ai.state = "idle";
    }
}

updateAIState();
function updateState(entity, keys) {
  if (entity.isJumping) {
    entity.state = "jump";
  } else if (keys["s"] && entity === player) {
    entity.state = "crouch";
  } else if ((keys["a"] || keys["d"]) && entity === player) {
    entity.state = "walk";
  }
}

// Draw health bar
function drawHealthBar(entity, ctx) {
    const healthRatio = entity.health / entity.maxHealth;
    const barX = entity.x + (entity.width - healthBarWidth) / 2;
    const barY = entity.y - healthBarHeight - 5;

    ctx.fillStyle = "red";
    ctx.fillRect(barX, barY, healthBarWidth, healthBarHeight);
    ctx.fillStyle = "green";
    ctx.fillRect(barX, barY, healthBarWidth * healthRatio, healthBarHeight);
}

function handleCombat(attacker, target, cooldownInSec, damage) {
    if (
        target.health > 0 &&
        Math.abs(attacker.x - target.x) < 50 && 
        Math.abs(attacker.y - target.y) < 50 &&
        (!attacker.lastAttackTime || Date.now() - attacker.lastAttackTime >= cooldownInSec * 1000)
    ) {
        target.health -= damage; 
        target.hurtTimer = 200; 
        attacker.state = "attack"; 
        attacker.lastAttackTime = Date.now(); 
    }
}

// Update zombies
function updateZombies() {
    zombies.forEach((zombie, index) => {
        if (zombie.health <= 0) {
            zombies.splice(index, 1); 
            return;
        }

        const target = Math.abs(player.x - zombie.x) < Math.abs(ai.x - zombie.x) ? player : ai;

        zombie.direction = zombie.x < target.x ? "right" : "left";
        zombie.x += zombie.direction === "right" ? zombie.dx : -zombie.dx;

        if (zombie.y + zombie.height < groundY) {
            zombie.dy += zombie.gravity;
        }
        zombie.y += zombie.dy;

        if (zombie.y + zombie.height >= groundY) {
            zombie.dy = 0;
            zombie.y = groundY - zombie.height;
        }

        handleCombat(zombie, target, 1, 1); 
    });
}

function updatePlayerAndAI() {
    handleCombat(player, ai, 1, 10); 
    handleCombat(ai, player, 1, 10); 
}

document.addEventListener("keydown", (e) => {
    if (e.key === "f") {
        zombies.forEach((zombie) => handleCombat(player, zombie, 0.25, 10));
    }
});

function updateCombat() {
    if (player.state === "attack") {
        zombies.forEach((zombie) => handleCombat(player, zombie, 0.25, 10));
    }

    if (ai.state === "attack") {
        zombies.forEach((zombie) => handleCombat(ai, zombie, 0.25, 10));
    }
}

function drawZombies() {
    zombies.forEach((zombie) => {
        drawEntity(zombie, ctx);
        drawHealthBar(zombie, ctx);
    });
}

function drawCheckpoints() {
  checkpoints.forEach((checkpoint) => {
    const currentTime = performance.now();
    const { frameWidth, frameHeight, frameCount } = checkpointSpriteSheet;

    // Animate the checkpoint if it's not activated
    if (currentTime - checkpoint.lastFrameChange > 100) {
      checkpoint.frame = (checkpoint.frame + 1) % frameCount;
      checkpoint.lastFrameChange = currentTime;
    }

    const spriteX = checkpoint.frame * frameWidth;

    ctx.drawImage(
      loadedCheckpointSpriteSheet,
      spriteX,
      0,
      frameWidth,
      frameHeight,
      checkpoint.x,
      checkpoint.y,
      frameWidth,
      frameHeight
    );

    if (checkpoint.activated) {
      ctx.strokeStyle = "yellow"; // Indicate activation
      ctx.lineWidth = 2;
      ctx.strokeRect(checkpoint.x, checkpoint.y, frameWidth, frameHeight);
    }
  });
}

function checkCheckpoints() {
  checkpoints.forEach((checkpoint) => {
    if (
      player.x < checkpoint.x + checkpointSpriteSheet.frameWidth &&
      player.x + player.width > checkpoint.x &&
      player.y < checkpoint.y + checkpointSpriteSheet.frameHeight &&
      player.y + player.height > checkpoint.y &&
      !checkpoint.activated
    ) {
      checkpoint.activated = true;
      player.checkpoint = { x: checkpoint.x, y: checkpoint.y };
      console.log("Checkpoint activated at:", player.checkpoint);
    }
  });
}

let gameRunning = false;
let gamePaused = false;

function animate() {
    if (!gameRunning) {
        drawMenu();
        return;
    }

    if (gamePaused) {
        drawPauseMenu();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();

    updatePlayer();
    updateAI();
    updateZombies();
    updateCombat();

    checkPlayerDeath(); // Check if player needs to respawn
    checkFinishLine(); // Check if player reaches the finish line
    checkCheckpoints(); // Check player interaction with checkpoints

    updateState(player, keys);
    updateState(ai, {});

    drawEntity(player, ctx);
    drawEntity(ai, ctx);
    drawZombies();
    drawFinishLine(); // Draw the finish line
    drawCheckpoints(); // Draw checkpoints

    drawHealthBar(player, ctx);
    drawHealthBar(ai, ctx);

    requestAnimationFrame(animate);
}



let currentLevel = 1;

function loadLevel(levelNumber) {
    const script = document.createElement('script');
    script.src = `levels/level${levelNumber}.js`;
    script.onload = () => {
        window[`loadLevel${levelNumber}`]();
    };
    document.body.appendChild(script);
}

// Initialize the first level
loadLevel(currentLevel);

animate();
