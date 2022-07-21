'use strict'

const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'
const SUPER_LASER  = '^'
const SKY = 'SKY'
const EARTH = 'EARTH'
const BOARD_SIZE = 14

var gAliensRowLength = 8
var gAliensRowCount = 3

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard
var gGame = {
    isOn: false,
    aliensCount: 0,
    score: 0
}

// Called when game loads
function init() {
    gGame.isOn = true
    gBoard = createBoard()
    gGame.score = 0
    gGame.aliensCount =  0
    renderBoard(gBoard)
    restartScore() 
    moveAliens()
}

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard() {
    const board = []
    for (var i = 0; i < BOARD_SIZE; i++) {
        board.push([])
        for (var j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = createCell()
            if (i >= BOARD_SIZE - 2) board[i][j].type = EARTH
        }      
    }
    createHero(board)
    createAliens(board)
    return board
}

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var className = `cell cell-${i}-${j}`
            if (i === board.length - 1) className += ' ground'
            cell.gameObject = (!cell.gameObject) ? '' : cell.gameObject
            strHTML += `<td class="${className}"> ${cell.gameObject} </td>\n`
        }
        strHTML += '</tr>\n'
    }
    strHTML += '</tbody></table>'
    var elContainer = document.querySelector('.board-container')
    elContainer.innerHTML = strHTML
}

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
    return {
    type: SKY,
    gameObject: gameObject
    }
}

// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}

function updateScore(diff) {
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score
}

function restartScore() {
    gGame.score = 0
    document.querySelector('h2 span').innerText = gGame.score
}

function gameOverWon() {
    gGame.isOn = false
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    var elModalWon = document.querySelector('.modal h3')
    elModalWon.innerText = 'Victory!'
}

function gameOverLost () {
    gGame.isOn = false
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    var elModalWon = document.querySelector('.modal h3')
    elModalWon.innerText = 'You lost, try again!'
}

function restartGame() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    gGame.isOn = true
    gHero.pos = { i:12, j: 5 }
    init()
}

function hasInvadersGone() {
    for (var i = 0; i < BOARD_SIZE; i++) {
        for (var j = 0; j < BOARD_SIZE; j++) {
            if (gBoard[i][j].gameObject === ALIEN) return false
        }      
    }
    return true
}
