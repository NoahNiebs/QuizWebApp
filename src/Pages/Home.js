import {Navigation} from "../Navigation";
import {useState} from "react";


const NONE = "None"

export function isValidPositiveInteger(input) {
    return !(/[a-zA-Z.]/.test(input) ||
        Number(input <= 0) ||
        Number(Math.floor(Number(input))) !== Number(input));
}

export const Home = () => {

    const [questionsSet, setQuestionsSet] = useState(false);
    const [difficulty, setDifficulty] = useState(NONE);
    const [questionType, setQuestionType] = useState(NONE);
    const [category, setCategory] = useState(NONE);
    const [numberOfQuestions, setNumberOfQuestions] = useState(NONE);

    const [questions, setQuestions] = useState([]);
    const [quizIsDone, setQuizIsDone] = useState(false)
    const [quizScore, setQuizScore] = useState(0)
    const [correctQuestions, setCorrectQuestions] = useState([])
    const [incorrectQuestions, setIncorrectQuestions] = useState([])
    const [isBadNumericalInput, setIsBadNumericalInput] = useState(false)
    const [isLoadingOverlayPresent, setLoadingOverlay] = useState(false)


    function randomize_list(correctAndIncorrectAnswers) {
        // Randomizes answers in list using Fisher-Yates algorithm
        for (let i = correctAndIncorrectAnswers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [correctAndIncorrectAnswers[i], correctAndIncorrectAnswers[j]] = [correctAndIncorrectAnswers[j], correctAndIncorrectAnswers[i]];
        }
    }



    function handleSubmit() {


        if (!isValidPositiveInteger(numberOfQuestions)) {
            setIsBadNumericalInput(true)
        } else {

            //If the user has specified a parameter, it will be used, otherwise it will be
            // ignored other than number of questions which defaults to 10.
            const EMPTY_PARAMETER = ''
            let questionParameter = EMPTY_PARAMETER
            let difficultyParameter = EMPTY_PARAMETER
            let categoryParameter = EMPTY_PARAMETER
            let questionTypeParameter = EMPTY_PARAMETER
            if (numberOfQuestions !== NONE){questionParameter = "amount=" + numberOfQuestions}
            if (difficulty !==NONE) {difficultyParameter = "&difficulty=" + difficulty}
            if(category !== NONE) {categoryParameter = "&category=" + category}
            if(questionType!==NONE){questionTypeParameter = "&type=" + questionType}


            const request = "https://opentdb.com/api.php?" +
                questionParameter+
                categoryParameter+
                difficultyParameter+
                questionTypeParameter

            setLoadingOverlay(true)
            fetch(request).then(
                async responses => {
                    responses = await responses.json()
                    setLoadingOverlay(false)
                    switch (responses.response_code) {
                        case 0:
                            //The response is good
                            if (!questionsSet) {
                                setQuestionsSet(true);
                            }
                            for (let i = 0; i < responses.results.length; i++) {
                                const currentResponse = responses.results[i];
                                const correctAndIncorrectAnswers = currentResponse.incorrect_answers.concat(currentResponse.correct_answer);
                                randomize_list(correctAndIncorrectAnswers);
                                currentResponse.correctAndIncorrectAnswers = correctAndIncorrectAnswers;
                            }
                            setQuestions(responses.results);
                            break;
                        case 1:
                            throw new Error("No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)");
                        case 2:
                            throw new Error("Invalid Parameter Contains an invalid parameter. Arguments passed in aren't valid. (Ex. Amount = Five)");
                        case 3:
                            throw new Error("Token Not Found Session Token does not exist.");
                        case 4:
                            throw new Error("Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.");
                        case 5:
                            throw new Error("Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.");
                        default:
                            throw new Error("The API returned an error code that is unable to be handled ");
                    }
                }
            ).catch(
                //In the event the API returns a non 0 response code, we display an alert.
                error => alert(error)
            )

        }
    }

    function handleAnswerQuestion(question,answer) {
        for (let i = 0; i < questions.length;i++) {
            if (questions[i].question === question) {
                questions[i].userAnswer = answer
            }
        }
    }
    function handleSubmitQuestions() {
        let correct_count = 0
        const incorrectQuestions = []
        const correctQuestions = []


        //Creates a list of incorrect and correct questions used to display to user
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].userAnswer === questions[i].correct_answer) {
                correct_count += 1
                correctQuestions.push([questions[i].question, questions[i].correct_answer])
            } else {
                incorrectQuestions.push([questions[i].question, questions[i].userAnswer])
            }
        }
        const quizScore = (correct_count / questions.length) * 100

        //Sets the state for the end of game
        setQuizScore(quizScore)
        setCorrectQuestions(correctQuestions)
        setIncorrectQuestions(incorrectQuestions)
        setQuizIsDone(true)

    }

    function endQuiz() {
    //resets values causing the application to go to its initial state
        setQuestions([])
        setIncorrectQuestions([])
        setCorrectQuestions([])
        setQuestionsSet(false)
        setQuizIsDone(false)
        setQuestionType(NONE)
        setNumberOfQuestions(NONE)
        setCategory(NONE)
        setDifficulty(NONE)
    }

    function QuestionDisplay() {
        return <>
            {(<div className={"home-page"}>
                <b>Quiz</b>
                {questions.map(question => <div>
                    <b>{question.question}</b>{question.correctAndIncorrectAnswers.map(answer =>
                    <div onChange={e => handleAnswerQuestion(question.question, e.target.id)}>
                        <input type={"radio"} name={question.question} id={answer}></input>
                        <label>{answer}</label>
                    </div>)}
                </div>)}
                <input type={"submit"} onClick={handleSubmitQuestions}/>
            </div>)}
        </>;
    }
    function EndGameOverlay() {
        return (<div className="endgame-overlay">
            <b>You got {quizScore}% of the questions correct</b>
            <br/>
            <b>Correct Questions:</b>
            {correctQuestions.map(question => <div><i>{question[0]} {<b>{question[1]}</b>}</i> <br/></div>)}
            <br/>
            <b>Incorrect Questions (Your answer shown alongside):</b>
            {incorrectQuestions.map(question => <div><i>{question[0]} <b>{question[1]}</b></i><br/></div>)}
            <button onClick={endQuiz} className={"btn btn-primary"}>Done Reviewing Feedback</button>
        </div>);
    }

    function LoadingScreen() {
        return <div className={"loading-screen"}>
            <b>Loading Data...</b>
        </div>
    }

    function BadNumericalInput() {
        return <div className={"warning"}>
            <b>The amount of questions must be a whole number above 0, no decimals </b>
            <button onClick={e => setIsBadNumericalInput(false)}>Confirm</button>
        </div>;
    }

    //Home page html
    return (
        <div>
        <Navigation/>
        {!questionsSet && (<div className="home-page">
            <b>No Questions are loaded, what would you like to be quizzed on today?</b>
            <b>Category</b>
            <select onChange={e => setCategory(e.target.value)}>
                <option value={NONE}>Any category</option>
                <option value="9">General Knowledge</option>
                <option value="17">Science & Nature</option>
                <option value="21">Sports</option>
                <option value="25">Art</option>
                <option value="23">History</option>
            </select>
            <b>Difficulty</b>
            <select onChange={e => setDifficulty(e.target.value)}>
                <option value={NONE}>Any difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
            <b>Number of questions *Required</b>
            <input type="text" onChange={e => setNumberOfQuestions(e.target.value)}></input>
            <b>Question Type</b>
            <div className="form-check" onChange={e => setQuestionType(e.target.id)}>
                <input type={"radio"} className="form-check-input" name="questionTypeSelection"
                       id="boolean"></input>
                <label className={"form-check-label"}>True/False</label>
            </div>
            <div className="form-check" onChange={e => setQuestionType(e.target.id)}>
                <input type={"radio"} className="form-check-input" name="questionTypeSelection"
                       id={"multiple"}></input>
                <label className={"form-check-label"}>Multiple Choice</label>
            </div>
            <div className="form-check" onChange={e => setQuestionType(e.target.id)}>
                <input type={"radio"} className="form-check-input" name="questionTypeSelection"
                       id={NONE}></input>
                <label className={"form-check-label"}>Both</label>
            </div>
            <input type="submit" onClick={handleSubmit}/>
        </div>)}
        {questionsSet && <QuestionDisplay/>}
        {quizIsDone && <EndGameOverlay/>}
            {isBadNumericalInput && <BadNumericalInput/>}
            {isLoadingOverlayPresent && <LoadingScreen/>}
        </div>
    )
}