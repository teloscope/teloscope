import { Color, Size } from 'paper'

export const config = {

    screen: new Size(800, 640),
    
    actionBarHeight: 100,
    
    // Color Scheme
    color: {
        inputNode: new Color('#f56c5d'),
        intermediateNode: new Color('#81ed47'),
        goalNode: new Color('#78d0ff'),
        token: new Color('black'),
        symbol: new Color(0.3, 0.3, 0.3, 1)
    },
    
    block: {
        size: 60,
        padding: 10,
        fillet: new Size(5,5)
    },
    
    dataURL: "/dev/gamma/game",
    
    endURL: "/dev/gamma/review",

}