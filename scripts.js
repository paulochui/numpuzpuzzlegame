const initialState = [3, 6, 7, 2, 1, 4, 5, 8, null];
const targetState = [1, 2, 3, 8, null, 4, 7, 6, 5];
let moveCounter = 0;
const movesCounterElement = document.getElementById('movesCount');
console.log('Elemento de contador de movimientos:', movesCounterElement);

        function isSolved(board) {
            for (let i = 0; i < board.length - 1; i++) {
                if (board[i] !== i + 1) {
                    return false;
                }
            }
            return true;
        }

        function renderBoard(board) {
            const boardElement = document.getElementById('board');
            boardElement.innerHTML = '';
            for (let i = 0; i < board.length; i++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.textContent = board[i] === null ? '' : board[i];
                tile.addEventListener('click', () => {
                    handleTileClick(i);
                });
                boardElement.appendChild(tile);
            }
        }

        function handleTileClick(tileIndex) {
            const emptyIndex = currentState.indexOf(null);
        
            if (isMoveValid(tileIndex, emptyIndex)) {
                swapTiles(tileIndex, emptyIndex);
                renderBoard(currentState);
                updateOutputText(`Movimiento: ${currentState[tileIndex]} hacia el espacio vacío.`);
        
                // Incrementa el contador de movimientos
                //moveCounter++;
        
                // Actualiza el contador de movimientos en el HTML
                movesCounterElement.textContent = moveCounter;
        
                if (isSolved(currentState)) {
                    alert('¡Felicidades! Has resuelto el puzzle.');
                    resetGame();
                }
            }
        }
        

        function isMoveValid(tileIndex, emptyIndex) {
            const rowDiff = Math.abs(Math.floor(tileIndex / 3) - Math.floor(emptyIndex / 3));
            const colDiff = Math.abs((tileIndex % 3) - (emptyIndex % 3));
            return (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 0);
        }

        function swapTiles(index1, index2) {
            [currentState[index1], currentState[index2]] = [currentState[index2], currentState[index1]];
        }

        /*function resetGame() {
            currentState = [...initialState];
            renderBoard(currentState);
            updateOutputText('');
        }*/

        function resetAndClear() {
            currentState = [...initialState];
            renderBoard(currentState);
            document.getElementById('outputText').value = ''; // Limpiar el contenido del área de texto
        
            // Reiniciar el contador de movimientos
            moveCounter = 0;
            movesCounterElement.textContent = moveCounter;  // Actualiza el contador de movimientos
        }
        


        function solvePuzzle() {
            const moves = aStarSearch(currentState, targetState);
            if (moves) {
                performMoves(moves);
            } else {
                updateOutputText('No se encontró una solución.');
            }
        }

        function aStarSearch(initialState, targetState) {
            const openSet = [{ state: initialState, g: 0, h: heuristic(initialState, targetState), moves: [] }];
            const closedSet = new Set();

            while (openSet.length > 0) {
                openSet.sort((a, b) => a.g + a.h - (b.g + b.h));
                const current = openSet.shift();

                if (current.state.toString() === targetState.toString()) {
                    // Solución encontrada
                    return current.moves;
                }

                closedSet.add(current.state.toString());

                const emptyIndex = current.state.indexOf(null);
                const neighbors = getNeighbors(emptyIndex);

                for (const neighborIndex of neighbors) {
                    const nextState = [...current.state];
                    [nextState[emptyIndex], nextState[neighborIndex]] = [nextState[neighborIndex], nextState[emptyIndex]];

                    const neighborStateString = nextState.toString();
                    if (!closedSet.has(neighborStateString)) {
                        openSet.push({
                            state: nextState,
                            g: current.g + 1,
                            h: heuristic(nextState, targetState),
                            moves: [...current.moves, `Mover ${nextState[emptyIndex]} al espacio vacío`]
                        });
                        closedSet.add(neighborStateString);
                    }
                }
            }

            return null; // No se encontró solución
        }

        function getNeighbors(index) {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const neighbors = [];

            if (row > 0) neighbors.push(index - 3);
            if (row < 2) neighbors.push(index + 3);
            if (col > 0) neighbors.push(index - 1);
            if (col < 2) neighbors.push(index + 1);

            return neighbors;
        }

        function heuristic(state, target) {
            let count = 0;
            for (let i = 0; i < state.length; i++) {
                if (state[i] !== target[i] && state[i] !== null) {
                    count++;
                }
            }
            return count;
        }

        function performMoves(moves) {
            let i = 0;
            const intervalId = setInterval(() => {
                if (i < moves.length) {
                    updateOutputText(moves[i]);
                    const tileIndex = currentState.indexOf(parseInt(moves[i].split(' ')[1]));  // Convertir a número
                    const emptyIndex = currentState.indexOf(null);
                    swapTiles(tileIndex, emptyIndex);
                    renderBoard(currentState);
                    i++;
                    updateMovesCounter(moveCounter + 1);
                } else {
                    clearInterval(intervalId);
                    if (isSolved(currentState)) {
                        alert('¡Felicidades! Has resuelto el puzzle.');
                        resetAndClear(); // 
                    }
                }
            }, 1000);
        }
        

        function updateOutputText(text) {
            const outputTextElement = document.getElementById('outputText');
            outputTextElement.value += text + '\n';
        }

        function updateMovesCounter(count) {
            moveCounter = count;
            movesCounterElement.textContent = count;
        }
        

        let currentState = [...initialState];
        renderBoard(currentState);
        updateOutputText('');