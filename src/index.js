class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerLabel: "Session",
      timeLeft: 25 * 60,
      isPaused: false
    };
    this.handleAdjust = this.handleAdjust.bind(this);
    this.countdown = this.countdown.bind(this);
    this.handlePause = this.handlePause.bind(this);
  }

  /* handle incremenet / decrement adjustments. */
  handleAdjust(event) {
    switch (event.target.id) {
      case "session-increment":
        if (this.state.sessionLength < 60) {
          this.setState(state => ({
            sessionLength: (state.sessionLength += 1),
            timeLeft: state.sessionLength * 60,
            timerLabel: "Session",
            isPaused: false
          }));
          clearInterval(this.timerID);
        }
        break;
      case "session-decrement":
        if (this.state.sessionLength > 1) {
          this.setState(state => ({
            sessionLength: (state.sessionLength -= 1),
            timeLeft: state.sessionLength * 60,
            timerLabel: "Session",
            isPaused: false
          }));
          clearInterval(this.timerID);
        }
        break;
      case "break-increment":
        if (this.state.breakLength < 60) {
          this.setState({
            breakLength: this.state.breakLength + 1
          });
        }
        break;
      case "break-decrement":
        if (this.state.breakLength > 1) {
          this.setState({
            breakLength: this.state.breakLength - 1
          });
        }
        break;
      default:
        console.log("default");
    }
  }

  /* timer logic. */
  countdown = () => {
    // var el = document.querySelector("audio");

    if (this.state.timeLeft > 0) {
      this.setState(state => {
        return {
          timeLeft: this.state.timeLeft - 1
        };
      });
    } else {
      console.log("switching!!");
      this.handlePause();
    }
  };

  handlePause = () => {
    console.log("clicked: handlePause");
    var el = document.querySelector("audio");

    if (this.state.isPaused === true && this.state.timeLeft === 0) {
      // if state isPaused and timer is 0, THEN pause, play beep, resume.
      clearInterval(this.timerID);
      el.play();
      setTimeout(() => {
        this.timerID = setInterval(() => {
          this.countdown();
        }, 1000);
        this.setState({
          timerLabel: this.state.timerLabel === "Session" ? "Break" : "Session",
          timeLeft:
            this.state.timerLabel === "Session"
              ? this.state.breakLength * 60
              : this.state.sessionLength * 60
        });
      }, 3000);
    } else if (this.state.isPaused === true) {
      clearInterval(this.timerID);
      this.setState({ isPaused: false });
    } else {
      this.timerID = setInterval(this.countdown, 1000);
      this.setState({ isPaused: true });
    }
  };

  reset = () => {
    let b = document.getElementById("beep");
    /* reset state */
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerLabel: "Session",
      timeLeft: 25 * 60,
      isPaused: false
    });
    /* reset timer */
    clearInterval(this.timerID);
    /* reset audio */
    b.pause();
    b.currentTime = 0;
  };

  render() {
    /* Convert timeLeft to readable mm:ss*/
    let min = Math.floor(this.state.timeLeft / 60);
    let sec = Math.floor(this.state.timeLeft % 60);

    if (min < 10) {
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }

    let timer = min + ":" + sec;

    return (
      <div className="wrapper">
        {/* <ReactFCCtest /> */}
        <h1 className="title">Pomodoro Clock</h1>
        <div className="b-wrapper">
          <h2 id="break-label" className="label">Break Length</h2>
          <div
            id="break-decrement"
            className="decrement"
            onClick={this.handleAdjust}
          >
            -
          </div>
          <div id="break-length" className="length">
            {this.state.breakLength}
          </div>
          <div
            id="break-increment"
            className="increment"
            onClick={this.handleAdjust}
          >
            +
          </div>
        </div>
        <div id="session" className="s-wrapper">
          <h2 id="session-label" className="label">Session Length</h2>
          <div
            id="session-decrement"
            className="decrement"
            onClick={this.handleAdjust}
          >
            -
          </div>
          <div id="session-length" className="length">
            {this.state.sessionLength}
          </div>
          <div
            id="session-increment"
            className="increment"
            onClick={this.handleAdjust}
          >
            +
          </div>
        </div>
        <div className="timer-wrapper">
          <h2 id="timer-label" className="timer-label">
            {this.state.timerLabel}
          </h2>
          <div id="time-left" className="time-left">
            {timer}
          </div>
          <audio id="beep" src="https://goo.gl/65cBl1">
            Your browser does ot support the <code>audio</code> element.
          </audio>
        </div>
        <div className="controls">
          <div
            id="start_stop"
            className="play-pause"
            onClick={this.handlePause}
          >
            <i className="fa fa-play"></i>
            <i className="fa fa-pause"></i>
          </div>
          <div id="reset" className="reset" onClick={this.reset}>
            <i id="reset" className="fa fa-rotate-left"> </i>
          </div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
