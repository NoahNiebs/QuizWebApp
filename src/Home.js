import {Navigation} from "./Navigation";
import {useState} from "react";

export const Home = () => {

    const [questionsSet, setQuestionsSet] = useState(false);
    const [difficulty, setDifficulty] = useState("Easy");
    const [questionType, setQuestionType] = useState("TrueFalse");
    const [category, setCategory] = useState("None");
    const [numberOfQuestions, setNumberOfQuestions] = useState(10);
    const [isError, setIsError] = useState(false);

    function handleSubmit() {
        console.log(difficulty)
        console.log(questionType)
        console.log(category)
        console.log(numberOfQuestions)

        fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple').then(
            async response => {
                response = await response.json()
                if (response.response_code === 0) {
                    localStorage.setItem("questions",JSON.stringify(response.results))
                    let questions = JSON.parse(localStorage.getItem("questions"))

                    if(!questionsSet) {
                        setQuestionsSet(true)
                    }
                } else if (response.response_code === 1) {
                    throw new Error("No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)")
                } else if (response.response_code === 2) {
                    throw new Error("Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)")
                } else if (response.response_code === 3) {
                    throw new Error("Token Not Found Session Token does not exist.")
                } else if (response.response_code === 4) {
                    throw new Error("Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.")
                } else if (response.response_code === 5) {
                    throw new Error("Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.")
                }
            }
        ).catch(error => {
            console.log(error)
            setIsError(true)
        })



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
        {questionsSet && (<div className={"HomePage"}><p>Hello from home</p></div>)}

    </div>)
}