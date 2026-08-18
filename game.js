const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let W, H;

function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

let gameRunning = false;

let score = 0;
let lives = 3;
let collectedKeys = 0;

const player = {
    x: 70,
    y: 100,
    size: 48,
    speed: 4
};

const keys = [
    {x: 170, y: 180, collected:false},
    {x: 330, y: 430, collected:false},
    {x: 650, y: 170, collected:false}
];

const ghosts = [
    {x: 480, y: 250, size:42, speed:1.1},
    {x: 720, y: 430, size:42, speed:1.3}
];

const exitDoor = {
    x: 0,
    y: 0,
    width:70,
    height:100
};

let direction = {
    left:false,
    right:false,
    up:false,
    down:false
};

function startGame(){

    score = 0;
    lives = 3;
    collectedKeys = 0;

    player.x = 70;
    player.y = 100;

    keys.forEach(k => k.collected = false);

    document.getElementById("score").textContent = score;
    document.getElementById("keys").textContent = collectedKeys;
    document.getElementById("lives").textContent = lives;

    document.getElementById("message").style.display = "none";

    gameRunning = true;
}

function drawBackground(){

    ctx.fillStyle = "#17151d";
    ctx.fillRect(0,0,W,H);

    /* paper floor */

    ctx.fillStyle = "#25212b";
    ctx.fillRect(20,70,W-40,H-120);

    /* paper tiles */

    ctx.strokeStyle = "#3c3542";
    ctx.lineWidth = 2;

    for(let x=20;x<W-40;x+=70){
        ctx.beginPath();
        ctx.moveTo(x,70);
        ctx.lineTo(x,H-50);
        ctx.stroke();
    }

    for(let y=70;y<H-50;y+=70){
        ctx.beginPath();
        ctx.moveTo(20,y);
        ctx.lineTo(W-20,y);
        ctx.stroke();
    }

    /* school windows */

    for(let x=80;x<W;x+=190){

        ctx.fillStyle="#10131c";
        ctx.fillRect(x,85,70,55);

        ctx.strokeStyle="#d8c99c";
        ctx.strokeRect(x,85,70,55);

        ctx.beginPath();
        ctx.moveTo(x+35,85);
        ctx.lineTo(x+35,140);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x,112);
        ctx.lineTo(x+70,112);
        ctx.stroke();
    }

    /* exit */

    exitDoor.x = W-90;
    exitDoor.y = H-170;

    ctx.fillStyle = collectedKeys >= 3 ? "#6f9b72" : "#553e48";

    ctx.fillRect(
        exitDoor.x,
        exitDoor.y,
        exitDoor.width,
        exitDoor.height
    );

    ctx.strokeStyle="#eee2bd";
    ctx.lineWidth=4;

    ctx.strokeRect(
        exitDoor.x,
        exitDoor.y,
        exitDoor.width,
        exitDoor.height
    );

    ctx.font="28px Arial";
    ctx.textAlign="center";

    ctx.fillText(
        collectedKeys >= 3 ? "🚪" : "🔒",
        exitDoor.x+35,
        exitDoor.y+58
    );

    ctx.font="12px Arial";
    ctx.fillStyle="white";

    ctx.fillText(
        collectedKeys >= 3 ? "EXIT" : "LOCKED",
        exitDoor.x+35,
        exitDoor.y+82
    );
}

function drawLumi(){

    const x = player.x;
    const y = player.y;

    /*
      Paper Lumi:
      paper head + paper hair + paper dress
    */

    /* shadow */

    ctx.fillStyle="rgba(0,0,0,.4)";
    ctx.beginPath();
    ctx.ellipse(
        x+24,
        y+49,
        25,
        8,
        0,
        0,
        Math.PI*2
    );
    ctx.fill();

    /* paper dress */

    ctx.fillStyle="#f8f1dc";
    ctx.strokeStyle="#302b31";
    ctx.lineWidth=3;

    ctx.beginPath();
    ctx.moveTo(x+10,y+26);
    ctx.lineTo(x+38,y+26);
    ctx.lineTo(x+46,y+55);
    ctx.lineTo(x+2,y+55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    /* paper head */

    ctx.fillStyle="#fffaf0";

    ctx.beginPath();
    ctx.arc(
        x+24,
        y+19,
        17,
        0,
        Math.PI*2
    );

    ctx.fill();
    ctx.stroke();

    /* paper hair */

    ctx.fillStyle="#d8c4a4";

    ctx.beginPath();
    ctx.arc(
        x+24,
        y+10,
        18,
        Math.PI,
        Math.PI*2
    );

    ctx.fill();
    ctx.stroke();

    /* notebook-paper hat */

    ctx.fillStyle="#fffdf5";

    ctx.beginPath();
    ctx.moveTo(x+5,y+1);
    ctx.lineTo(x+42,y+1);
    ctx.lineTo(x+37,y-9);
    ctx.lineTo(x+9,y-9);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    /* face */

    ctx.fillStyle="#222";

    ctx.beginPath();
    ctx.arc(x+18,y+19,2,0,Math.PI*2);
    ctx.arc(x+30,y+19,2,0,Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
        x+24,
        y+25,
        5,
        0,
        Math.PI
    );

    ctx.stroke();

    /* paper lines */

    ctx.strokeStyle="#c9bda5";
    ctx.lineWidth=1;

    for(let i=0;i<3;i++){

        ctx.beginPath();

        ctx.moveTo(
            x+8,
            y+34+i*6
        );

        ctx.lineTo(
            x+39,
            y+34+i*6
        );

        ctx.stroke();
    }
}

function drawKeys(){

    keys.forEach(key=>{

        if(key.collected) return;

        ctx.font="32px Arial";
        ctx.textAlign="center";

        ctx.fillText(
            "🔑",
            key.x,
            key.y
        );
    });
}

function drawGhosts(){

    ghosts.forEach(ghost=>{

        ctx.font=ghost.size+"px Arial";
        ctx.textAlign="center";

        ctx.fillText(
            "👻",
            ghost.x,
            ghost.y
        );
    });
}

function distance(a,b){

    return Math.sqrt(
        Math.pow(a.x-b.x,2)+
        Math.pow(a.y-b.y,2)
    );
}

function updatePlayer(){

    if(direction.left)
        player.x -= player.speed;

    if(direction.right)
        player.x += player.speed;

    if(direction.up)
        player.y -= player.speed;

    if(direction.down)
        player.y += player.speed;

    player.x = Math.max(
        30,
        Math.min(
            W-70,
            player.x
        )
    );

    player.y = Math.max(
        100,
        Math.min(
            H-130,
            player.y
        )
    );
}

function updateKeys(){

    keys.forEach(key=>{

        if(key.collected) return;

        const d = distance(
            {
                x:player.x+24,
                y:player.y+25
            },
            key
        );

        if(d < 45){

            key.collected = true;
            collectedKeys++;
            score += 100;

            document.getElementById("keys")
                .textContent = collectedKeys;

            document.getElementById("score")
                .textContent = score;
        }
    });
}

function updateGhosts(){

    ghosts.forEach(ghost=>{

        const dx =
            player.x - ghost.x;

        const dy =
            player.y - ghost.y;

        const d =
            Math.sqrt(dx*dx+dy*dy);

        if(d > 1){

            ghost.x +=
                (dx/d) *
                ghost.speed;

            ghost.y +=
                (dy/d) *
                ghost.speed;
        }

        if(d < 42){

            lives--;

            document.getElementById("lives")
                .textContent = lives;

            player.x = 70;
            player.y = 100;

            if(lives <= 0){
                gameOver();
            }
        }
    });
}

function checkExit(){

    if(collectedKeys < 3) return;

    if(
        player.x < exitDoor.x + exitDoor.width &&
        player.x + player.size > exitDoor.x &&
        player.y < exitDoor.y + exitDoor.height &&
        player.y + player.size > exitDoor.y
    ){

        gameRunning = false;

        document.getElementById("message")
            .style.display = "flex";

        document.querySelector("#message .panel")
            .innerHTML = `
                <h1>🎉 Level Complete!</h1>
                <p>
                Lumi escaped the haunted paper school!<br>
                ⭐ Score: ${score}
                </p>
                <button onclick="startGame()">
                PLAY AGAIN
                </button>
            `;
    }
}

function gameOver(){

    gameRunning = false;

    document.getElementById("message")
        .style.display = "flex";

    document.querySelector("#message .panel")
        .innerHTML = `
            <h1>👻 Game Over!</h1>
            <p>
            The paper ghosts caught Lumi!<br>
            ⭐ Score: ${score}
            </p>
            <button onclick="startGame()">
            TRY AGAIN
            </button>
        `;
}

function gameLoop(){

    ctx.clearRect(
        0,
        0,
        W,
        H
    );

    drawBackground();

    if(gameRunning){

        updatePlayer();
        updateKeys();
        updateGhosts();

        drawKeys();
        drawGhosts();
        drawLumi();

        checkExit();
    }

    requestAnimationFrame(gameLoop);
}

/* Touch buttons */

function holdButton(id, key){

    const button =
        document.getElementById(id);

    button.addEventListener(
        "touchstart",
        e=>{
            e.preventDefault();
            direction[key]=true;
        }
    );

    button.addEventListener(
        "touchend",
        e=>{
            e.preventDefault();
            direction[key]=false;
        }
    );
}

holdButton("left","left");
holdButton("right","right");
holdButton("up","up");
holdButton("down","down");

/* Keyboard */

document.addEventListener("keydown",e=>{

    if(e.key==="ArrowLeft")
        direction.left=true;

    if(e.key==="ArrowRight")
        direction.right=true;

    if(e.key==="ArrowUp")
        direction.up=true;

    if(e.key==="ArrowDown")
        direction.down=true;
});

document.addEventListener("keyup",e=>{

    if(e.key==="ArrowLeft")
        direction.left=false;

    if(e.key==="ArrowRight")
        direction.right=false;

    if(e.key==="ArrowUp")
        direction.up=false;

    if(e.key==="ArrowDown")
        direction.down=false;
});

gameLoop();
