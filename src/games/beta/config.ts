import { Color, Size } from 'paper'

export const config = {

    screen: new Size(800, 640),
    completionTime: 5 * 60, //seconds
    panel: new Size(500, 500),

    // Color Scheme
    color: {
        warning: new Color('red'),
        horizontalColour: new Color('green'),
        verticalColour: new Color('blue'),
        keyColour: new Color('black'),
        background: new Color(0.9, 0.9, 0.9, 1),
        symbol: new Color(0.3, 0.3, 0.3, 1)
    },
    
    block: {
        size: 60,
        padding: 10,
        fillet: new Size(5,5)
    },
    
    dataUrl: "/dev/beta/game",
    
    endUrl: "/dev/beta/review",

}