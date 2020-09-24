import { Entity, Game, Controllers, Controller, Kinetic, Events } from "entropi";
import { TaskManager } from "./task";
import * as matter from "matter-js";
import { PaperScope, Path, Color, Point, Size, Rectangle, Layer, PointText, Group } from "paper";
import { PaperRenderer } from "./renderer";
import { MatterPhysics, MatterBody, MatterControllers } from "./matter"
import { config } from "./config";
import { GameData, NewData } from "./data"
import axios from 'axios'

// Variables
const paper = new PaperScope();
let player: Entity;
const lastClicked: Matter.Vector = matter.Vector.create(-1, -1);
let followController: FollowController;
let carry: matter.Constraint = null;
let tm: TaskManager;
let worldBounds: Matter.Bounds;
const zones: Zone[] = [];
let score = 0;
let gameMenu: Menu;
let gameData: GameData = NewData();


window.onload = () => {

    paper.install(window);
    const paperCanvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
    paperCanvas.width = config.screen.width;
    paperCanvas.height = config.screen.height;
    paper.setup(paperCanvas);

    followController = new FollowController(lastClicked);

    paperCanvas.addEventListener("click", (e) => {
        followController.target = matter.Vector.create(
            e.clientX - paperCanvas.getBoundingClientRect().left,
            -(e.clientY - paperCanvas.getBoundingClientRect().top)
        );
    });

    new Game({
        create,
        update,
        physics: new MatterPhysics(),
        renderer: new PaperRenderer(config.screen),
        options: [Game.withFrameRate(30), Game.withBackGroundColor(0xffffff)],
    });
};

function create(game: Game) {
    let physics = game.physics as MatterPhysics
    matter.Events.on(physics.engine, 'afterUpdate', () => {
        game.entities.forEach(entity => {
            const b = entity.body as MatterBody
            if (b.interactionBody !== null) {
                matter.Body.setPosition(b.interactionBody, b.body.position)
            }
        })
    })

    worldBounds = matter.Bounds.create([
        matter.Vector.create(20, -game.screen.height + 20),
        matter.Vector.create(game.screen.width - 260, -20),
    ]);

    tm = new TaskManager(game.screen, worldBounds, paper);

    const center = matter.Vector.div(matter.Vector.add(worldBounds.min, worldBounds.max), 2);

    game.input.Key.ENTER.style = 1;
    game.input.Key.SPACE.style = 1;

    zones.push(new Zone("A", matter.Vector.create(20, 20)));
    zones.push(new Zone("B", matter.Vector.create(game.screen.width - 340, 20)));
    zones.push(new Zone("C", matter.Vector.create(20, game.screen.height - 120)));
    zones.push(new Zone("D", matter.Vector.create(game.screen.width - 340, game.screen.height - 120)));

    const playerSprite = new Path.Circle(new Point(center.x, center.y), 20);
    playerSprite.fillColor = new Color("black");

    player = game.add.newEntity({
        name: "player",
        usingBody: new MatterBody(matter.Bodies.circle(center.x, center.y, 20, { density: 0.1, label: "player", id: 1 }), 
            matter.Bodies.circle(100, -100, 30)),
        fromSprite: playerSprite,
        withControllers: [followController, MatterControllers.boundary(worldBounds)],
        withDynamicSystem: Kinetic.create({
            maxSpeed: 5,
            proportionalGain: 0.007,
        }),
    });

    
    zones.forEach((zone) => {
        zone.show();
    });

    setEvents(game);

    new PointText({
        content: "Tasks:",
        point: [config.screen.width - 220, 60],
        fontSize: 24,
    });

    const scoreText = new PointText({
        content: "Score: " + score.toString(),
        point: [config.screen.width - 220, 20],
        fontSize: 16,
    });

    gameMenu = {
        scoreText,
    };
}

function setEvents(game: Game) {
    game.add.event(
        Events.Timed.at(1000, () => {
            const newTask = tm.create("hexagon", 1, "D", 6, 20, 1, 1, matter.Vector.create(420, -360));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(10000, () => {
            const newTask = tm.create("square", 4, "C", 15, 60, 10, 1, matter.Vector.create(120, -200));
            game.add.entities(newTask.shapes); 
        })
    );

    game.add.event(
        Events.Timed.at(15000, () => {
            const newTask = tm.create("pentagon", 2, "C", 20, 20, 10, 1, matter.Vector.create(160, -400));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(45000, () => {
            const newTask = tm.create("square", 5, "A", 50, 40, 30, 1, matter.Vector.create(360, -30));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(45000, () => {
            const newTask = tm.create("triangle", 2, "B", 50, 20, 15, 1, matter.Vector.create(280, -300));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(95000, () => {
            const newTask = tm.create("pentagon", 3, "D", 95, 35, 10, 10, matter.Vector.create(310, -120));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(95000, () => {
            const newTask = tm.create("triangle", 3, "A", 95, 35, 15, 1, matter.Vector.create(120, -200));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(95000, () => {
            const newTask = tm.create("square", 1, "C", 105, 10, 50, 1, matter.Vector.create(50, -300));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(140000, () => {
            const newTask = tm.create("hexagon", 2, "C", 150, 20, 5, 1, matter.Vector.create(190, -50));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(140000, () => {
            const newTask = tm.create("pentagon", 2, "D", 150, 40, 10, 1, matter.Vector.create(50, -200));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(140000, () => {
            const newTask = tm.create("pentagon", 6, "A", 150, 40, 30, 1, matter.Vector.create(150, -400));
            game.add.entities(newTask.shapes);
        })
    );


    game.add.event(
        Events.Timed.at(200000, () => {
            const newTask = tm.create("triangle", 3, "C", 205, 40, 15, 1, matter.Vector.create(120, -200));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(200000, () => {
            const newTask = tm.create("square", 3, "A", 205, 40, 15, 1, matter.Vector.create(190, -400));
            game.add.entities(newTask.shapes);
        })
    ); 

    game.add.event(
        Events.Timed.at(250000, () => {
            const newTask = tm.create("triangle", 2, "C", 265, 15, 15, 1, matter.Vector.create(250, -100));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(250000, () => {
            const newTask = tm.create("pentagon", 2, "A", 265, 15, 15, 1, matter.Vector.create(100, -50));
            game.add.entities(newTask.shapes);
        })
    ); 


    game.add.event(
        Events.Timed.at(280000, () => {
            game.stop()
            gameData.finalScore = score;
            console.log(score)
            axios.post(config.dataURL, gameData)
            setTimeout(() => {
                window.location.href = config.endURL;
            }, 300)
        })
    );
}

function update(game: Game) {

    if (carry === null && matter.Vector.magnitude(matter.Vector.sub(followController.target, player.body.pos())) < 60)  {
        const b = player.body as MatterBody
        let physics = game.physics as MatterPhysics
        // @ts-ignore - function is there in Matter library but not yet exported to typescript
        const collision = matter.Query.collides(b.interactionBody, matter.Composite.allBodies(physics.engine.world));
        if (collision.length > 1 &&  collision[1].bodyB.collisionFilter.group == 0) {
            console.log("attaching");
            matter.Body.setDensity(collision[1].bodyB, 0.01);
            carry = matter.Constraint.create({ bodyA: b.body, bodyB: collision[1].bodyB, stiffness: 1, length: 35 });
            matter.Composite.add(physics.engine.world, carry);
            followController.target = matter.Vector.create(-1, -1);
            matter.Body.setVelocity(b.body, matter.Vector.div(b.body.velocity, 3))
        }
    } else if (carry !== null) {
        let physics = game.physics as MatterPhysics
        if (game.input.Key.ENTER.state || game.input.Key.SPACE.state) {
            console.log("detaching");
            matter.Body.setDensity(carry.bodyB, 10);
            matter.Composite.remove(physics.engine.world, carry);
            carry = null;
        } else {
            outerLoop: for (let taskIdx = 0; taskIdx < tm.tasks.length; taskIdx++) {
                const task = tm.tasks[taskIdx];
                console.log(carry.bodyB.label)
                if (carry.bodyB.label.substring(0, 1) === task.shape.substring(0, 1)) {
                    for (let zoneIdx = 0; zoneIdx < zones.length; zoneIdx++) {
                        const zone = zones[zoneIdx];
                        if (matter.Bounds.overlaps(carry.bodyB.bounds, zone.bounds) && task.zone === zone.name) {
                            console.log("overlap");
                            console.log("detaching");
                            for (let shapeIdx = 0; shapeIdx < task.shapes.length; shapeIdx++) {
                                const shape = task.shapes[shapeIdx];
                                console.log(shape.name)
                                if (shape.name === carry.bodyB.label) {
                                    task.amount -= 1;
                                    console.log(task.amount);
                                    if (task.amount == 0) {
                                        console.log("finished task");
                                        gameData.tasksCompleted.push(task.id)
                                        tm.finish(task);
                                        score += task.reward;
                                        gameMenu.scoreText.content = "Score: " + score.toString();
                                    } else {
                                        task.graphic.amountText.content = "Move " + task.amount.toString();
                                        shape.destroy();
                                    }
                                    shapeIdx = task.shapes.length;
                                }
                            }
                            matter.Body.setDensity(carry.bodyB, 10);
                            matter.Composite.remove(physics.engine.world, carry);
                            carry = null;
                            break outerLoop;
                        }
                    }
                }
            }
        }
    }

    // update task status
    if (game.time.tick % 1000) {
        const seconds = game.time.seconds();
        let physics = game.physics as MatterPhysics
        const scoreChange = tm.update(seconds, carry, physics);
        score += scoreChange;
        gameMenu.scoreText.content = "Score: " + score.toString();
    }
}

export type Menu = {
    scoreText: paper.PointText;
};

export function toTimeString(time: number): string {
    if (time <= 0) {
        return "0:00";
    }
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds === 0) {
        return minutes + ":00";
    }
    if (seconds < 10) {
        return minutes + ":0" + seconds;
    }
    return minutes + ":" + seconds;
}

export class FollowController implements Controller {
    lastVelocity: matter.Vector = null;
    func: (entity: any) => void;

    constructor(public target: matter.Vector) {
        this.target = target;
        this.func = (entity: Entity) => {
            if (this.target.x === -1 && this.target.y === -1) {
                return;
            }
            if (this.target === null || entity.kinetic === null) {
                return;
            }
            const b = entity.body as MatterBody
            const diff = matter.Vector.sub(this.target, b.body.position);
            const desiredVelocity = matter.Vector.mult(matter.Vector.normalise(diff), entity.kinetic.maxSpeed);
            const velocityDiff = matter.Vector.sub(desiredVelocity, b.body.velocity);
            if (matter.Vector.magnitude(diff) < 5) {
                matter.Body.setVelocity(b.body, matter.Vector.create());
            } else {
                matter.Body.applyForce(b.body, b.body.position, matter.Vector.mult(velocityDiff, entity.kinetic.proportionalGain));
            }
            this.lastVelocity = velocityDiff;
        };
    }

    execute(entity: any): void {
        this.func(entity);
    }
}

const zoneSize = new Size(100, 100);
const zoneFillet = new Size(5, 5);

export class Zone {
    name: string;
    rectangle: paper.Path;
    text: paper.PointText;
    bounds: Matter.Bounds;

    constructor(name: string, pos: Matter.Vector) {
        this.name = name;
        const rectangle = new Rectangle(new Point(pos.x, pos.y), zoneSize);
        this.rectangle = new Path.Rectangle(rectangle, zoneFillet);
//        this.rectangle.fillColor = new Color("#cfcfcf");
        if (name == 'A'){
            this.rectangle.fillColor = new Color('#ff0000')
        }
        else if (name == 'B'){
            this.rectangle.fillColor = new Color('#ffee00')
        }
        else if (name == 'C'){
            this.rectangle.fillColor = new Color('#0015ff')
        }
        else{
            this.rectangle.fillColor = new Color('#1eff00')
        }

        this.rectangle.visible = false;
        this.text = new PointText({
            point: [pos.x + zoneSize.width / 2 - 10, pos.y + zoneSize.height / 2 + 10],
            content: name,
            fontSize: 24,
            visible: false,
        });
        this.bounds = matter.Bounds.create([
            matter.Vector.create(pos.x, -pos.y),
            matter.Vector.create(pos.x + zoneSize.width, -(pos.y + zoneSize.height)),
        ]);
    }

    show(): void {
        this.text.visible = true;
        this.rectangle.visible = true;
    }
}
