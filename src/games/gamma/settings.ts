import { Color, Size } from 'paper'

export namespace Settings {

    export const screen = new Size(800, 640)
    
    export const actionBarHeight = 100
    
    // Color Scheme
    export const color = {
        inputNode: new Color('#f56c5d'),
        intermediateNode: new Color('#81ed47'),
        goalNode: new Color('#78d0ff'),
        token: new Color('black'),
        symbol: new Color(0.3, 0.3, 0.3, 1)
    }
    
    export const block = {
        size: 60,
        padding: 10,
        fillet: new Size(5,5)
    }


}