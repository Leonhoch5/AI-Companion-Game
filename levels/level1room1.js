function loadLevel2() {
    // Ensure groundY is defined
    const groundY = canvas.height - 40; // Example value, adjust as needed
    // Define level-specific properties
    player.x = canvas.width / 4;
    player.y = groundY - player.height;
    ai.x = (canvas.width * 3) / 4;
    ai.y = groundY - ai.height;

    // Clear existing zombies and checkpoints
    zombies.length = 0;
    checkpoints.length = 0;

    doors.push( { x: 200, y: groundY - 64, frame: 0, lastFrameChange: performance.now(), roomScript: "level1room1.js"});


}

