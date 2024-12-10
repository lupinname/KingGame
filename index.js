const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');

// canvas settting
let canvasXBlock = 16
let canvasYBlock = 9
canvas.width = 64 * 16; //1024
canvas.height = 64 * 9; // 576
function resetCanvas() {
    canvas.width = 64 * 16; //1024
    canvas.height = 64 * 9; // 576

    canvasXBlock = 16
    canvasYBlock = 9
}
function settingCanvas(a, b) {
    canvas.width = 64 * a; //1024
    canvas.height = 64 * b; // 576

    canvasXBlock = a;
    canvasYBlock = b;
}
//debug draw monster
let isDrawMonster = true


let setYCannon = 45
let parsedCollisions
let collisionBlocks
let background
let doors
let pigs
let isSetPigs = false
let player
let cannons
let isSetCannon = false
let bombs
let isSetBomb = false

let setPlayerInfo = {
    init: () => {
        player = new Player({
            position: {
                x: 200,
                y: 400,
            },
            imageSrc: './img/king/idle.png',
            frameRate: 11,
            animations: {
                idleAttack: {
                    frameRate: 3,
                    frameBuffer: 10,
                    loop: false,
                    imageSrc: './img/king/idleAttack.png',
                },
                idle: {
                    frameRate: 11,
                    frameBuffer: 8,
                    loop: true,
                    imageSrc: './img/king/idle.png',
                },
                idleRun: {
                    frameRate: 8,
                    frameBuffer: 8,
                    loop: true,
                    imageSrc: './img/king/idleRun.png',
                },
                idleDead: {
                    frameRate: 4,
                    frameBuffer: 15,
                    loop: true,
                    imageSrc: './img/king/idleDead.png',
                },
                enterDoor: {
                    frameRate: 8,
                    frameBuffer: 8,
                    loop: false,
                    imageSrc: './img/king/enterDoor.png',
                    onComplete: () => {
                        // console.log('completed')
                        gsap.to(overlay, {
                            opacity: 1,
                            onComplete: () => {
                                level++

                                if (level === 6) level = 1
                                isSetPigs = false;
                                isSetCannon = false;
                                pigs = null
                                levels[level].init()
                                player.switchSprite('idle')
                                player.preventInput = false
                                gsap.to(overlay, {
                                    opacity: 0,
                                })
                            },
                        })
                    },
                },
            },
        });
    }
}

//level map 
let level = 1
let levels = {
    1: {
        init: () => {
            resetCanvas()
            if(isDrawMonster){
                isSetPigs = true
                isSetCannon = false
                isSetBomb = false
            }
            if (player.currentAnimation) player.currentAnimation.isActive = false
            player.position.x = 200
            player.position.y = 400

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/map/backgroundLevel1.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 767,
                        y: 270,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 10,
                    loop: false,
                    autoplay: false,
                })
            ]
            cannons = [
                new Cannon({
                    position: {
                        x: 400,
                        y: 340,
                    },
                    imageSrc: './img/Cannon/idleCannon.png',
                    frameRate: 1,
                    frameBuffer: 1,
                    isFlip: true,
                })
            ]
            // bombs = [
            //     new Bomb({
            //         position: {
            //             x: 400,
            //             y: 325,
            //         },
            //     })
            // ]
            pigs = [
                new Pig({
                    position: {
                        x: 600,
                        y: 300,
                    },
                    imageSrc: './img/Pig/pig.png',
                    frameRate: 11,
                    frameBuffer: 10,
                    life: 3,
                    isFlip: true,

                })
            ]
            checkCollision(collisionLevel1);
        }
    },
    2: {
        init: () => {
            resetCanvas()
            if(isDrawMonster){
                isSetPigs = true
                isSetCannon = false
                isSetBomb = true
            }
            if (player.currentAnimation) player.currentAnimation.isActive = false
            player.position.x = 96
            player.position.y = 140

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/map/backgroundLevel2.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 772,
                        y: 336,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 10,
                    loop: false,
                    autoplay: false,
                })
            ]
            bombs = [
                new Bomb({
                    position: {
                        x: 711,
                        y: 448 - 58,
                    },
                })
            ]
            pigs = [
                new Pig({
                    position: {
                        x: 500,
                        y: 500,
                    },
                    imageSrc: './img/Pig/pig.png',
                    frameRate: 11,
                    frameBuffer: 10,
                    life: 4,
                    isFlip: true,
                }
                )
            ]
            checkCollision(collisionLevel2);
        }
    },
    3: {
        init: () => {
            resetCanvas()
            if(isDrawMonster){
                isSetPigs = true
                isSetCannon = true
                isSetBomb = false
            }
            if (player.currentAnimation) player.currentAnimation.isActive = false

            player.position.x = 780
            player.position.y = 140

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/map/backgroundLevel3.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 176,
                        y: 335,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 10,
                    loop: false,
                    autoplay: false,
                })
            ]
            
            cannons = [
                new Cannon({
                    position: {
                        x: 734,
                        y: 448 - setYCannon,
                    },
                    imageSrc: './img/Cannon/idleCannon.png',
                    // imageSrc: './img/Cannon/cannonShoot.png',
                    frameRate: 1,
                    frameBuffer: 1,
                    isFlip: true,
                })
            ]
            pigs = [
                new Pig({
                    position: {
                        x: 340,
                        y: 399,
                    },
                    imageSrc: './img/Pig/pig.png',
                    frameRate: 11,
                    frameBuffer: 10,
                    life: 4,
                    xflip: -1,
                    isFlip: true,
                }
                )
            ]
            checkCollision(collisionLevel3);
        }
    },
    4: {
        init: () => {
            settingCanvas(20, 10)
            if(isDrawMonster){
                isSetPigs = true
                isSetCannon = true
                isSetBomb = true
            }
            if (player.currentAnimation) player.currentAnimation.isActive = false
            player.position.x = 128
            player.position.y = 400

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/map/backgroundLevel4.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 999.33,
                        y: 399.33,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 10,
                    loop: false,
                    autoplay: false,
                })
            ]
            bombs = [
                new Bomb({
                    position: {
                        x: 500,
                        y: 446 - 58,
                    },
                }),
                new Bomb({
                    position: {
                        x: 458,
                        y: 319 - 58,
                    },
                }),
            ]

            cannons = [
                new Cannon({
                    position: {
                        x: 140,
                        y: 192 - setYCannon,
                    },
                    imageSrc: './img/Cannon/idleCannon.png',
                    // imageSrc: './img/Cannon/cannonShoot.png',
                    frameRate: 1,
                    frameBuffer: 1,
                    xflip: -1,
                    isFlip: true,
                }),
                new Cannon({
                    position: {
                        x: 1020,
                        y: 257 - setYCannon,
                    },
                    imageSrc: './img/Cannon/idleCannon.png',
                    // imageSrc: './img/Cannon/cannonShoot.png',
                    frameRate: 1,
                    frameBuffer: 1,
                    xflip: 1,
                    isFlip: true,
                }),
            ]
            

            pigs = [
                new Pig({
                    position: {
                        x: 726,
                        y: 512 - 32,
                    },
                    imageSrc: './img/Pig/pig.png',
                    frameRate: 11,
                    frameBuffer: 10,
                    life: 4,
                    isFlip: true,
                }
                ),
                new Pig({
                    position: {
                        x: 850,
                        y: 512 - 32,
                    },
                    imageSrc: './img/Pig/pig.png',
                    frameRate: 11,
                    frameBuffer: 10,
                    life: 4,
                    isFlip: true,
                }
                ),
            ]

            checkCollision(collisionLevel4);
        }
    },
    5: {
        init: () => {
            settingCanvas(15, 23)
            if(isDrawMonster){
                isSetPigs = true
                isSetCannon = true
                 isSetBomb = true
            }
            if (player.currentAnimation) player.currentAnimation.isActive = false
            player.position.x = 603
            player.position.y = 1290

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/map/backgroundLevel5.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 135,
                        y: 143.5,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 10,
                    loop: false,
                    autoplay: false,
                })
            ]
            bombs = [
                new Bomb({
                    position: {
                        x: 567,
                        y: 768 - 58,
                    },
                }),
                new Bomb({
                    position: {
                        x: 387,
                        y: 192 - 58,
                    },
                }),
                new Bomb({
                    position: {
                        x: 582,
                        y: 448 - 58,
                    },
                }),
                new Bomb({
                    position: {
                        x: 450,
                        y: 1150 - 58,
                    },
                }),
            ]
            cannons = [
                new Cannon({
                    position: {
                        x: 750,
                        y: 705 - setYCannon,
                    },
                    imageSrc: './img/Cannon/idleCannon.png',
                    // imageSrc: './img/Cannon/cannonShoot.png',
                    frameRate: 1,
                    frameBuffer: 1,
                    xflip: 1,
                    isFlip: true,
                }),
                new Cannon({
                    position: {
                        x: 129,
                        y: 640 - setYCannon,
                    },
                    imageSrc: './img/Cannon/idleCannon.png',
                    // imageSrc: './img/Cannon/cannonShoot.png',
                    frameRate: 1,
                    frameBuffer: 1,
                    setTimeAttack: 350,
                    xflip: -1,
                    isFlip: true,
                }),
                new Cannon({
                    position: {
                        x: 129,
                        y: 448 - setYCannon,
                    },
                    imageSrc: './img/Cannon/idleCannon.png',
                    // imageSrc: './img/Cannon/cannonShoot.png',
                    frameRate: 1,
                    frameBuffer: 1,
                    setTimeAttack: 200,
                    xflip: -1,
                    isFlip: true,
                }),
            ]
            pigs = [
                new Pig({
                    position: {
                        x: 740,
                        y: 319 - 32,
                    },
                    imageSrc: './img/Pig/pig.png',
                    frameRate: 11,
                    frameBuffer: 10,
                    life: 4,
                    isFlip: true,
                }
                )
            ]

            checkCollision(collisionLevel5);
        }
    },
}


//Keys controll
const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    f: {
        pressed: false,
    },
    k: {
        pressed: false,
    },
}

const overlay = {
    opacity: 0
}

function checkCollision(collisionLevel) {
    parsedCollisions = collisionLevel.parse2D();
    collisionBlocks = parsedCollisions.creatObjectsFrom2D()
    player.collisionBlocks = collisionBlocks
    if (isSetPigs) {
        pigs.forEach((pig) => {
            pig.collisionBlocks = collisionBlocks
        })
    }
}



function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    // clear background
    // c.fillStyle = 'white';
    // c.fillRect(0, 0, canvas.width, canvas.height);
    // c.clearRect(0, 0, canvas.width, canvas.height);


    //Draw
    background.draw();
    collisionBlocks.forEach((collisionBlock) => {
        collisionBlock.draw()
    })

    
    doors.forEach((door) => {
        door.draw()
    })

    if(isSetCannon){
        cannons.forEach((cannon) => {
            cannon.update()
            cannon.draw()
        })
    }
    if(isSetBomb){
        bombs.forEach((bomb) => {
            if(bomb.isAlive){
                bomb.update()
                bomb.draw()
            }
        })
    }

    if (isSetPigs) {
        pigs.forEach((pig) => {
            if (pig.isAlive) {
                pig.draw()
                pig.update();
            } else {
                pig.switchSprite('pigDead')
                if (pig.isDead != true) {
                    pig.draw()
                }
            }
        })
    }

    player.handleInput(keys);
    player.draw();
    player.update();



    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.restore()
}
setPlayerInfo.init()
levels[level].init()
animate();


