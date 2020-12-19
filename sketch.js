// add your code here
var database,player1,player2,player1img,player2img;
var player1Score =0;
var player2Score =0;

function preload(){
    player1img = loadAnimation("assests/player1a.png","assests/player1b.png","assests/player1a.png")
    player2img = loadAnimation("assests/sprite_1.png","assests/sprite_0.png","assests/sprite_1.png")
}

function setup(){
    createCanvas(600,600)
    database = firebase.database()

    //player1(red)
    player1 = createSprite(300,250,10,10)
    player1.addAnimation("run",player1img)
    player1.scale=0.5
    player1.setCollider("circle",0,0,30)
    player1.debug=true

    //player2(yellow)
    player2 = createSprite(500,250,10,10)
    player2.addAnimation("run1",player2img)
    player2.scale=0.5
  
    reset = createButton("reset")
    reset.position(500,50)
    reset.mousePressed(()=>{
        database.ref('/').update({
            gameState: 0,
            player1Score:0,
            player2Score:0
        })
    })

    //fetch player1 position from function readpos1
    player1pos = database.ref('player1/position')
    player1pos.on("value",(d1)=>{
        pos1 = d1.val()
        player1.x=pos1.x;
        player1.y=pos1.y
    })

    //fetch player2 position from function readpos2
    player2pos = database.ref('player2/position')
    player2pos.on("value",(d2)=>{
        pos2 = d2.val()
        player2.x=pos2.x;
        player2.y=pos2.y
    })


    //fetch gamestate from function readgs
    gameState = database.ref('gameState')
    gameState.on("value",(state)=>{
        gameState = state.val()
    })

    //fetch player1 score from function readp1s
    player1score = database.ref('player1score')
    player1score.on("value",(score)=>{
        player1score = score.val()
    })

    //fetch player2 score from function readp2s
    player2score = database.ref('player2score')
    player2score.on("value",(score)=>{
        player2score = score.val()
    })


}

function draw(){
    background("white")


    //toss and ride call,reset the position of the players
    if(gameState === 0){
       
        fill("black")
        textSize(30)
        text("PRESS SPACE TO TOSS",100,400)

        if(keyDown("space")){
        rand = Math.round(random(1,2))
        if(rand == 1){
            database.ref('/').update({
                gameState:1
            })
            alert('RED RIDE')
        }
        if(rand == 2){
            database.ref('/').update({
                gameState:2
            })
            alert('YELLOW RIDE')
        }
        database.ref('player1/position').update({
            x:150,
            y:250
        })
        database.ref('player2/position').update({
            x:500,
            y:250
        })

        }

      
    }
    //player1 score when he crosses red line
    if(player1.x>501){
        player1Score = player1Score+5
        player2Score=player2Score -5
        database.ref('/').update({
            'player1Score': player1Score,
            'gameState' : 0,
            'player2Score':player2Score
        })
     
    }
 //player2 score when he crosses yellow line
    if(player2.x<99){
        player1Score = player1Score-5
        player2Score=player2Score +5
        database.ref('/').update({
            'player1Score': player1Score,
            'gameState' : 0,
            'player2Score':player2Score 
        })
    }
console.log(gameState)
    //moving the players with keys-red with arrow keys and yellow eith 'aswd'
  if(gameState==1){
   p1mover()
   p1moveu()
   p2mover()
  //end state
if(player1.isTouching(player2)){
    player1Score = player1Score-5
    player2Score=player2Score +5
    database.ref('/').update({
        'player1Score': player1Score,
        'gameState' : 0,
        'player2Score':player2Score 
    })
    fill("black")
    textSize(20)
   text("yellow won",100,400)
}

  }
    else if(gameState == 2){
        p1mover()
        p2mover()
        p2moveu()
        //end state
if(player2.isTouching(player1)){
    player1Score = player1Score+5
    player2Score=player2Score -5
    database.ref('/').update({
        'player1Score': player1Score,
        'gameState' : 0,
        'player2Score':player2Score 
    })
    fill("black")
    textSize(20)
   text("red won",100,400)
}

    }



    //lines
    for(i=0;i<600;i=i+20){
        stroke("red")
        strokeWeight(4)
        line(500,i,500,i+10)
    }
    for(i=0;i<600;i=i+20){
        stroke("yellow")
        strokeWeight(4)
        line(100,i,100,i+10)
    }
    for(i=0;i<600;i=i+20){
        stroke("black")
        strokeWeight(4)
        line(300,i,300,i+10)
    }


    //display score
    textSize(15)
    text("RED SCORE:"+player1Score,150,20)
    text("YELLOW SCORE:"+player2Score,350,20)

    drawSprites()
}









function p1moveu(){
    if(keyDown(UP_ARROW)){
        writepos1(5,0)
    }
    else if(keyDown(DOWN_ARROW)){
        writepos1(-5,0)
    }
}

function p1mover(){
    if(keyDown(RIGHT_ARROW)){
        writepos1(0,5)
    }
    else if(keyDown(LEFT_ARROW)){
        writepos1(0,-5)
    }
   
}

function p2moveu(){
     if(keyDown("w")){
        writepos2(-5,0)
    }
    else if(keyDown("s")){
        writepos2(5,0)
    }
}

function p2mover(){
     if(keyDown("d")){
        writepos2(0,5)
    }
    else if(keyDown("a")){
        writepos2(0,-5)
    }
}
function writepos1(x,y){
    database.ref('player1/position').set({
        x:pos1.x+x,
        y:pos1.y+y
    })
}

function writepos2(x,y){
    database.ref('player2/position').set({
        x:pos2.x+x,
        y:pos2.y+y
    })
}