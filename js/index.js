class Cell {
  constructor(id, row, column, isAlive, aliveNeighbors) {
    this.id = id
    this.row = row
    this.column = column
    this.isAlive = isAlive 
    this.aliveNeighbors = aliveNeighbors
  }
}

const COLUMNS = 15
const ROWS = 15
const PLAY = document.getElementById("playButton")
const PAUSE = document.getElementById("pauseButton")
const RESET = document.getElementById("resetButton")
const RANDOM = document.getElementById("randomButton")
const CHECKBOXES = document.getElementsByClassName("checkbox")
const sliderLabel = document.getElementById("sliderLabel")
let delay = 200
let flag = false
let generation

RESET.onclick = function() {
  for (let i = 0; i < ROWS * COLUMNS; i++) {
    CHECKBOXES[i].checked = false
  }
  flag = false
  document.getElementById("gameField").style.pointerEvents = "all"
}

RANDOM.onclick = function() {
  for (let i = 0; i < ROWS * COLUMNS; i++) {
    CHECKBOXES[i].checked = Boolean(Math.floor(2 * Math.random()))
  }
}

PAUSE.onclick = function() {
  flag = false
  document.getElementById("gameField").style.pointerEvents = "all"
}

PLAY.onclick = function() {
  // Can only be changed if paused
  if (flag === false) {
    flag = true
    document.getElementById("gameField").style.pointerEvents = "none"
    generation = createGeneration()
    loop(generation, CHECKBOXES)
  }
}

// Returns initial generation
function createGeneration() {
  generation = []
  for (let i = 0; i < ROWS; i++) {
    let generationRow = []
    for (let j = 0; j < COLUMNS; j++) {
      let id = i * ROWS + j
      generationRow.push(new Cell(id, i, j, CHECKBOXES[id].checked))
    }
    generation.push(generationRow)
  }
  return generation
}

// Loops through new generations with certain delay
async function loop (generation, CHECKBOXES) {
  while (flag) {
    countNeighbors(generation)
    newGeneration(generation, CHECKBOXES)
    await new Promise(r => setTimeout(r, delay));
  }
}

// Counts all living neighbors for each cell
function countNeighbors(generation) {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      let counter = 0
      // Top cell
      if (i-1 >= 0) {
        counter = generation[i-1][j].isAlive ? counter+1 : counter
      }
      // Top-right cell
      if (i-1 >= 0 && j+1 < COLUMNS) {
        counter = generation[i-1][j+1].isAlive ? counter+1 : counter
      }
      // Right cell
      if (j+1 < COLUMNS) {
        counter = generation[i][j+1].isAlive ? counter+1 : counter
      }
      // Bot-right cell
      if (i+1 < ROWS && j+1 < COLUMNS) {
        counter = generation[i+1][j+1].isAlive ? counter+1 : counter
      }
      // Bot cell
      if (i+1 < ROWS) {
        counter = generation[i+1][j].isAlive ? counter+1 : counter
      }
      // Bot-left cell
      if (i+1 < ROWS && j-1 >= 0) {
        counter = generation[i+1][j-1].isAlive ? counter+1 : counter
      }
      // Left cell
      if (j-1 >= 0) {
        counter = generation[i][j-1].isAlive ? counter+1 : counter
      }
      // Top-left cell
      if (i-1 >= 0 && j-1 >= 0) {
        counter = generation[i-1][j-1].isAlive ? counter+1 : counter
      }
      generation[i][j].aliveNeighbors = counter
    }
  }
}

// Conway's Game of Life rules
function newGeneration(generation, CHECKBOXES) {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      let cell = generation[i][j]
      if (cell.isAlive === true && (2 > cell.aliveNeighbors || cell.aliveNeighbors > 3)) {
        cell.isAlive = false
        CHECKBOXES[cell.id].checked = false
      }
      else if (cell.isAlive === false && cell.aliveNeighbors === 3) {
        cell.isAlive = true
        CHECKBOXES[cell.id].checked = true
      }
    }
  }
}

function changeSliderLabel(value) {
  delay = value * 1000
  sliderLabel.innerHTML = `${value}`;
}

function buttonHover(button) {
  button.style.color = "#504945"
}

function buttonLeave(button) {
  button.style.color = "#fbf1c7"
}