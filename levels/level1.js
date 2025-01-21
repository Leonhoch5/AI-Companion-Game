let tutorialStep = 0; // Tracks the current tutorial step
let playerAnswers = {}; // Stores player responses for later use

const tutorialMessages = [
    { text: "Welcome! Press 'Enter' to continue", action: "start" },
    { text: "This is my game where an 'AI', is your second player and adjust to you decisions and actions", action: "explain" },
    { text: "Welcome! Use 'A' to walk left and 'D' to walk right. Try it now.", action: "walk" },
    { text: "Press 'W' to jump. Try jumping now.", action: "jump" },
    { text: "Hold 'S' to crouch. Try crouching now.", action: "crouch" },
    { text: "Press 'F' to attack. Try attacking now.", action: "attack" },
    { text: "Question: Do you like solving puzzles or fighting more?\nType 'puzzles' or 'fighting' and press Enter.", action: "question2" },
    { text: "Tutorial complete! Press 'K' to start the game.", action: "complete" },
];

function drawTutorialMessage() {
    const message = tutorialMessages[tutorialStep];
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "32px ownFont";
    ctx.textAlign = "center";
    
    const lines = message.text.split('\n');
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height / 2 + index * 40);
    });
}

function handleTutorialInput(e) {
    const message = tutorialMessages[tutorialStep];
    if (tutorialStep === 0 && e.key === "K") {
        gameRunning = true;
        document.removeEventListener("keydown", handleTutorialInput);
        document.querySelector("#playerInput").style.display = "none";
        animate();
        return;
    }
    switch (message.action) {
        case "start":
            if (keys["Enter"]) {
                tutorialStep++;
            }
            break;
        case "explain":
            if (keys["Enter"]) {
                tutorialStep++;
            }
            break;    
        case "walk":
            if (keys["a"] || keys["d"]) {
                tutorialStep++;
            }
            break;

        case "jump":
            if (keys["w"]) {
                tutorialStep++;
            }
            break;

        case "crouch":
            if (keys["s"]) {
                tutorialStep++;
            }
            break;

        case "attack":
            if (e.key === "f") {
                tutorialStep++;
            }
            break;

        case "question2":
            if (e.key === "Enter") {
                playerAnswers.preference = document.querySelector("#playerInput").value.toLowerCase();
                tutorialStep++;
            }
            break;

        case "complete":
            if (e.key === "K") {
                gameRunning = true;
                document.removeEventListener("keydown", handleTutorialInput);
                document.querySelector("#playerInput").style.display = "none";
                animate();
            }
            break;
    }
}

document.addEventListener("keydown", handleTutorialInput);

function tutorialLoop() {
    if (tutorialStep < tutorialMessages.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGround();
        drawEntity(player, ctx);
        drawTutorialMessage();
        requestAnimationFrame(tutorialLoop);
    }
}

// Start tutorial
tutorialLoop();

// Input field for text responses
const inputField = document.createElement("input");
inputField.type = "text";
inputField.id = "playerInput";
inputField.placeholder = "Type your answer here...";
inputField.style.position = "absolute";
inputField.style.top = "60%";
inputField.style.left = "50%";
inputField.style.transform = "translate(-50%, -50%)";
inputField.style.display = "none";
document.body.appendChild(inputField);

// Show input field during questions
function toggleInputField(show) {
    inputField.style.display = show ? "block" : "none";
}

// Listen for Enter key to submit responses
inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleTutorialInput(e);
        inputField.value = ""; // Clear input
        toggleInputField(false); // Hide input after submission
    }
});

// Detect tutorial question steps to show input field
function checkTutorialStep() {
    const message = tutorialMessages[tutorialStep];
    if (message.action.startsWith("question")) {
        toggleInputField(true);
    } else {
        toggleInputField(false);
    }
}
setInterval(checkTutorialStep, 100);

function loadLevel1() {
    // Ensure groundY is defined
    const groundY = canvas.height - 50; // Example value, adjust as needed
    // Define level-specific properties
    player.x = canvas.width / 4;
    player.y = groundY - player.height;
    ai.x = (canvas.width * 3) / 4;
    ai.y = groundY - ai.height;

    // Clear existing zombies, checkpoints, and money
    zombies.length = 0;
    checkpoints.length = 0;
    moneyObjects.length = 0;

    // Add level-specific checkpoints
    checkpoints.push({ x: canvas.width / 1.5, y: groundY - 42, frame: 0, lastFrameChange: performance.now(), activated: false });

    // Spawn initial wave of zombies (2 zombies, 1 second interval)
    spawnZombieWave(2, 1000);

    // Add money objects
    moneyObjects.push({ x: canvas.width / 2, y: groundY - 24, frame: 0, lastFrameChange: performance.now() });
    moneyObjects.push({ x: canvas.width / 3, y: groundY - 24, frame: 0, lastFrameChange: performance.now() });
}
