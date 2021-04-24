// on page load
document.onreadystatechange = () => {
    for (let i = 0; i < localStorage.length; i++) {
        // call 3 times for top 3 list items
        updateHighScores();
        if (i == 3) break;
    }
}

let updateHighScores = () => {
    let allScores = [];

    // fill the temporary array with the scores from localStorage
    for (let i = 0; i < localStorage.length; i++)
        allScores.push(parseInt(localStorage.getItem(localStorage.key(i))));

    // sort the array (desc)
    allScores.sort(function (a, b) { return b - a });

    let listOfNames = [];
    // for each high score in the top 3
    for (let j = 0; j < 3; j++) {

        // find the corresponding username
        // gets the first one if multiple users have the same score
        for (let i = 0; i < localStorage.length; i++)
            if (allScores[j] == parseInt(localStorage.getItem(localStorage.key(i)))
                &&
                !listOfNames.includes(localStorage.key(i))) // skip if the name is already in the list
                listOfNames.push(localStorage.key(i));
    }
    // find how many scores are visible in the highscore list
    let highscoreList = document.querySelectorAll("li");

    // if there's room to add more scores
    if (highscoreList.length < 3) {

        // fetch the template and add a score
        let template = document.querySelector("#scoreTemplate");
        let liItem = template.content.cloneNode(true);

        // append to list
        document.getElementById("scoreTable").appendChild(liItem);
    }

    // check again to see if the list has changed
    highscoreList = document.querySelectorAll("li");

    // update the list
    for (let i = 0; i < highscoreList.length; i++) {

        // children[0] = username
        highscoreList[i].children[0].textContent = listOfNames[i];

        // children[1] = score
        highscoreList[i].children[1].textContent = allScores[i];
    }
}

let startButton = document.getElementById("startButton");

// start the game on button click
startButton.addEventListener('click', () => {

    // disable the button while the game is running
    startButton.disabled = true;

    // allow the cookie image to be clickable
    let cookie = document.getElementById("cookie")
    cookie.setAttribute("data-clickable", "true");

    // fetch the score element
    let scoreElement = document.getElementById("score");

    let currentScore = 0;

    // defining a function in order to remove the listener
    // after the game is finished
    let updateScore = () => {

        currentScore++;

        // update the text in the element
        scoreElement.textContent = currentScore;
    };

    cookie.addEventListener('click', updateScore);

    // get the remaining time
    let secondsLeftText = document.getElementById("seconds");

    // parse the string
    let secondsLeft = parseInt(secondsLeftText.textContent);

    // save the starting counter for a later restart
    let startingCounter = secondsLeft;

    // define the interval function and call it
    // so you can stop the function via clearInterval()
    // when the time runs out
    const countDown = setInterval(() => {

        // if there's no time left
        if (--secondsLeft == 0) {

            // stop the count
            clearInterval(countDown);

            // factor in the 0-th second
            secondsLeftText.textContent = secondsLeft;

            // re-enable the start button
            startButton.disabled = false;

            // reset the time remaining
            setTimeout(() => {
                secondsLeftText.textContent = startingCounter;
            }, 100);

            // remove the clicking listener
            cookie.removeEventListener('click', updateScore);

            // disable the ability to click the image
            cookie.setAttribute("data-clickable", "false");

            // reset the score
            scoreElement.textContent = 0;

            // get the username via a prompt
            let username = prompt("Your score is " + currentScore + ".\n"
                + "Please type in your username");

            // add a K-V pair to the localstorage
            let add = () => {
                localStorage.setItem(username, currentScore);
            };

            // but only if the username exists
            // (prompt was not submitted as empty)
            if (username.length > 0) {
                add();
                updateHighScores();
            } else alert("Your result will not be saved since no username was provided.");
        }

        // update the text for time-left
        secondsLeftText.textContent = secondsLeft;

        // call the function every second (1000ms)
    }, 1000);

});