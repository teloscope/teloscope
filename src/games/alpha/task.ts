import { Entity, Area } from 'entropi';
import { Bodies, Vector, Bounds, Composite, Body } from "matter-js";
import { Path, Color, Point, Size, Rectangle, PointText, Group } from 'paper';
import { MatterBody, MatterControllers, MatterPhysics } from './matter'


const taskBoxSize = new Size(200, 80)
const taskBoxFillet = new Size(5, 5)
let idCounter = 2;

export class TaskManager {
    tasks: Task[] = [];
    width: number
    height: number
    paperRef: paper.PaperScope
    started: boolean = false
    counter = 0;

    constructor(screen: Area, public worldBounds: Bounds, paper: paper.PaperScope) {
        this.width = screen.width;
        this.height = screen.height;
        this.worldBounds = worldBounds
        this.paperRef = paper;
    }

    create(shape: string, amount: number, zone: string, startTime: number, duration: number, reward: number,
        punishment: number, position: Vector): Task {
        this.counter++
        const newTask: Task = {
            id: this.counter,
            shape,
            amount,
            zone,
            startTime,
            duration,
            reward,
            punishment,
            graphic: null,
            shapes: null,
        };


        const length = this.tasks.length;
        const boxPosition = new Point(this.width - 220, length * 100 + 90)
        const rectangle = new Rectangle(boxPosition, taskBoxSize) 
        const box = new Path.Rectangle(rectangle, taskBoxFillet)
        box.fillColor = new Color("#e3e3e3")
    
        const amountText = new PointText({
            content: "Move " + amount.toString(), 
            point: [boxPosition.x + 23, boxPosition.y + 30],
            fontSize: 16,
        });

        const shapeGraphic = new Path.RegularPolygon(new Point(boxPosition.x + 89, boxPosition.y + 24), shapeToSides(shape), 9)
        shapeGraphic.fillColor = new Color('black')


        const zoneText = new PointText({
            content: "to " + zone, 
            point: [boxPosition.x + 103, boxPosition.y + 30],
            fontSize: 16,
        });

        const timeIcon = new Path.Circle(new Point(boxPosition.x + 30, boxPosition.y + 55), 7)
        timeIcon.strokeColor = new Color('black')
        timeIcon.strokeWidth = 1;
        const timeIcon2 = new Path([new Point(boxPosition.x + 30, boxPosition.y + 50), 
            new Point(boxPosition.x + 30, boxPosition.y + 56), new Point(boxPosition.x + 34, boxPosition.y + 52)])
        timeIcon2.strokeColor = new Color('black')
        timeIcon2.strokeWidth = 1;



        const timeText = new PointText({
            content: newTask.duration.toString(),
            point: [boxPosition.x + 45, boxPosition.y + 59],
            fontSize: 12,
        });

        const arrowUp = new Path([new Point(boxPosition.x + 74, boxPosition.y + 55), 
            new Point(boxPosition.x + 80, boxPosition.y + 48), new Point(boxPosition.x + 86, boxPosition.y + 55),
            new Point(boxPosition.x + 80, boxPosition.y + 48), new Point(boxPosition.x + 80, boxPosition.y + 62)])
        arrowUp.strokeColor = new Color('black')
        arrowUp.strokeWidth = 1;

        const arrowDown = arrowUp.clone()
        arrowDown.position = new Point(boxPosition.x + 128, boxPosition.y + 54)
        arrowDown.rotation += 180

        const rewardText = new PointText({
            content: newTask.reward.toString(),
            point: [boxPosition.x + 98, boxPosition.y + 59],
            fontSize: 12,
        });

        const punishmentText = new PointText({
            content: newTask.punishment.toString(),
            point: [boxPosition.x + 145, boxPosition.y + 59],
            fontSize: 12,
        });

        const graphic = new Group([box, amountText, timeIcon, timeIcon2, timeText, arrowUp, arrowDown, shapeGraphic, zoneText, rewardText, punishmentText])

        const taskGraphic: TaskGraphic = {
            graphic,
            amountText,
            timeText,
            shapeGraphic,
            zoneText,
            rewardText,
            punishmentText
        }

    
        newTask.graphic = taskGraphic;
        newTask.shapes = this.createShapes(shape, shapeToSides(shape), amount, position, zone)
        this.tasks.push(newTask);
        return newTask
    }

    update(time: number, carry: Matter.Constraint, physics: MatterPhysics): number {
        let score = 0;
        console.log(time)
        this.tasks.forEach(task => {
            if (task.graphic !== null ) {
                if (task.startTime + task.duration === time) {
                    this.finish(task)
                    score -= task.punishment
                    if (carry !== null && carry.bodyB.label.substring(0, 1) === task.shape.substring(0, 1)) {
                        Body.setDensity(carry.bodyB, 10);
                        Composite.remove(physics.engine.world, carry);
                        carry = null
                    }
                } else if (task.startTime === time) {
                    task.shapes.forEach(shape => {
                        let b = shape.body as MatterBody
                        b.body.collisionFilter.group = 0
                        let s = shape.sprite as paper.Path
                        s.fillColor = new Color('black')
                        if (task.zone == 'A'){
                            s.strokeColor = new Color('#ff0000')
                        }
                        else if (task.zone == 'B'){
                            s.strokeColor = new Color('#ffee00')
                        }
                        else if (task.zone == 'C'){
                            s.strokeColor = new Color('#0015ff')
                        }
                        else{
                            s.strokeColor = new Color('#1eff00')
                        }
                    })
                    if (task.zone == 'A'){
                        task.graphic.graphic.children[0].fillColor = new Color('#ff0000')
                    }
                    else if (task.zone == 'B'){
                        task.graphic.graphic.children[0].fillColor = new Color('#ffee00')
                    }
                    else if (task.zone == 'C'){
                        task.graphic.graphic.children[0].fillColor = new Color('#0015ff')
                    }
                    else { 
                        task.graphic.graphic.children[0].fillColor = new Color('#1eff00')
                    }
                    
                    
                } else if (task.startTime <= time) {

                    const timeLeft = task.duration - (time - task.startTime);
                    task.graphic.timeText.content = timeLeft.toString();
                }
            }
        })
        return score
    }

    finish(task: Task): void {
        task.graphic.graphic.remove();
        task.graphic = null;
        task.shapes.forEach(shape => {
            shape.destroy()
        })
        let deleteIdx = this.tasks.length;
        for (let idx = 0; idx < this.tasks.length; idx++) {
            if (this.tasks[idx].graphic === null) {
                deleteIdx = idx
            }
            if (idx > deleteIdx) {
                this.tasks[idx].graphic.graphic.position.y -= 100
            }
        }
        this.tasks.splice(deleteIdx, 1)
    }

    createShapes(name: string, sides: number, amount: number, position: Vector, zone: string): Entity[] {
        const entities: Entity[] = [];
        const sqrt = Math.ceil(Math.sqrt(amount))
        for (let i = 0; i < sqrt; i++) {
            for (let j = 0; j < sqrt; j++) {
                const id = i * sqrt + j
                if (id < amount) {
                    const body = Bodies.polygon(position.x + (i * 40), position.y - (j * 40), sides, 20, 
                        {frictionAir: 0.2, density: 10, label: name + id.toString() , id: idCounter})
                    body.collisionFilter.group = -2
                    body.collisionFilter.mask =  0
                    body.collisionFilter.category = 0
                    idCounter++; 
                    const entityName = name + id.toString()
                    const shapeSprite: paper.Path = new Path.RegularPolygon(new Point(position.x + (i * 40), -position.y - (j * 40)), sides, 20)
                    shapeSprite.fillColor = new Color(0.9,0.9,0.9)
                    shapeSprite.strokeWidth = 3

                    entities.push(new Entity({
                        name: entityName,
                        usingBody: new MatterBody(body),
                        fromSprite: shapeSprite,
                        withControllers: [
                            MatterControllers.boundary(this.worldBounds)
                        ]
                    }))


                }
            }
        }
        return entities
    }


}

type Task = {
    id: number,
    shape: string,
    amount: number,
    zone: string,
    startTime: number,
    duration: number,
    reward: number,
    punishment: number,
    graphic: TaskGraphic,
    shapes: Entity[],
}

type TaskGraphic = {
    graphic: paper.Group,
    amountText: paper.PointText,
    timeText: paper.PointText,
    shapeGraphic: paper.Path,
    zoneText: paper.PointText,
    rewardText: paper.PointText,
    punishmentText: paper.PointText
}

function shapeToSides(shape: string): number {
    switch (shape) {
        case "triangle": return 3;
        case "square": return 4;
        case "pentagon": return 5;
        case "hexagon": return 6;
    }
}