// Game State
let score = 0;
let currentMission = 0;
let player = { x: 1, y: 1, dir: 'down', frame: 0 };
let maze = [];
const ROWS = 10;
const COLS = 15;
const TILE_SIZE = 40;
let items = [];
let gameActive = false;

// Missions Data
const missions = [
    {
        id: 0,
        type: 'quiz',
        questions: [
            { q: "In what year was the Malaysian Anti-Corruption Commission (MACC/SPRM) established?", a: ["1967", "2009", "1997", "2015"], correct: 1 },
            { q: "What is the primary mission of SPRM?", a: ["To collect taxes", "To manage traffic", "To fight corruption and promote integrity", "To build roads"], correct: 2 },
            { q: "Which body provides independent oversight of SPRM?", a: ["The Police", "JKMR (Special Committee on Corruption)", "The Ministry of Health", "Sports Council"], correct: 1 }
        ]
    },
    {
        id: 1,
        type: 'maze',
        itemCount: 3
    },
    {
        id: 2,
        type: 'scenario',
        scenarios: [
            { q: "A contractor offers you a 'festive hamper' worth RM500 during a project evaluation. What should you do?", a: ["Accept it as a gift", "Report the offer to your superior/MACC", "Share it with colleagues", "Ask for money instead"], correct: 1 },
            { q: "You witness a colleague bypassing standard procurement rules. How should you report it?", a: ["Keep quiet", "Post it on social media", "Use the official MACC portal/Whistleblower channel", "Tell your friends"], correct: 2 }
        ]
    }
];

// Initialize Game
function startGame() {
    score = 0;
    updateScore();
    startMission1();
}

function updateScore() {
    document.getElementById('score').innerText = score;
    document.getElementById('final-score-val').innerText = score;
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// MISSION 1: QUIZ
let currentQuizIndex = 0;
function startMission1() {
    currentMission = 1;
    currentQuizIndex = 0;
    document.getElementById('mission-name').innerText = "The Briefing";
    showScreen('briefing-screen');
    showQuestion();
}

function showQuestion() {
    const qData = missions[0].questions[currentQuizIndex];
    document.getElementById('question-text').innerText = qData.q;
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    qData.a.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(idx);
        container.appendChild(btn);
    });
}

function checkAnswer(idx) {
    const qData = missions[0].questions[currentQuizIndex];
    if (idx === qData.correct) {
        score += 100;
        updateScore();
        showFeedback(true);
        currentQuizIndex++;
        if (currentQuizIndex < missions[0].questions.length) {
            setTimeout(showQuestion, 1000);
        } else {
            setTimeout(startMission2, 1000);
        }
    } else {
        showFeedback(false);
    }
}

function showFeedback(isCorrect) {
    const container = document.getElementById('game-container');
    if (!isCorrect) {
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 500);
    }
    // Simple visual feedback
    const feedback = document.createElement('div');
    feedback.style.position = 'absolute';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.fontSize = '100px';
    feedback.style.zIndex = '1000';
    feedback.innerText = isCorrect ? '✅' : '❌';
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 800);
}

// MISSION 2: MAZE
function startMission2() {
    currentMission = 2;
    document.getElementById('mission-name').innerText = "The Investigation";
    showScreen('investigation-screen');
    initMaze();
    
    // Key listeners
    window.removeEventListener('keydown', handleMazeMove);
    window.addEventListener('keydown', handleMazeMove);
    
    // Mobile controls
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');

    if (btnUp) {
        btnUp.onmousedown = btnUp.ontouchstart = (e) => { e.preventDefault(); handleMove('ArrowUp'); };
        btnDown.onmousedown = btnDown.ontouchstart = (e) => { e.preventDefault(); handleMove('ArrowDown'); };
        btnLeft.onmousedown = btnLeft.ontouchstart = (e) => { e.preventDefault(); handleMove('ArrowLeft'); };
        btnRight.onmousedown = btnRight.ontouchstart = (e) => { e.preventDefault(); handleMove('ArrowRight'); };
    }

    requestAnimationFrame(gameLoop);
}

function handleMove(direction) {
    handleMazeMove({ key: direction });
}

function initMaze() {
    const canvas = document.getElementById('maze-canvas');
    canvas.width = COLS * TILE_SIZE;
    canvas.height = ROWS * TILE_SIZE;
    
    // Fill with walls
    maze = Array(ROWS).fill().map(() => Array(COLS).fill(1));
    
    // Recursive Backtracking
    function carve(r, c) {
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]].sort(() => Math.random() - 0.5);
        maze[r][c] = 0;
        
        for (let [dr, dc] of dirs) {
            let nr = r + dr * 2;
            let nc = c + dc * 2;
            
            if (nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1 && maze[nr][nc] === 1) {
                maze[r + dr][c + dc] = 0;
                carve(nr, nc);
            }
        }
    }
    
    carve(1, 1);
    
    // Set player start
    player.x = 1;
    player.y = 1;
    
    // Add items in random open spots
    items = [];
    let openSpots = [];
    for (let r = 1; r < ROWS - 1; r++) {
        for (let c = 1; c < COLS - 1; c++) {
            if (maze[r][c] === 0 && (r !== 1 || c !== 1)) {
                openSpots.push({x: c, y: r});
            }
        }
    }
    
    for (let i = 0; i < 3; i++) {
        if (openSpots.length > 0) {
            let idx = Math.floor(Math.random() * openSpots.length);
            let spot = openSpots.splice(idx, 1)[0];
            items.push({ x: spot.x, y: spot.y, collected: false });
        }
    }
    
    document.getElementById('files-count').innerText = "0";
    gameActive = true;
}

function handleMazeMove(e) {
    if (!gameActive) return;
    let nextX = player.x;
    let nextY = player.y;
    
    if (e.key === 'ArrowUp') { nextY--; player.dir = 'up'; }
    else if (e.key === 'ArrowDown') { nextY++; player.dir = 'down'; }
    else if (e.key === 'ArrowLeft') { nextX--; player.dir = 'left'; }
    else if (e.key === 'ArrowRight') { nextX++; player.dir = 'right'; }
    
    if (maze[nextY] && maze[nextY][nextX] === 0) {
        player.x = nextX;
        player.y = nextY;
        player.frame = (player.frame + 1) % 2;
        checkItemCollision();
    }
}

function checkItemCollision() {
    items.forEach(item => {
        if (!item.collected && item.x === player.x && item.y === player.y) {
            item.collected = true;
            score += 200;
            updateScore();
            document.getElementById('files-count').innerText = items.filter(it => it.collected).length;
            if (items.every(it => it.collected)) {
                gameActive = false;
                window.removeEventListener('keydown', handleMazeMove);
                setTimeout(startMission3, 1000);
            }
        }
    });
}

function draw() {
    const canvas = document.getElementById('maze-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Walls
    ctx.fillStyle = '#003366';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (maze[r][c] === 1) {
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = '#002244';
                ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    
    // Draw Items (Evidence Folder)
    const time = Date.now() * 0.005;
    items.forEach(item => {
        if (!item.collected) {
            const offset = Math.sin(time) * 5;
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.rect(item.x * TILE_SIZE + 5, item.y * TILE_SIZE + 10 + offset, 30, 20);
            ctx.fill();
            // Folder flap
            ctx.beginPath();
            ctx.rect(item.x * TILE_SIZE + 5, item.y * TILE_SIZE + 5 + offset, 10, 5);
            ctx.fill();
        }
    });
    
    // Draw Player (Officer)
    drawOfficer(ctx, player.x * TILE_SIZE, player.y * TILE_SIZE);
}

function drawOfficer(ctx, x, y) {
    // Body (Grey Uniform)
    ctx.fillStyle = '#808080';
    ctx.fillRect(x + 10, y + 10, 20, 25);
    
    // Head
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(x + 12, y + 2, 16, 12);
    
    // Cap (Grey)
    ctx.fillStyle = '#808080';
    ctx.fillRect(x + 10, y, 20, 5);
    // Gold Badge
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + 18, y + 1, 4, 3);
    
    // Legs (Walking Animation)
    ctx.fillStyle = '#333';
    if (player.frame === 0) {
        ctx.fillRect(x + 12, y + 35, 6, 5);
        ctx.fillRect(x + 22, y + 35, 6, 5);
    } else {
        ctx.fillRect(x + 10, y + 35, 6, 5);
        ctx.fillRect(x + 24, y + 35, 6, 5);
    }
}

function gameLoop() {
    if (currentMission === 2) {
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// MISSION 3: SCENARIOS
let currentScenarioIndex = 0;
function startMission3() {
    currentMission = 3;
    currentScenarioIndex = 0;
    document.getElementById('mission-name').innerText = "Public Integrity";
    showScreen('prevention-screen');
    showScenario();
}

function showScenario() {
    const sData = missions[2].scenarios[currentScenarioIndex];
    document.getElementById('scenario-text').innerText = sData.q;
    const container = document.getElementById('prevention-options');
    container.innerHTML = '';
    sData.a.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkScenario(idx);
        container.appendChild(btn);
    });
}

function checkScenario(idx) {
    const sData = missions[2].scenarios[currentScenarioIndex];
    if (idx === sData.correct) {
        score += 300;
        updateScore();
        showFeedback(true);
        currentScenarioIndex++;
        if (currentScenarioIndex < missions[2].scenarios.length) {
            setTimeout(showScenario, 1000);
        } else {
            setTimeout(finishGame, 1000);
        }
    } else {
        showFeedback(false);
    }
}

function finishGame() {
    document.getElementById('mission-name').innerText = "Completed";
    showScreen('end-screen');
}
