const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');

canvas.width = 64 * 16; //1024
canvas.height = 64 * 9; // 576



let parsedCollisions
let collisionBlocks
let background
let doors
let pigs
let isSetPigs = false
let player

let setPlayerInfo ={
    init: () => {
         player = new Player({
            position: {
                x: 200,
                y: 200,
            },
            imageSrc: './img/king/idle.png',
            frameRate: 11,
            animations: {
                attackRight: {
                    frameRate: 3,
                    frameBuffer: 10,
                    loop: false,
                    imageSrc: './img/king/attack.png',
                    // onComplete: () => {
                    //     player.preventInput = false
                    // },
                },
                attackLeft: {
                    frameRate: 3,
                    frameBuffer: 10,
                    loop: false,
                    imageSrc: './img/king/attackLeft.png',
                },
                idleRight: {
                    frameRate: 11,
                    frameBuffer: 8,
                    loop: true,
                    imageSrc: './img/king/idle.png',
                },
                idleLeft: {
                    frameRate: 11,
                    frameBuffer: 8,
                    loop: true,
                    imageSrc: './img/king/idleLeft.png',
                },
                runRight: {
                    frameRate: 8,
                    frameBuffer: 8,
                    loop: true,
                    imageSrc: './img/king/runRight.png',
                },
                runLeft: {
                    frameRate: 8,
                    frameBuffer: 8,
                    loop: true,
                    imageSrc: './img/king/runLeft.png',
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
        
                                if (level === 4) level = 1
                                isSetPigs = false;
                                levels[level].init()
                                player.switchSprite('idleRight')
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
// Player setting
//  const player = new Player({
//     position: {
//         x: 200,
//         y: 200,
//     },
//     imageSrc: './img/king/idle.png',
//     frameRate: 11,
//     animations: {
//         attackRight: {
//             frameRate: 3,
//             frameBuffer: 10,
//             loop: false,
//             imageSrc: './img/king/attack.png',
//             // onComplete: () => {
//             //     player.preventInput = false
//             // },
//         },
//         attackLeft: {
//             frameRate: 3,
//             frameBuffer: 10,
//             loop: false,
//             imageSrc: './img/king/attackLeft.png',
//         },
//         idleRight: {
//             frameRate: 11,
//             frameBuffer: 8,
//             loop: true,
//             imageSrc: './img/king/idle.png',
//         },
//         idleLeft: {
//             frameRate: 11,
//             frameBuffer: 8,
//             loop: true,
//             imageSrc: './img/king/idleLeft.png',
//         },
//         runRight: {
//             frameRate: 8,
//             frameBuffer: 8,
//             loop: true,
//             imageSrc: './img/king/runRight.png',
//         },
//         runLeft: {
//             frameRate: 8,
//             frameBuffer: 8,
//             loop: true,
//             imageSrc: './img/king/runLeft.png',
//         },
//         enterDoor: {
//             frameRate: 8,
//             frameBuffer: 8,
//             loop: false,
//             imageSrc: './img/king/enterDoor.png',
//             onComplete: () => {
//                 // console.log('completed')
//                 gsap.to(overlay, {
//                     opacity: 1,
//                     onComplete: () => {
//                         level++

//                         if (level === 4) level = 1
//                         isSetPigs = false;
//                         levels[level].init()
//                         player.switchSprite('idleRight')
//                         player.preventInput = false
//                         gsap.to(overlay, {
//                             opacity: 0,
//                         })
//                     },
//                 })
//             },
//         },
//     },
// });



//level map 
let level = 1
let levels = {
    1: {
        init: () => {
            isSetPigs = true
            // parsedCollisions = collisionLevel1.parse2D();
            // collisionBlocks = parsedCollisions.creatObjectsFrom2D()
            // player.collisionBlocks = collisionBlocks
            // pig.collisionBlocks = collisionBlocks
            if (player.currentAnimation) player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/backgroundLevel1.png'
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
            pigs = [
                new Pig({
                    position: {
                        x: 400,
                        y: 300,
                    },
                    imageSrc: './img/Pig/pig.png',
                    frameRate: 11,
                    frameBuffer: 10,
                    life: 3,
                    isFlip: true,

                }),
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
            isSetPigs = true
            parsedCollisions = collisionLevel2.parse2D();
            collisionBlocks = parsedCollisions.creatObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            if (player.currentAnimation) player.currentAnimation.isActive = false

            player.position.x = 96
            player.position.y = 140

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/backgroundLevel2.png'
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
            isSetPigs = false
            parsedCollisions = collisionLevel3.parse2D();
            collisionBlocks = parsedCollisions.creatObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            if (player.currentAnimation) player.currentAnimation.isActive = false

            player.position.x = 780
            player.position.y = 140

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/backgroundLevel3.png'
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
}

const overlay = {
    opacity: 0
}

function checkCollision(collisionLevel) {
    parsedCollisions = collisionLevel.parse2D();
    collisionBlocks = parsedCollisions.creatObjectsFrom2D()
    player.collisionBlocks = collisionBlocks
    pigs.forEach((pig) => {
        pig.collisionBlocks = collisionBlocks
    })

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


