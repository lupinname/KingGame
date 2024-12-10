window.addEventListener('keydown', (event) => {
    if (player.preventInput) return
    switch (event.key) {
        case 'f':
            keys.f.pressed = true;
            player.isAttack = true;
            break
        case 'w':
            // check door colision to entry
            for (let i = 0; i < doors.length; i++) {
                const door = doors[i]

                if (player.hitbox.position.x + player.hitbox.width <= door.position.x + door.width &&
                    player.hitbox.position.x >= door.position.x &&
                    player.hitbox.position.y + player.hitbox.height >= door.position.y &&
                    player.hitbox.position.y <= door.position.y + door.height
                ) {
                    player.velocity.x = 0
                    player.velocity.y = 0
                    player.preventInput = true
                    player.switchSprite('enterDoor')
                    door.play()
                    return
                }
            }

            if (player.velocity.y === 0) player.velocity.y = -10
            break
        case 'a':
            keys.a.pressed = true;
            break
        case 'd':
            keys.d.pressed = true;
            break
        case 'k':
            keys.k.pressed = true;
            console.log('click')
            break
    }
})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false;
            break
        case 'd':
            keys.d.pressed = false;
            break
        case 'f':
            player.isAttack = false;
            keys.f.pressed = false;
            
            break
        case 'k':
            keys.k.pressed = false;
            break
    }
})
