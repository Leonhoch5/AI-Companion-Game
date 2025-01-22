function loadLevel2() {
    const groundY = canvas.height - 40; 
    player.x = canvas.width / 4;
    player.y = groundY - player.height;
    ai.x = (canvas.width * 3) / 4;
    ai.y = groundY - ai.height;

    zombies.length = 0;
    checkpoints.length = 0;

    doors.push( { x: 200, y: groundY - 64, frame: 0, lastFrameChange: performance.now(), roomScript: "level1room1.js"});


}

