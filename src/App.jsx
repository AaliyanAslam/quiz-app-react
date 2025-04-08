import button from "daisyui/components/button";
import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [restart, setRestart] = useState(false);
  const input = useRef([]);
  const btnCol = useRef("");
  const showScoreDiv = useRef();
  useEffect(() => {
    fetch("https://the-trivia-api.com/v2/questions")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setQuestions(res);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function shuffleArray(arr) {
    const emptyArray = [];
    const shuffledArray = [];
    for (let i = 0; i < arr.length; i++) {
      const randomNum = Math.floor(Math.random() * arr.length);

      if (emptyArray.includes(randomNum)) {
        i--;
      } else {
        emptyArray.push(randomNum);
        shuffledArray[randomNum] = arr[i];
      }
    }
    return shuffledArray;
  }

  function nextQuestion() {
    const slelected = input.current.find((item) => item && item.checked);
    // console.log(slelected.value);

    if (slelected.value === questions[index].correctAnswer) {
      // console.log("correct");

      setScore(score + 10);
    } else {
      // console.log("wrong");
      setScore(score);
    }

    index < questions.length - 1 ? setIndex(index + 1) : null;
    if (index === questions.length - 1) {
      setShowScore(true);
      setIsDisabled(true);
      setRestart(true);
      btnCol.current.style.backgroundColor = "gray";
      btnCol.current.style.color = "white";
      btnCol.current.style.cursor = "not-allowed";
    }
  }

  useEffect(() => {
    if (!showScoreDiv.current) return;
    if (showScore && score >= 50) {
      showScoreDiv.current.style.backgroundColor = "green";
      showScoreDiv.current.style.color = "white";
      showScoreDiv.current.style.cursor = "not-allowed";
    } else if (showScore && score < 50) {
      showScoreDiv.current.style.color = "black";
      showScoreDiv.current.style.backgroundColor = "red";
    }
  }, [score]);

  return (
    <>
      <div className="  flex flex-col items-center justify-center h-screen gap-4 text-xs sm:text-sm ms:text-sm lg:text-base xl:text-text-lg 2xl:text-2xl">
        {loading && <div className="skeleton h-5 w-12"></div>}
        {loading && (
          <div className="flex w-52 flex-col gap-4">
            <div className="skeleton h-5 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        )}
        {error && <h1>Error occured</h1>}
        {questions && (
          <div className="m-6 bg-gray-100 shadow-amber-600 p-2 rounded min-w-[300px] max-w-[500px]">
            <h1 className="text-center m-2 text-base sm:text-sm ms:text-sm lg:text-2xl xl:text-text-lg 2xl:text-2xl">
              Quiz app
            </h1>
            <h1>
              Q{index + 1} {questions[index].question.text}
            </h1>
            {shuffleArray([
              ...questions[index].incorrectAnswers,
              questions[index].correctAnswer,
            ]).map((item, index) => {
              return (
                <div className="m-2" key={index}>
                  <input
                    type="radio"
                    name="choice"
                    value={item}
                    id={item}
                    ref={(el) => (input.current[index] = el)}
                  />
                  <label htmlFor={item}>{item}</label>
                </div>
              );
            })}
            <button
              onClick={nextQuestion}
              disabled={isDisabled}
              ref={btnCol}
              className="rounded w-full p-1 bg-gray-950 text-white cursor-pointer"
            >
              Next
            </button>

            {showScore ? (
              <div className="text-center p-3 border mt-3" ref={showScoreDiv}>
                You Got {score}/100
              </div>
            ) : null}

            {restart && (
              <div
                className="text-center p-3 border mt-3 cursor-pointer hover:bg-gray-300 duration-300 "
                onClick={() => {
                  window.location.reload();
                }}
              >
                <button>Restart</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default App;
