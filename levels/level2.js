function loadLevel2() {
    // Define level-specific properties
    player.x = canvas.width / 4;
    player.y = groundY - player.height;
    ai.x = (canvas.width * 3) / 4;
    ai.y = groundY - ai.height;

    // Clear existing zombies and checkpoints
    zombies.length = 0;
    checkpoints.length = 0;

    // Add level-specific zombies and checkpoints
    zombies.push(createZombie(canvas.width / 3, groundY - 128));
    checkpoints.push({ x: canvas.width / 1.5, y: groundY - 100, frame: 0, lastFrameChange: performance.now(), activated: false });

    // Any other level-specific initialization
}