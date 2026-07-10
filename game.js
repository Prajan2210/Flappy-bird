// Three.js scene setup
let scene, camera, renderer;
let bird, pipes = [];
let gameRunning = false;
let gamePaused = false;
let score = 0;
let bestScore = localStorage.getItem('flappyBird3DBestScore') || 0;

// UI Elements
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('bestScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

// Game constants
const GRAVITY = 0.0008;  // FIXED: Changed from negative to positive
const FLAP_POWER = -0.25; // FIXED: Changed from positive to negative (upward)
const PIPE_SPEED = -0.15;
const PIPE_GAP = 4;
const PIPE_DISTANCE = 15;
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 60;

// Initialize Three.js scene
function initScene() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 150, 200);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create bird
    createBird();

    // Create ground and ceiling
    createBoundaries();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Update best score display
    bestScoreDisplay.textContent = bestScore;
}

// Create bird with wings
function createBird() {
    // Create a group for the bird
    bird = new THREE.Group();
    
    // Body (main sphere)
    const bodyGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        metalness: 0.1,
        roughness: 0.6,
        emissive: 0xffaa00,
        emissiveIntensity: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    bird.add(body);

    // Eye
    const eyeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.1
    });
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(0.7, 0.3, 1.1);
    eye.castShadow = true;
    bird.add(eye);

    // Pupil
    const pupilGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const pupilMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0,
        roughness: 0
    });
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.position.set(0.85, 0.3, 1.2);
    pupil.castShadow = true;
    bird.add(pupil);

    // Beak
    const beakGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
    const beakMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        metalness: 0.3,
        roughness: 0.6
    });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.set(1.3, 0, 0);
    beak.rotation.z = Math.PI / 2;
    beak.castShadow = true;
    bird.add(beak);

    // Left Wing
    const wingGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.8);
    const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 0.1,
        roughness: 0.6,
        emissive: 0xff8800,
        emissiveIntensity: 0.2
    });
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.5, 0.3, 0);
    leftWing.rotation.z = Math.PI / 6;
    leftWing.castShadow = true;
    bird.add(leftWing);

    // Right Wing
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.5, 0.3, 0);
    rightWing.rotation.z = -Math.PI / 6;
    rightWing.castShadow = true;
    bird.add(rightWing);

    // Set bird properties
    bird.position.x = -20;
    bird.position.y = 0;
    bird.velocity = { x: 0, y: 0, z: 0 };
    bird.rotation = { x: 0, y: 0, z: 0 };
    bird.wings = { left: leftWing, right: rightWing };

    scene.add(bird);
}

// Create boundaries
function createBoundaries() {
    // Ground
    const groundGeometry = new THREE.BoxGeometry(WORLD_WIDTH * 2, 2, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B7355,
        metalness: 0.2,
        roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -WORLD_HEIGHT / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Ceiling
    const ceilingGeometry = new THREE.BoxGeometry(WORLD_WIDTH * 2, 2, 100);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0x87ceeb,
        metalness: 0.2,
        roughness: 0.8
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = WORLD_HEIGHT / 2;
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    // Side walls (for reference)
    const wallGeometry = new THREE.BoxGeometry(2, WORLD_HEIGHT, 100);
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        metalness: 0.3,
        roughness: 0.7
    });
    
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.x = -WORLD_WIDTH / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.position.x = WORLD_WIDTH / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
}

// Create pipe pair
function createPipe() {
    const minGap = -WORLD_HEIGHT / 2 + 5;
    const maxGap = WORLD_HEIGHT / 2 - 5 - PIPE_GAP;
    const gapY = Math.random() * (maxGap - minGap) + minGap;

    const pipeWidth = 2;
    const pipeDepth = 100;

    // Top pipe
    const topGeometry = new THREE.BoxGeometry(pipeWidth, WORLD_HEIGHT / 2 - (gapY + PIPE_GAP / 2), pipeDepth);
    const pipeMaterial = new THREE.MeshStandardMaterial({
        color: 0x2ecc71,
        metalness: 0.4,
        roughness: 0.6,
        emissive: 0x1aa850,
        emissiveIntensity: 0.3
    });
    const topPipe = new THREE.Mesh(topGeometry, pipeMaterial);
    topPipe.position.y = (gapY + PIPE_GAP / 2 + (WORLD_HEIGHT / 2 - (gapY + PIPE_GAP / 2)) / 2);
    topPipe.position.x = WORLD_WIDTH / 2 + 20;
    topPipe.castShadow = true;
    topPipe.receiveShadow = true;

    // Bottom pipe
    const bottomGeometry = new THREE.BoxGeometry(pipeWidth, WORLD_HEIGHT / 2 - (WORLD_HEIGHT / 2 - gapY), pipeDepth);
    const bottomPipe = new THREE.Mesh(bottomGeometry, pipeMaterial);
    bottomPipe.position.y = (gapY - (WORLD_HEIGHT / 2 - gapY) / 2);
    bottomPipe.position.x = WORLD_WIDTH / 2 + 20;
    bottomPipe.castShadow = true;
    bottomPipe.receiveShadow = true;

    scene.add(topPipe);
    scene.add(bottomPipe);

    pipes.push({
        top: topPipe,
        bottom: bottomPipe,
        passed: false,
        x: WORLD_WIDTH / 2 + 20,
        gapY: gapY
    });
}

// Update game state
function update() {
    if (!gameRunning || gamePaused) return;

    // Update bird physics
    bird.velocity.y += GRAVITY; // Bird falls DOWN now
    bird.velocity.y = Math.min(bird.velocity.y, 0.5); // Terminal velocity
    bird.position.y += bird.velocity.y;

    // Rotate bird based on velocity
    bird.rotation.z = Math.max(-0.5, Math.min(0.5, bird.velocity.y * 0.1));

    // Animate wings
    if (bird.wings) {
        const wingFlap = Math.sin(Date.now() * 0.01) * 0.3;
        bird.wings.left.rotation.z = Math.PI / 6 + wingFlap;
        bird.wings.right.rotation.z = -Math.PI / 6 - wingFlap;
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.top.position.x += PIPE_SPEED;
        pipe.bottom.position.x += PIPE_SPEED;
        pipe.x += PIPE_SPEED;

        // Check if pipe passed (score)
        if (!pipe.passed && pipe.x < bird.position.x) {
            pipe.passed = true;
            score++;
            scoreDisplay.textContent = score;
        }

        // Remove off-screen pipes
        if (pipe.top.position.x < -WORLD_WIDTH / 2 - 20) {
            scene.remove(pipe.top);
            scene.remove(pipe.bottom);
            pipes.splice(i, 1);
        }
    }

    // Create new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < WORLD_WIDTH / 2 - PIPE_DISTANCE) {
        createPipe();
    }

    // Check collisions
    checkCollisions();
}

// Check collisions
function checkCollisions() {
    const birdRadius = 1.5;

    // Top and bottom collision
    if (bird.position.y + birdRadius > WORLD_HEIGHT / 2 || bird.position.y - birdRadius < -WORLD_HEIGHT / 2) {
        endGame();
        return;
    }

    // Pipe collision
    pipes.forEach(pipe => {
        const pipeWidth = 2;
        const pipeX = pipe.top.position.x;
        
        // Check if bird is within pipe x range
        if (bird.position.x + birdRadius > pipeX - pipeWidth && bird.position.x - birdRadius < pipeX + pipeWidth) {
            // Check collision with top pipe
            const topPipeBottomY = pipe.gapY + PIPE_GAP / 2;
            if (bird.position.y + birdRadius > topPipeBottomY) {
                endGame();
                return;
            }

            // Check collision with bottom pipe
            const bottomPipeTopY = pipe.gapY - PIPE_GAP / 2;
            if (bird.position.y - birdRadius < bottomPipeTopY) {
                endGame();
                return;
            }
        }
    });
}

// Render scene
function render() {
    renderer.render(scene, camera);
}

// Game loop
function animate() {
    requestAnimationFrame(animate);
    update();
    render();
}

// Start game
function startGame() {
    gameRunning = true;
    gamePaused = false;
    score = 0;
    bird.position.y = 0;
    bird.velocity.y = 0;
    bird.rotation.z = 0;
    
    // Clear pipes
    pipes.forEach(pipe => {
        scene.remove(pipe.top);
        scene.remove(pipe.bottom);
    });
    pipes = [];

    scoreDisplay.textContent = score;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
}

// End game
function endGame() {
    gameRunning = false;
    pauseBtn.disabled = true;
    startBtn.disabled = false;

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('flappyBird3DBestScore', bestScore);
        bestScoreDisplay.textContent = bestScore;
    }
}

// Pause game
function pauseGame() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'RESUME' : 'PAUSE';
}

// Bird flap
function flap() {
    if (gameRunning && !gamePaused) {
        bird.velocity.y = FLAP_POWER; // Now goes UP
    }
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        flap();
    }
});

window.addEventListener('click', flap);

// Initialize and start
initScene();
animate();
