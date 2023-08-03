// Create module for gameboard
// IIFE (Immediately Invoked Function Expression)
const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""]

    // display gameboard on window
    // Every time a selection is made in grid,
    // render will be called
    const render = () => {
        let boardHTML = "";
        // For each square in the gameboard, we want
        // to make a square
        gameboard.forEach((square, index) => {
            // each square is identified with index
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;
        addSquareEvents();
    }

    const addSquareEvents = () => {
        const squares = document.querySelectorAll('.square');
        squares.forEach((square) => {
            square.addEventListener('click', Game.handleClick);
        })
    }

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    };

    const getGameboard = () => gameboard;

    return {
        render,
        update,
        getGameboard
    }
})();

const createPlayerFactory = (name, mark) => {
    return {
        name,
        mark
    }
};

// "Object to control the flow of the game itself"
// Keep track of players and scores
const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayerFactory(document.querySelector("#player1").value, "X"),
            createPlayerFactory(document.querySelector('#player2').value, "O")
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        //Gameboard.addSquareEvents();
    }

    // Register clicks on gameboard tiles
    const handleClick = (event) => {
        if(gameOver) {
            return;

            
        }
        let index = parseInt(event.target.id.split('-')[1]);
        console.log(index);
        // prevents change to a square IF already marked
        if(Gameboard.getGameboard()[index] !== "") return;

        Gameboard.update(index, players[currentPlayerIndex].mark);

        if(checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            alert(`${players[currentPlayerIndex].name} won!`);
        } else if(checkForTie(gameboard.getGameboard())) {
            gameOver = true;
            alert(`Its a tie!`);
        }
        // switches between X and O depending on the current player
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        Gameboard.render();
    }

    return {
        start,
        handleClick,
        restart
    }
})();

function checkForWin(board, mark) {
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]
    console.log(board, mark);
    for(let i = 0; i < winningCombinations.length; i++) {
        const [a,b,c] = winningCombinations[i];
        if(board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    // if every cell is filled but a winner 
    // cannot be chosen
    return board.every(cell => cell !== "");
}

const restartButton = document.querySelector('#restart-button');
restartButton.addEventListener('click', () => {
    Game.restart();
})

const startButton = document.querySelector('#start-button');
startButton.addEventListener('click', () => {
    Game.start();
});
