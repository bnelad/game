'use strict'

const LASER_SPEED = 80
var gHero = {
    pos: { i:12, j: 5 }, 
    isShoot: false,
    isSuperShoot: false,
    superModeCount: 3,
    isShootNeighbors: false
}

// creates the hero and place it on board
function createHero(board) {
    board[gHero.pos.i][gHero.pos.j] = { type: EARTH, gameObject: HERO }
}

// Handle game keys
function onKeyDown(ev) {
    switch (ev.key) {
        case 'ArrowRight':
            moveHero(1)
            break
        case 'ArrowLeft':
            moveHero(-1)
            break
        case ' ':
            shoot()
            break
        case 'n':
            gHero.isShootNeighbors = true
            shoot()
            break
        case 'x':
            gHero.isSuperShoot = (gHero.superModeCount === 0) ? false : true
            if (gHero.isSuperShoot) shoot()
            break
        default:
    }
}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
    if (!gGame.isOn) return
    if (hasInvadersGone()) gameOverWon()
    var nextPos = {
        i: gHero.pos.i,
        j: gHero.pos.j + dir
    }
    if (nextPos.j < 0 || nextPos.j > gBoard[0].length - 1) return
    updateCell(gHero.pos, '')
    gHero.pos.j = nextPos.j
    updateCell(gHero.pos, HERO)
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    if (!gGame.isOn) return
    if (gHero.isShoot) return
    if (hasInvadersGone()) gameOverWon()
    gHero.isShoot = true
    var laserPos = {
        i: gHero.pos.i - 1,
        j: gHero.pos.j
    }
    var laserSpeed = LASER_SPEED
    var blinkInterval = setInterval(() => {
        if (laserPos.i === 0) return
        blinkLaser(laserPos)
        laserPos.i--
        if ((gBoard[laserPos.i][laserPos.j].gameObject === ALIEN1) ||
            (gBoard[laserPos.i][laserPos.j].gameObject === ALIEN2) ||
            (gBoard[laserPos.i][laserPos.j].gameObject === ALIEN3)) {
            gGame.aliensCount++
            updateScore(10)
            if (gHero.isSuperShoot) {
                var laserSpeed = LASER_SPEED
                laserSpeed *= 0.3
                gHero.superModeCount--
                gHero.isSuperShoot = false
            }
            if (gHero.isShootNeighbors) {
                shootNeighbors(laserPos)
                gHero.isShootNeighbors = false
            }
            if (gGame.aliensCount === gAliensRowLength * gAliensRowCount) {
                gGame.isOn = false
                gameOverWon()
            }
        }
        if ((gBoard[laserPos.i][laserPos.j].gameObject === ALIEN1) || (laserPos.i === 0) ||
            (gBoard[laserPos.i][laserPos.j].gameObject === ALIEN2) ||
            (gBoard[laserPos.i][laserPos.j].gameObject === ALIEN3)) {
            clearInterval(blinkInterval)
            updateCell(laserPos, '')
            gHero.isShoot = false
        }
        if (hasInvadersGone()) gameOverWon()
    }, laserSpeed)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    var laserType = (gHero.isSuperShoot) ? SUPER_LASER : LASER
    gBoard[pos.i][pos.j].gameObject = laserType
    updateCell({ i: pos.i, j: pos.j }, laserType)
    gBoard[pos.i][pos.j].gameObject = ''
    setTimeout(updateCell, LASER_SPEED, { i: pos.i, j: pos.j })
}

function shootNeighbors(pos) {
    var countAliens = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[i].length) continue
            if (i === pos.i && j === pos.j) continue
            if (gBoard[i][j].gameObject === ALIEN1) countAliens++
            if (gBoard[i][j].gameObject === ALIEN2) countAliens++
            if (gBoard[i][j].gameObject === ALIEN3) countAliens++
            updateCell({ i, j })
        }
    }
    gGame.aliensCount += countAliens
    updateScore((countAliens) * 10) 
}