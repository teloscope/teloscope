import { Color, Size } from 'paper'

export namespace Settings {

    export const screen = new Size(800, 640)
    
    export let completionTime = 5 * 60; //seconds

    // Color Scheme
    export const color = {
        warning: new Color('red'),
        horizontalColour: new Color('green'),
        verticalColour: new Color('blue'),
        keyColour: new Color('black'),
        background: new Color(0.9, 0.9, 0.9, 1),
        symbol: new Color(0.3, 0.3, 0.3, 1)
    }
    
    export const block = {
        size: 60,
        padding: 10,
        fillet: new Size(5,5)
    }


}