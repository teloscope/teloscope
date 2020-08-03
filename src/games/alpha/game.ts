import { Entity, Game, Controllers, Controller, Kinetic, Events } from "entropi";
import { TaskManager } from "./task";
import * as matter from "matter-js";
import { PaperScope, Path, Color, Point, Size, Rectangle, Layer, PointText, Group } from "paper";
import { PaperRenderer } from "./renderer";
import { MatterPhysics, MatterBody, MatterControllers } from "./matter"

// Variables
const paper = new PaperScope();
const screen = new Size(800, 600);
let player: Entity;
const lastClicked: Matter.Vector = matter.Vector.create(-1, -1);
let followController: FollowController;
let carry: matter.Constraint = null;
let tm: TaskManager;
let worldBounds: Matter.Bounds;
const zones: Zone[] = [];
let score = 0;
let globalTimeLeft: number;
let gameMenu: Menu;
let startTimer = false;

window.onload = () => {

    paper.install(window);
    const paperCanvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
    paperCanvas.width = screen.width;
    paperCanvas.height = screen.height;
    document.body.appendChild(paperCanvas);
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
        renderer: new PaperRenderer(screen),
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

    globalTimeLeft = 120; // seconds

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
    startTimer = true;

    new PointText({
        content: "Tasks:",
        point: [screen.width - 220, 60],
        fontSize: 24,
    });

    const scoreText = new PointText({
        content: "Score: " + score.toString(),
        point: [screen.width - 220, 20],
        fontSize: 16,
    });

    const timerText = new PointText({
        content: toTimeString(globalTimeLeft),
        point: [screen.width - 120, 20],
        fontSize: 16,
    });

    gameMenu = {
        scoreText,
        timerText,
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
            const newTask = tm.create("square", 4, "C", 10, 60, 10, 1, matter.Vector.create(120, -200));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(15000, () => {
            const newTask = tm.create("pentagon", 2, "C", 17, 20, 10, 1, matter.Vector.create(160, -400));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(40000, () => {
            const newTask = tm.create("square", 2, "A", 37, 20, 5, 1, matter.Vector.create(0, 0));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(40000, () => {
            const newTask = tm.create("triangle", 6, "B", 37, 40, 30, 1, matter.Vector.create(160, -100));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(70000, () => {
            const newTask = tm.create("pentagon", 3, "D", 67, 30, 10, 1, matter.Vector.create(0, 0));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(83000, () => {
            const newTask = tm.create("triangle", 1, "A", 83, 15, 50, 1, matter.Vector.create(120, -200));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(90000, () => {
            const newTask = tm.create("square", 3, "C", 90, 30, 10, 1, matter.Vector.create(200, -300));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(100000, () => {
            const newTask = tm.create("hexagon", 3, "C", 100, 20, 5, 15, matter.Vector.create(150, -50));
            game.add.entities(newTask.shapes);
        })
    );

    game.add.event(
        Events.Timed.at(110000, () => {
            const newTask = tm.create("pentagon", 6, "D", 110, 10, 50, 1, matter.Vector.create(50, -400));
            game.add.entities(newTask.shapes);
        })
    );
}

function update(game: Game) {

    if (carry === null && matter.Vector.magnitude(matter.Vector.sub(followController.target, player.body.pos())) < 60) {
        const b = player.body as MatterBody
        let physics = game.physics as MatterPhysics
        // @ts-ignore - function is there in Matter library but not yet exported to typescript
        const collision = matter.Query.collides(b.interactionBody, matter.Composite.allBodies(physics.engine.world));
        if (collision.length > 1) {
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
                                        tm.finish(task);
                                        score += task.reward;
                                        gameMenu.scoreText.content = "Score: " + score.toString();
                                    } else {
                                        task.graphic.amountText.content = "Move " + task.amount.toString();
                                        console.log("Hello World")
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
    if (startTimer) {
        if (game.time.tick % 1000) {
            const seconds = game.time.seconds();
            const scoreChange = tm.update(seconds);
            if (scoreChange < 0 && carry !== null) {
                matter.Body.setDensity(carry.bodyB, 10);
                let physics = game.physics as MatterPhysics
                matter.Composite.remove(physics.engine.world, carry);
                carry = null;
            }
            score += scoreChange;
            gameMenu.scoreText.content = "Score: " + score.toString();
            gameMenu.timerText.content = "Time: " + toTimeString(globalTimeLeft - seconds);
        }

        if (globalTimeLeft - game.time.seconds() < 0) {
            game.stop();
            setTimeout(() => {
                window.location.href = '/dev/alpha/end';
            }, 300)
        }
    } else {
        game.time.tick--;
    }
}

export type Menu = {
    scoreText: paper.PointText;
    timerText: paper.PointText;
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
        this.rectangle.fillColor = new Color("#cfcfcf");
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
