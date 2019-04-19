// create a new canvas element
var cnv = document.createElement('canvas')

// get the 2d drawing context
var ctx = cnv.getContext('2d')

// set the width and height of the canvas (in pixels)
cnv.width = 512

cnv.height = 480
// find the #game div
var gameDiv = document.getElementById('game')

// put the canvas into the game div
gameDiv.appendChild(cnv)

// load the images
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";


var intervalFunction = function() {
    if (bgReady && heroReady && monsterReady) {
        clearInterval(interval)
        imagesHaveLoaded()
    }
}

var interval = setInterval(intervalFunction, 100)

function imagesHaveLoaded () {
    console.log('all images have loaded')

    var hero = {
        speed: 256,
        x: 0,
        y: 0,
        width: 32,
        height: 32
    }

    var monster = {
        x: 0,
        y: 0,
        width: 30,
        height: 32
    }

    var monstersCaught = 0

    var KEYS = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39
    }

    var keysDown = {}
    addEventListener('keydown', function(e) {
        // console.log('keydown: e.keyCode', e.keyCode)
        keysDown[e.keyCode] = true
        console.log(keysDown)
    })
    addEventListener('keyup', function (e) {
        // console.log('keyup: e.keyCode', e.keyCode)
        delete keysDown[e.keyCode]
        console.log(keysDown)
    })

    function reset() {
        hero.x = cnv.width / 2
        hero.y = cnv.height / 2
        monster.x = 32 + Math.round(Math.random() * (cnv.width - 64))
        monster.y = 32 + Math.round(Math.random() * (cnv.height - 64))
    }

    function update(deltaTime) {
        var secondsThatHavePassed = deltaTime / 1000
        var distanceToGo = hero.speed * secondsThatHavePassed
        if (keysDown[KEYS.UP]) {
            hero.y -= distanceToGo
        }
        if (keysDown[KEYS.DOWN]) {
            hero.y += distanceToGo
        }
        if (keysDown[KEYS.LEFT]) {
            hero.x -= distanceToGo
        }
        if (keysDown[KEYS.RIGHT]) {
            hero.x += distanceToGo
        }

        // lets store the x coordinates for hero and monster
        var a = hero.x
        var b = hero.x + hero.width
        var c = monster.x
        var d = monster.x + monster.width

        var ac = a <= c
        var cb = c <= b
        var ad = a <= d
        var db = d <= b

        var isXOverlapping = (ac && cb === true) || (ad && db === true)
        
        var e = hero.y
        var f = hero.y + hero.height
        var g = monster.y
        var h = monster.y + monster.height

        var eg = e <= g
        var gf = g <= f
        var eh = e <= h
        var hf = h <= f

        var isYOverlapping = (eg && gf === true) || (eh && hf === true)

        if (isXOverlapping && isYOverlapping) {
            monstersCaught++
            reset()
        }
    }

    function render () {
        ctx.drawImage(bgImage, 0, 0)
        ctx.drawImage(heroImage, hero.x, hero.y)
        ctx.drawImage(monsterImage, monster.x, monster.y)

        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Monsters caught: " + monstersCaught, 32, 32)
    }

    var then = Date.now()

    function main () {
        var now = Date.now()
        var delta = now - then
        update(delta)
        render()
        then = now
        
        requestAnimationFrame(main)
    }

    main()

}