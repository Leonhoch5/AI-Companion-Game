function loadLevel2() {
    // Ensure groundY is defined
    const groundY = canvas.height - 50; // Example value, adjust as needed
    // Define level-specific properties
    player.x = canvas.width / 4;
    player.y = groundY - player.height;
    ai.x = (canvas.width * 3) / 4;
    ai.y = groundY - ai.height;

    // Clear existing zombies and checkpoints
    zombies.length = 0;
    checkpoints.length = 0;

    // Add level-specific checkpoints
    checkpoints.push({ x: canvas.width / 2, y: groundY - 50, frame: 0, lastFrameChange: performance.now(), activated: false });
    checkpoints.push({ x: canvas.width / 1.5, y: groundY - 100, frame: 0, lastFrameChange: performance.now(), activated: false });

    // Spawn initial wave of zombies (10 zombies, 1 second interval)
    spawnZombieWave(10, 1000);
    moneyObjects.push({ x: canvas.width / 2, y: groundY - 24, frame: 0, lastFrameChange: performance.now(),amount: 50 });
    moneyObjects.push({ x: canvas.width / 3, y: groundY - 24, frame: 0, lastFrameChange: performance.now(), amount: 20 });
}
