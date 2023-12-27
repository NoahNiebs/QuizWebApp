import {Navigation} from "./Navigation";
import {useState} from "react";

export const Home = () => {

    const [questionsSet, setQuestionsSet] = useState(false);
    const [difficulty, setDifficulty] = useState("None");
    const [questionType, setQuestionType] = useState("None");
    const [category, setCategory] = useState("None");
    const [numberOfQuestions, setNumberOfQuestions] = useState(-1);
    const [isError, setIsError] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answeredQuestions, setAnsweredQuestion] = useState({})
    const [quizIsDone, setQuizIsDone] = useState(false)
    const [quizScore, setQuizScore] = useState(0)
    const [correctQuestions, setCorrectQuestions] = useState([])
    const [incorrectQuestions, setIncorrectQuestions] = useState([])


    function handleSubmit() {




        const request = "https://opentdb.com/api.php?amount=" + numberOfQuestions + "&category=" + category + "&difficulty=" + difficulty + "&type=" + questionType
        fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple').then(
            async responses => {
                responses = await responses.json()
                if (responses.response_code === 0) {

                    if(!questionsSet) {
                        setQuestionsSet(true)
                    }
                    for (let i = 0; i < responses.results.length; i++) {
                        const currentResponse = responses.results[i]
                        const correctAndIncorrectAnswers = currentResponse.incorrect_answers.concat(currentResponse.correct_answer)
                        for (let i = correctAndIncorrectAnswers.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [correctAndIncorrectAnswers[i], correctAndIncorrectAnswers[j]] = [correctAndIncorrectAnswers[j], correctAndIncorrectAnswers[i]];
                        }
                        currentResponse.correctAndIncorrectAnswers = correctAndIncorrectAnswers
                    }
                    setQuestions(responses.results)
                } else if (responses.response_code === 1) {
                    throw new Error("No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)")
                } else if (responses.response_code === 2) {
                    throw new Error("Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)")
                } else if (responses.response_code === 3) {
                    throw new Error("Token Not Found Session Token does not exist.")
                } else if (responses.response_code === 4) {
                    throw new Error("Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.")
                } else if (responses.response_code === 5) {
                    throw new Error("Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.")
                }
            }
        ).catch(error => {
            console.log(error)
            setIsError(true)
        })



    }

    function handleAnswerQuestion(question,answer) {

        for (let i = 0; i < questions.length;i++) {
            if (questions[i].question === question) {
                questions[i].userAnswer = answer
            }
        }
       // answeredQuestions[question] = e
    }
    function handleSubmitQuestions() {
        let correct_count = 0
        const incorrectQuestions = []
        const correctQuestions = []
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].userAnswer === questions[i].correct_answer) {
                correct_count += 1
                correctQuestions.push([questions[i].question, questions[i].correct_answer])
            } else {
                incorrectQuestions.push([questions[i].question, questions[i].userAnswer])
            }
        }
        const quizScore = (correct_count / questions.length) * 100
        setQuizScore(quizScore)
        setQuizIsDone(true)
        setCorrectQuestions(correctQuestions)
        setIncorrectQuestions(incorrectQuestions)

        // answeredQuestions[question] = e
    }

    function endQuiz() {
        setQuestions([])
        setIncorrectQuestions([])
        setCorrectQuestions()
        setQuestionsSet(false)
        setQuizIsDone(false)
    }

    return (<div><Navigation/>
        {!questionsSet && (<div className="HomePage">
            <b>No Questions are loaded, what would you like to be quizzed on today?</b>
            <b>Category</b>
            <select onChange = {e => setCategory(e.target.value)}>
                <option>Select a category</option>
                <option value="9">General Knowledge</option>
                <option value="17">Science & Nature</option>
                <option value="21">Sports</option>
                <option value="25">Art</option>
                <option value="23">History</option>
            </select>
            <b>Difficulty</b>
            <select onChange={e => setDifficulty(e.target.value)}>
                <option>Select a difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
            <b>Number of questions</b>
            <input type="text"></input>
            <b>Question Type</b>
            <div className="form-check" onChange={e => setQuestionType(e.target.id)}>
                <input type={"radio"} className = "form-check-input" name="questionTypeSelection" id = "trueFalse"></input>
                <label className={"form-check-label"}>True/False</label>
            </div>
            <div className="form-check" onChange={e => setQuestionType(e.target.id)}>
                <input type={"radio"} className = "form-check-input" name="questionTypeSelection" id={"multipleChoice"}></input>
                <label className={"form-check-label"}>Multiple Choice</label>
            </div>
            <input type="submit" onClick={handleSubmit}/>
        </div>)}
        {questionsSet && (<div className={"HomePage"}>
            <b>Quiz</b>
            {questions.map(question => <div><b>{question.question}</b>{question.correctAndIncorrectAnswers.map(answer =>
                <div  onChange={e => handleAnswerQuestion(question.question,e.target.id)}>
                    <input type={"radio"} name={question.question} id = {answer} ></input>
                    <label>{answer}</label>
                </div>)}
                </div>)}
        <input type={"submit"} onClick={handleSubmitQuestions}/>
        </div>)} {quizIsDone && (
            <div className="endgame_overlay">
                <b>You got {quizScore}% of the questions correct</b>
                <br/>
                <b>Correct Questions:</b>
                {correctQuestions.map(question => <div><i>{question}</i> <br/></div>)}
                <br/>
                <b>Incorrect Questions (Your answer shown alongside):</b>
                {incorrectQuestions.map(question => <div><i>{question}</i><br/></div>)}
                <button onClick={endQuiz} className={"btn btn-primary"}>Done Reviewing Feedback</button>
            </div>
        )}

    </div>)
}