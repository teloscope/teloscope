import { Entity, Game, Kinetic, } from "entropi";
import { TaskManager } from "./task";
import * as matter from "matter-js";
import { PaperScope, Path, Color, Point, Size, PointText } from "paper";
import { PaperRenderer } from "./renderer";
import { FollowController, Zone, toTimeString, Menu } from "./game"
import { MatterPhysics, MatterBody, MatterControllers } from "./matter"

// Variables
const paper = new PaperScope();
const screen = new Size(800, 600);
let player: Entity;
const lastClicked: Matter.Vector = matter.Vector.create(-1, -1);
let followController: FollowController;
let carry: Matter.Constraint = null;
let tm: TaskManager;
let worldBounds: Matter.Bounds;
const zones: Zone[] = [];
let score = 0;
let globalTimeLeft: number;
let gameMenu: Menu;
let startTimer = false;

window.onload = () => {

    paper.install(window);
    const paperCanvas = <HTMLCanvasElement> document.getElementById("instructionsCanvas");
    paperCanvas.width = screen.width;
    paperCanvas.height = screen.height;
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
        usingBody: new MatterBody(matter.Bodies.circle(center.x, center.y, 20, { density: 0.1 }), matter.Bodies.circle(100, -100, 30)),
        fromSprite: playerSprite,
        withControllers: [followController, MatterControllers.boundary(worldBounds)],
        withDynamicSystem: Kinetic.create({
            maxSpeed: 5,
            proportionalGain: 0.007,
        }),
    });

    const instructionsText = new PointText({
        content: "Use the mouse to click and move the player.",
        point: [screen.width / 2 - 280, 200],
        fontSize: 16,
    });

    const firstTimer = setInterval(() => {
        if (followController.target.x !== -1 && followController.target.y !== -1) {
            instructionsText.content = "Run into objects to pick them up.";
            instructionsText.position.x += 60;
            let timeNow = game.time.seconds()
            const newTask = tm.create("square", 1, "A", timeNow + 4, 200, 1, 1, matter.Vector.create(center.x + 200, center.y));
            game.add.entities(newTask.shapes);
            clearInterval(firstTimer);
        }
    }, 30);

    const secondTimer = setInterval(() => {
        if (carry !== null) {
            instructionsText.content = "Tasks are shown on the right. For each task there is ";
            instructionsText.position.x -= 60;
            const instructionsText2 = new PointText({
                content: "- a time, the seconds left to complete the task",
                point: [screen.width / 2 - 280, 230],
                fontSize: 16,
            });
            const instructionsText3 = new PointText({
                content: "- a reward, what you earn when you complete the task",
                point: [screen.width / 2 - 280, 260],
                fontSize: 16,
            });
            const instructionsText4 = new PointText({
                content: "- a punishment, what you lose if you don't complete the task",
                point: [screen.width / 2 - 280, 290],
                fontSize: 16,
            });
            clearInterval(secondTimer);
            setTimeout(() => {
                instructionsText.content = "Finish a task by moving the shapes to the allotted zone.";
                instructionsText.position.x -= 20;
                instructionsText2.remove();
                instructionsText3.remove();
                instructionsText4.remove();
                zones.forEach((zone) => {
                    zone.show();
                });
            }, 7000);
            const thirdTimer = setInterval(() => {
                if (tm.tasks.length === 0) {
                    instructionsText.content = "Congratulations, you're set to go. Here's a few extra tips before you begin.";
                    instructionsText.position.x -= 60
                    const instructionsText4 = new PointText({
                        content: "The tasks are simple and you can do them in any order",
                        point: [screen.width / 2 - 300, 260],
                        fontSize: 16,
                    });
                    const instructionsText5 = new PointText({
                        content: "You won't be able to complete all tasks",
                        point: [screen.width / 2 - 240, 290],
                        fontSize: 16,
                    });
                    clearInterval(thirdTimer);
                }
            }, 30);
        }
    }, 30);

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

    gameMenu = {
        scoreText,
    };
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
    if (game.time.tick % 1000) {
        const seconds = game.time.seconds();
        let physics = game.physics as MatterPhysics
        const scoreChange = tm.update(seconds, carry, physics);
        score += scoreChange;
        gameMenu.scoreText.content = "Score: " + score.toString();
    }

}