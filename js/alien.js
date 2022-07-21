'use strict'

var ALIEN_SPEED = 500
var gIntervalAliensRight
var gIntervalAliensLeft
var gIntervalAliensDown
var gCanShiftRight = true
var gCanShiftLeft = false
var gCanShiftDown = false
var gIsAlienFreeze = false

// The following two variables represent the part of the matrix (some rows) 
// that we should shift (left, right, and bottom) // 
// We need to update those when: // 
// (1) shifting down and (2) last alien was cleared from row 
var gAliensTopRowIdx
var gAliensBottomRowIdx

function createAliens(board) {
    for (var i = 0; i < gAliensRowCount; i++) {
        for (var j = 0; j < gAliensRowLength; j++) {
            board[i][j] = { type: SKY, gameObject: ALIEN }
        }
    }
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = gAliensRowCount - 1
}

function handleAlienHit(pos) {
    if (gBoard[pos.i][pos.j].gameObject === LASER) {
        updateCell(pos, '')
        gGame.aliensCount++
    }
}

function shiftBoardRight(board, fromI, toI) {
    if (!gCanShiftRight) return
    if (gCanShiftDown) return
    var oldBoard = copyMat(board)
    for (var i = fromI; i <= toI; i++) {
        for (var j = 0; j <= board[0].length - 1; j++) {
            board[i][j] = (j === 0) ? createCell() : oldBoard[i][j - 1]
            handleAlienHit({ i, j })
            if (board[i][board[0].length - 1].gameObject === ALIEN) {
                clearInterval(gIntervalAliensRight)
                gCanShiftRight = false
                gCanShiftLeft = true
                gCanShiftDown = true
            }
            updateCell({ i, j }, board[i][j].gameObject)
        }
    }
}

function shiftBoardLeft(board, fromI, toI) {
    if (!gCanShiftLeft) return
    if (gCanShiftDown) return
    var oldBoard = copyMat(board)
    for (var i = fromI; i <= toI; i++) {
        for (var j = board[0].length - 1; j >= 0; j--) {
            board[i][j] = (j === board[0].length - 1) ? createCell() : oldBoard[i][j + 1]
            handleAlienHit({ i, j })
            if (board[i][0].gameObject === ALIEN) {
                gCanShiftLeft = false
                gCanShiftRight = true
                gCanShiftDown = true
                clearInterval(gIntervalAliensLeft)
            }
            updateCell({ i, j }, board[i][j].gameObject)
        }
    }
}

function shiftBoardDown(board, fromI, toI) {
    if (!gCanShiftDown) return
    var oldBoard = copyMat(board)
    for (var i = fromI; i < toI + 2; i++) {
        for (var j = 0; j < oldBoard[0].length; j++) {
            board[i][j] = (i - 1 < 0) ? createCell() : oldBoard[i - 1][j]
            updateCell({ i, j }, board[i][j].gameObject)
            handleAlienHit({ i, j })
        }
    }
    if (isLost()) gameOverLost ()
    gCanShiftDown = false
    gAliensTopRowIdx++
    gAliensBottomRowIdx++
    clearInterval(gIntervalAliensDown)
    clearInterval(gIntervalAliensLeft)
    clearInterval(gIntervalAliensRight)
    moveAliens()
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time 
// when the aliens are reaching the hero row - interval stops 
function moveAliens() {
    if (gIsAlienFreeze) return
    if (!gGame.isOn) return
    gIntervalAliensDown = setInterval(shiftBoardDown, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    gIntervalAliensRight = setInterval(shiftBoardRight, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    gIntervalAliensLeft = setInterval(shiftBoardLeft, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
}

function isLost() {
    for (var i = gBoard.length - 2; i < gBoard.length - 1; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].gameObject === ALIEN) {
                clearInterval(gIntervalAliensDown)
                clearInterval(gIntervalAliensLeft)
                clearInterval(gIntervalAliensRight)
                return true
            }
        }
    }
    return false
}

function freezeAliens() {
    var elBtnFreezeAliens = document.querySelector('.freeze')
    if (!gIsAlienFreeze) {
        gIsAlienFreeze = true
        clearInterval(gIntervalAliensDown)
        clearInterval(gIntervalAliensLeft)
        clearInterval(gIntervalAliensRight)
        elBtnFreezeAliens.innerText = 'Unfreeze aliens'
    } else {
        gIsAlienFreeze = false
        moveAliens()
        elBtnFreezeAliens.innerText = 'Freeze aliens'
    }
}
