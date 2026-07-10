# 🎮 3D Flappy Bird Game

A stunning 3D version of the classic Flappy Bird game built with **Three.js**! Fly through 3D pipes in a beautiful 3D environment.

## ✨ Features

- 🎯 **Full 3D Graphics** - Built with Three.js for realistic 3D rendering
- 🌟 **Dynamic Lighting** - Ambient and directional lighting for immersive visuals
- 🎨 **Modern Materials** - PBR (Physically Based Rendering) materials with metalness and roughness
- 📊 **Score Tracking** - Real-time score with persistent best score
- ⏸️ **Pause/Resume** - Full game pause functionality
- 🎵 **Smooth Physics** - Realistic gravity and collision detection
- 📱 **Responsive Design** - Works on all screen sizes
- 🌐 **WebGL Rendering** - Hardware-accelerated 3D graphics

## 🎮 How to Play

1. Click the **START GAME** button
2. Press **SPACE** or **CLICK** to make the bird fly upward
3. Navigate through the green 3D pipes
4. Avoid hitting the pipes or boundaries
5. Score increases each time you pass through a pipe gap
6. Your best score is automatically saved

## 🎮 Controls

- **SPACE KEY** - Make the bird fly up
- **MOUSE CLICK** - Make the bird fly up (anywhere on screen)
- **PAUSE BUTTON** - Pause/Resume the game
- **START BUTTON** - Start a new game

## 📋 Game Rules

- The bird is affected by gravity and falls continuously
- Each flap provides upward velocity
- Navigate between the green pipes without collision
- Collision with pipes, ground, or ceiling ends the game
- Score 1 point for each pipe successfully passed
- Higher scores are saved to your browser's local storage

## 🚀 Installation

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Enjoy the 3D gameplay!

## 📁 File Structure

```
flappy-bird-3d/
├── index.html      # Main HTML file with Three.js setup
├── style.css       # Modern UI styling
├── game.js         # Game logic and Three.js implementation
└── README.md       # This file
```

## 🛠️ Technologies Used

- **Three.js** - 3D graphics library for WebGL rendering
- **HTML5** - Web structure
- **CSS3** - Modern styling and animations
- **Vanilla JavaScript** - Game logic and physics
- **WebGL** - Hardware-accelerated 3D graphics
- **LocalStorage API** - Score persistence

## 💻 Browser Compatibility

Works on all modern browsers with WebGL support:
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## 🎨 Visual Features

- **Bird**: Glowing yellow sphere with realistic physics
- **Pipes**: Green 3D boxes with metallic appearance
- **Environment**: Sky blue background with ground plane
- **Lighting**: Dynamic 3D lighting with shadows
- **Camera**: Smooth perspective view of the game world

## 📈 Game Difficulty

- Pipes spawn at random heights within the playable area
- Consistent pipe gap size provides a fair challenge
- Physics feel responsive and realistic
- Increasingly challenging as you progress

Enjoy your 3D Flappy Bird adventure! 🚀