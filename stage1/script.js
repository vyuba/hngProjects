const colorBox = document.querySelectorAll(".color-box");
const guessedColor = document.querySelector(".guessed-color");
const startGameButton = document.querySelector(".start-game-button");
const endGameButton = document.querySelector(".reset-game-button");
const scoreContainer = document.querySelector(".score-container");
const statusBar = document.querySelector(".status");
let score = 0;
let colors = [];
let roundActive = false; // Flag to control click events per round
let clicked = false; // Flag to control click events after correct guess

// Function to generate a single random RGB color
function getRandomRGBColor() {
  // Generate random numbers between 0 and 255 for red, green, and blue
  const r = Math.floor(255);
  const g = Math.floor(255);
  const b = Math.floor(Math.random() * 256);
  // Return the color string in rgb(r, g, b) format
  return `rgb(${r}, ${g}, ${b})`;
}

// Function to generate an array of random RGB colors
function getRandomColors(num = 4) {
  const randomColors = [];
  for (let i = 0; i < num; i++) {
    randomColors.push(getRandomRGBColor());
  }
  return randomColors;
}

const updateGame = () => {
  // Activate the round and update UI elements
  roundActive = true;
  clicked = false;
  startGameButton.textContent = "Next Round";
  statusBar.textContent = "";
  statusBar.style.transform = "translateX(-100%)";
  endGameButton.style.display = "block";

  // Generate a new array of 4 random RGB colors for this round
  colors = getRandomColors(6);

  // Pick a random target color from the colors array
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  guessedColor.style.backgroundColor = randomColor;
  console.log(randomColor);

  // For each color box, assign a color and add a click listener
  colorBox.forEach((box, index) => {
    // Assign a color from the colors array (use modulo in case there are extra boxes)
    const color = colors[index % colors.length];
    box.style.backgroundColor = color;

    // Set the click event for the box (overwriting any previous listener)
    box.onclick = () => {
      console.log(box);
      // If the round is not active, ignore the click and show a message
      if (!roundActive && clicked === true) {
        statusBar.style.transition = "transform 0.5s";
        statusBar.style.transform = "translateX(10px)";
        statusBar.textContent = "click next round to continue";
        statusBar.style.border = "1px solid yellow";
        statusBar.style.borderBottom = "3px solid yellow";
        // add a delay before hiding the message
        setTimeout(() => {
          statusBar.style.transform = "translateX(-100%)";
        }, 3000);
        clearTimeout();
        return;
      }

      // Disable further clicks for this round
      roundActive = false;

      // Check if the clicked box's color matches the target color
      if (box.style.backgroundColor === randomColor) {
        score += 10;

        statusBar.style.transition = "transform 0.5s";
        statusBar.style.transform = "translateX(10px)";
        statusBar.textContent = "yayy! you guessed it right";
        statusBar.style.border = "1px solid green";
        statusBar.style.borderBottom = "3px solid green";
        // add a delay before hiding the message
        // for (let i = 0; i < 10; i++) {
        createConfetti(box, 200);
        // }
        setTimeout(() => {
          statusBar.style.transform = "translateX(-100%)";
        }, 3000);
        clearTimeout();
        // Disaable further clicks after correct guess
        clicked = true;
      } else {
        statusBar.style.transition = "transform 0.5s";
        statusBar.style.transform = "translateX(10px)";
        statusBar.textContent = "oops! wrong guess";
        statusBar.style.border = "1px solid red";
        statusBar.style.borderBottom = "3px solid red";
        // remove wrong class if added
        box.classList.add("wrong");
        // add a delay before hiding the message
        setTimeout(() => {
          statusBar.style.transform = "translateX(-100%)";
        }, 3000);
        clearTimeout();
      }
      scoreContainer.textContent = `score: ${score}`;
    };
    // remove wrong class if added
    box.classList.remove("wrong");
  });
};

startGameButton.addEventListener("click", updateGame);

function createConfetti(target, count = 10) {
  const colors = ["red", "blue", "yellow", "green", "purple", "orange"];

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    const xOffset = Math.random() * 100 - 50; // Spread out horizontally
    const yOffset = Math.random() * 100 - 50; // Spread out vertically

    confetti.style.left = `${target.offsetLeft + xOffset}px`;
    confetti.style.top = `${target.offsetTop + yOffset}px`;

    document.body.appendChild(confetti);

    // Animate Confetti
    setTimeout(() => {
      confetti.style.transform = `translateY(${
        Math.random() * 200 - 100
      }px) rotate(${Math.random() * 360}deg)`;
      confetti.style.opacity = "0";
    }, 300);

    // Remove after animation
    setTimeout(() => confetti.remove(), 1000);
  }
}

endGameButton.addEventListener("click", () => {
  guessedColor.style.backgroundColor = "transparent";
  colorBox.forEach((box) => {
    box.style.backgroundColor = "transparent";
  });
  startGameButton.textContent = "start game";
  endGameButton.style.display = "none";
  score = 0;
  scoreContainer.textContent = `score: ${score}`;
  clicked = false;
  roundActive = false;
});
