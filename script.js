/*
  Name: Seim Habte
  Date: 2025-10-03
  CSC 372-01

  JS for Rock, Paper, Scissors.
*/
'use strict';

/** @typedef {"rock" | "paper" | "scissors"} Throw */

const ASSETS = {
  rock:      { src: "images/rock.png",      label: "rock" },
  paper:     { src: "images/paper.png",     label: "paper" },
  scissors:  { src: "images/scissors.png",  label: "scissors" }
};


const throwFigures = Array.from(document.querySelectorAll('.throw'));
const computerImg = document.getElementById('computer-image');
const computerCaption = document.getElementById('computer-caption');
const outcomeText = document.getElementById('outcome-text');
const winsEl = document.getElementById('wins');
const lossesEl = document.getElementById('losses');
const tiesEl = document.getElementById('ties');
const resetBtn = document.getElementById('reset-btn');


let isBusy = false;
let wins = 0, losses = 0, ties = 0;

/**
 * @param {HTMLElement} el
 */
function highlightChoice(el) {
  throwFigures.forEach(f => f.classList.remove('selected'));
  el.classList.add('selected');
}

/**
 * Randomly pick a throw.
 * @return {Throw}
 */
function randomThrow() {
  const keys = /** @type {Throw[]} */ (['rock', 'paper', 'scissors']);
  const i = Math.floor(Math.random() * keys.length);
  return keys[i];
}

/**
 * Decide winner from player vs computer.
 * @param {Throw} player
 * @param {Throw} computer
 * @return {"win"|"lose"|"tie"}
 */
function decideWinner(player, computer) {
  if (player === computer) return "tie";
  const winsAgainst = { rock: "scissors", paper: "rock", scissors: "paper" };
  return winsAgainst[player] === computer ? "win" : "lose";
}

/**
 * Shuffle computer image 
 * @return {Promise<Throw>}
 */
function shuffleComputerThinking() {
  return new Promise(resolve => {
    const order = /** @type {Throw[]} */ (['rock', 'paper', 'scissors']);
    let idx = 0;
    let elapsed = 0;
    computerCaption.textContent = "?";
    const id = setInterval(() => {
      const t = order[idx % order.length];
      computerImg.src = ASSETS[t].src;
      computerImg.alt = "Shuffling... " + ASSETS[t].label;
      idx++;
      elapsed += 500;
    }, 500);
    setTimeout(() => {
      clearInterval(id);
      const finalThrow = randomThrow();
      computerImg.src = ASSETS[finalThrow].src;
      computerImg.alt = ASSETS[finalThrow].label;
      computerCaption.textContent = ASSETS[finalThrow].label;
      resolve(finalThrow);
    }, 3000);
  });
}

/**
 * @param {"win"|"lose"|"tie"} result
 */
function updateScore(result) {
  if (result === "win") { wins++; outcomeText.textContent = "You win!"; }
  else if (result === "lose") { losses++; outcomeText.textContent = "Computer wins."; }
  else { ties++; outcomeText.textContent = "It's a tie."; }
  winsEl.textContent = String(wins);
  lossesEl.textContent = String(losses);
  tiesEl.textContent = String(ties);
}


function resetGame() {
  wins = losses = ties = 0;
  winsEl.textContent = "0";
  lossesEl.textContent = "0";
  tiesEl.textContent = "0";
  outcomeText.textContent = "Pick a throw to start.";
  computerImg.src = "images/question-mark.png";
  computerImg.alt = "Thinking...";
  computerCaption.textContent = "?";
  throwFigures.forEach(f => f.classList.remove('selected'));
}

/**
 * @param {Throw} playerThrow
 * @param {HTMLElement} figureEl
 */
async function handlePlayerTurn(playerThrow, figureEl) {
  if (isBusy) return;
  isBusy = true;
  highlightChoice(figureEl);
  outcomeText.textContent = "Computer is thinking...";
  const computerThrow = await shuffleComputerThinking();
  const result = decideWinner(playerThrow, computerThrow);
  updateScore(result);
  isBusy = false;
}


throwFigures.forEach(fig => {
  fig.addEventListener('click', () => {
    const choice = /** @type {Throw} */ (fig.getAttribute('data-throw'));
    handlePlayerTurn(choice, fig);
  });
  fig.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const choice = /** @type {Throw} */ (fig.getAttribute('data-throw'));
      handlePlayerTurn(choice, fig);
    }
  });
});
resetBtn.addEventListener('click', resetGame);
