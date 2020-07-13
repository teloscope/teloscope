import { Color, Size } from 'paper'

export const config = {

    screen: new Size(800, 600),
    unitSize: new Size(40, 40),

    color: {
        wall: new Color('black'),
        gate: new Color('green'),
        red: new Color('red'),
        yellow: new Color('yellow')
    },
    
    //movement
    margin: 200,
    force: 0.004,

}