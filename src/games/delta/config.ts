import { Color, Size } from 'paper'

export const config = {

    screen: new Size(800, 600),
    unitSize: new Size(40, 40),

    color: {
        black: new Color('black'),
        green: new Color('green'),
        red: new Color('red'),
        yellow: new Color('yellow'),
        blue: new Color('blue'),
    },
    
    //movement
    margin: 200,
    force: 0.004,
    
    // for sending game data
    server: "/dev/delta/game"

}