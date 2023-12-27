Hello - this is a quiz web app built with React that tests users on questions from the Open Trivia database. Users can specify the dificulty, number, type, and topic of their questions and once finished will be presented with what they had gotten correct/incorrect and an overall score. 


<b>To start the application, follow these steps</b>

npm install

npm start

The app will then run in localhost:3000 if steps above go accordingly

<b>This is a basic implementation, due to time constraints if there were more time the following would be completed </b>

1.) Following each quiz, the user will be given the option to submit a name which will be saved over Local Storage and would be displayed over the leaderboard.

2.) Implementation of the question specification would be refactored, instead of being able to generate a single request string to send to the REST api, the web app will continuously take them in until the user specifies they are done. In which then the handleSubmit will iterate over all of them and make one large list with the multiple requests.

3.) Dark Mode

4.) When pulling from the API, the input will often have web spaces or other artifacts that do not belong, so they should be cleaned upon arrival.

5.) The final component which gathers user information for the quiz itself can be refactored into its own component. When I attempt to extract it tough the input fields keep on updating to their initial values when typing into it. 
