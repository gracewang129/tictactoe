 
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className={"square " + (props.isRed ? 'red' : '')}
        onClick={() => props.onClick()} // call the onclick in props, thus the 
        >
        {props.value}
      </button>
    );
  }


class Board extends React.Component {

  renderSquare(i) {
      let red = false;
      if (this.props.winningLine && this.props.winningLine.includes(i)) {
        red = true;
      }
    return <Square 
             isRed={red}
             key={i}
             value={this.props.squares[i]} 
             onClick={() => this.props.onClick(i)} // sort of like click handler in Angular
             />;
  }
  renderRow(rowNumber) {
    let row = [];
    
    for (var i = 0; i < 3; i++) {
      row = row.concat(this.renderSquare(3*rowNumber + i));
    }
    return (<div className="board-row" key={rowNumber}> {row} </div>);
  }
  renderRows() {
    let boardRows = [];
    for (var i = 0; i < 3; i++) { 
      boardRows.push(this.renderRow(i));
    }
    //console.log(boardRows)
    return boardRows
  }
  render() {
   this.renderRows();
    return (
      <div>
        <div className="status">{this.props.status}</div>

        {this.renderRows()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coordinates: null,
      }],
      olClass: null,
      stepNumber: 0,
      xIsNext: true
    }
  }
  jumpTo(step) {
    // simply jumping to any step will not wipe the later steps.
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0, // if step is 0, 2, ... etc, next player should be X.
    });
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);// slice until the current step. since we are clicking, all newer histories than the current step number are invalid now.
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const x = Math.floor(i / 3);
    const y = i % 3;
    const coordinates = [x, y];
    if (calculateWinner(squares) || squares[i]) {
      // if there's a winner or the square is occupied
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // history.push(squares);  // don't use push here, use concat at the setState, since maintain unchangebility... it won't change the original array
    this.setState({
                  history: history.concat([{
                    squares: squares,
                    coordinates: coordinates
                  }]),
                  // if step number is being set -> all later moves are wiped
                  stepNumber: history.length,
                  xIsNext: !this.state.xIsNext});
  }
  reverseList() {
    const olClass = !this.state.olClass ? 'ol-reversed' : null;
    this.setState({olClass: olClass});
    // console.log(this.state.olClass)
  }
  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      if (!current.squares.some(el => el === null)) {
        status = 'Theres a tie!';
      }
    }
    // step and move sort of like enumerate in python
    const moves = history.map((step, move) => {
      const description = move ? ('Go to move #' + move) : 'Go to game start';
      const coor = step.coordinates ? ' Coordinates: (' + step.coordinates[0] + ',' + step.coordinates[1] + ')' : '';
      let className = ''
      if (this.state.stepNumber === move) {
        className = 'bold';
      }
      return (<li key={move}> 
          <button onClick={() => this.jumpTo(move)} className={className}>{description}</button>
          {coor}
        </li>)
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winningLine={winner}/>
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <div> <button onClick={() => this.reverseList()}>Reverse</button></div>
          <ol className={this.state.olClass}>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c];
    }
  }
  return null;
}
function calculateWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c];
    }
  }
  return null;
}