const gameBoard = document.querySelector('#gameBoard');
const ctx = gameBoard.getContext('2d');
const scoreText = document.querySelector('#scoreText')
const resetBtn = document.querySelector('#resetBtn');
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = 'green';
const snakeColor = 'lightpink';
const snakeBorder = 'purple';
const foodColor = 'brown';
const unitSize = 25;
const coinText = document.querySelector('#coinText');
const shopBtn = document.querySelector('#shopBtn');
const shopModal = document.querySelector('#shopModal');
const closeShopBtn = document.querySelector('#closeShopBtn');
const snakeColors = [
    {name: 'default pink', color: 'lightpink', price: 0, owned: true},
    {name: 'red', color: 'red', price: 5, owned: false},
    {name: 'blue', color: 'blue', price: 5, owned: false},
    {name: 'yellow', color: 'yellow', price: 5, owned: false},
    {name: 'royal purple', color: 'purple', price: 10, owned: false},
    {name: 'navy blue', color: 'navy', price: 10, owned: false},
    {name: 'white', color: 'white', price: 15, owned: false},
    {name: 'black', color: 'black', price: 15, owned: false},
    {name: 'ghost', color: 'rgba(255,255,255,0.5)', price: 50, owned: false},
]
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let coinsAnimating = false;
let coins = 0;
let snake = [
    {x:unitSize*4, y:0},
    {x:unitSize*3, y:0},
    {x:unitSize*2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0},
];
let currentSnakecolor = snakeColors[0];


window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame)
shopBtn.addEventListener("click", openShop);
closeShopBtn.addEventListener("click", closeShop);

gameStart();

function gameStart(){
    running = true;
    scoreText.textContent = score;
    coinText.textContent = coins;
    createFood();
    drawFood();
    nextTick();
};
function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75); 
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0,0, gameWidth, gameHeight);
};
function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random()* (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
    console.log(foodX);
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    snake.unshift(head);
    // check if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        score += 1;
        scoreText.textContent = score;
        createFood();
    }
    else{
        snake.pop();
    }
    };
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakepart => {
        ctx.fillRect(snakepart.x, snakepart.y, unitSize, unitSize);
        ctx.strokeRect(snakepart.x, snakepart.y, unitSize, unitSize);
    })
};
function changeDirection(event){
const keyPressed = event.keyCode;
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

const goingUp = (yVelocity == -unitSize);
const goingDown = (yVelocity == unitSize);
const goingRight = (xVelocity == unitSize);
const goingLeft = (xVelocity == -unitSize);

switch(true){
    case(keyPressed == LEFT && !goingRight):
        xVelocity = -unitSize;
        yVelocity = 0;
        break;
    case(keyPressed == UP && !goingDown):
        xVelocity = 0;
        yVelocity = -unitSize;
        break;
    case(keyPressed == RIGHT && !goingLeft):
        xVelocity = unitSize;
        yVelocity = 0;
        break;
    case(keyPressed == DOWN && !goingUp):
        xVelocity = 0;
        yVelocity = unitSize;
        break;
}
};
function checkGameOver(){
    switch (true){
        case(snake[0].x < 0):
            running = false;
            break;
        case(snake[0].x >= gameWidth):
            running = false;
            break;
        case(snake[0].y < 0):
            running = false;
            break;
        case(snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }

    }
};
function displayGameOver(){
    ctx.font = "50px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", gameWidth / 2, gameHeight / 2);
    running = false;

    const oldCoins = coins;
    coins += score;
    if (score > 0){
        coinsAnimating = true;
        resetBtn.disabled = true;
        resetBtn.style.opacity = 0.5;
        resetBtn.style.cursor = 'not-allowed';
        animateCoins(oldCoins, coins);
    }
};
function animateCoins(startValue, endValue){
    let currentCoin = startValue;

    const coinInterval = setInterval (()=>{
        currentCoin += 1; 
        coinText.textContent = currentCoin;

        if(currentCoin >= endValue){
            clearInterval(coinInterval);
            coinsAnimating = false;
            resetBtn.disabled = false;
            resetBtn.style.opacity = '1';
            resetBtn.style.cursor = 'pointer';
        }
}, 200);
}
function resetGame(){
    if(coinsAnimating) {
        return;
    }


    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize*4, y:0},
        {x:unitSize*3, y:0},
        {x:unitSize*2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0},
    ];
    gameStart();
};
function openShop(){
    shopModal.style.display = 'flex';
    displayColorOptions();
}
function closeShop(){
    shopModal.style.display = 'none';
}
function displayColorOptions(){
    const colorOptionsContainer = document.querySelector('#colorOptions');
    colorOptionsContainer.innerHTML = '';

    snakeColors.forEach((colorOption, index) => {
        const colorBtn = document.createElement('button');
        colorBtn.className = 'colorOptionBtn';

        if(colorOption.owned){
            colorBtn.textContent = `${colorOption.name} - Owned`;
            colorBtn.style.backgroundColor = colorOption.color;
        }
        else {
            colorBtn.textContent = `${colorOption.name} - ${colorOption.price} coins`;
            colorBtn.style.backgroundColor = colorOption.color;
            colorBtn.style.opacity = '0.55'; 
        }

        colorBtn.addEventListener('click', () => {
            selectColor(index);
        });

        colorOptionsContainer.appendChild(colorBtn);

    });

}