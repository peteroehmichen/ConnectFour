(function () {
    var steps;
    var won;
    var firstRow;
    var lastRow;
    var currentPlayer = "playerOne";
    var columns;
    var numberOfRows;
    var holes;
    var connect;
    var fullCol = false;
    var rotation = 0;
    var namesOfPlayers;
    var colorsOfPlayers;
    var score = [0, 0];
    var activeCol;

    setGrid();

    function setGrid() {
        // localStorage.setItem("highscoreConnect4", "testValie");

        // runs only once after page loading
        $(".overlay").css({
            visibility: "visible",
        });
        $(".gridSet").css({
            visibility: "visible",
        });
        $("#start").on("click", function () {
            namesOfPlayers = [$("#player1").val(), $("#player2").val()];
            colorsOfPlayers = [$("#colorOne").val(), $("#colorTwo").val()];
            // console.log(colorsOfPlayers);
            connect = $("#connects").val();
            $(".one").text(namesOfPlayers[0]);
            $(".two").text(namesOfPlayers[1]);
            $(".one").css({
                borderColor: colorsOfPlayers[0],
            });
            $(".two").css({
                borderColor: colorsOfPlayers[1],
            });

            var columnsSet = $("#columns").val();
            var rowsSet = $("#rows").val();

            for (; columnsSet > 0; columnsSet--) {
                $(".board").append('<div class="column"></div>');
            }
            for (; rowsSet > 0; rowsSet--) {
                $(".column").append('<div class="row"></div>');
            }
            $(".row").append('<div class="hole"></div>');
            columns = $(".column");
            numberOfRows = columns.eq(0).children().length;
            holes = $(".row");
            firstRow = [];
            lastRow = [];
            for (var i = 0; i < holes.length; i += numberOfRows) {
                firstRow.push(i);
                lastRow.push(i + numberOfRows - 1);
            }
            $(".overlay").css({
                visibility: "hidden",
            });
            $(".gridSet").css({
                visibility: "hidden",
            });
            resetBoard();
        });
    }

    function resetBoard() {
        $("#title").text("Connect... " + connect);
        steps = 0;
        won = false;
        $(".scoreBoard").css({
            visibility: "visible",
        });
        $(".joker").css({
            visibility: "visible",
        });
        $(".first").css({
            visibility: "visible",
        });
        $(".second").css({
            visibility: "visible",
        });

        play();
    }

    function play() {
        columns.on("mouseenter", function (e) {
            activeCol = $(e.currentTarget); // convert to a jquery-object
            activeCol.css({
                borderColor: "grey",
            });
        });

        columns.on("click", function () {
            fullCol = false;
            steps++;
            var slotsInCol = activeCol.children();

            // Fill the clicked column
            for (var i = slotsInCol.length - 1; i >= 0; i--) {
                if (
                    !slotsInCol.eq(i).hasClass("playerOne") &&
                    !slotsInCol.eq(i).hasClass("playerTwo")
                ) {
                    // dropCoin(i);
                    slotsInCol.eq(i).addClass(currentPlayer);
                    break;
                }
                // full column action
                if (i === 0) {
                    activeCol.css({ background: "red" });
                    steps--;
                    fullCol = true;
                    setTimeout(function () {
                        activeCol.css({ background: "transparent" });
                    }, 100);
                }
            }

            if (
                checkVictory(slotsInCol) ||
                checkVictory($(".row:nth-child(" + (i + 1) + ")")) ||
                checkVictory(diagonalLine(slotsInCol.eq(i), "down")) ||
                checkVictory(diagonalLine(slotsInCol.eq(i), "up"))
            ) {
                endGame();
            } else if (steps === holes.length) {
                endGame("tie");
            } else if (!fullCol) {
                changePlayer();
            }
            $(".playerOne .hole").css({
                backgroundColor: colorsOfPlayers[0],
            });
            $(".playerTwo .hole").css({
                backgroundColor: colorsOfPlayers[1],
            });
        });

        columns.on("mouseleave", function () {
            activeCol.css({
                borderColor: "black",
            });
        });

        $(".joker").on("click", joker2);
    }

    function checkVictory(line) {
        won = false;
        var counter = 0;
        for (var i = 0; i <= line.length; i++) {
            if (line.eq(i).hasClass(currentPlayer)) {
                counter++;
                if (counter == connect) {
                    won = true;
                    break;
                }
            } else {
                counter = 0;
            }
        }
        for (; i >= 0; i--) {
            if (line.eq(i).hasClass(currentPlayer)) {
                line.eq(i).addClass("winnerCoin");
            } else break;
        }
        return won;
    }

    function changePlayer() {
        if (currentPlayer === "playerOne") {
            currentPlayer = "playerTwo";
            $(".one").removeClass("currentPlayer");
            $(".two").addClass("currentPlayer");
        } else {
            currentPlayer = "playerOne";
            $(".two").removeClass("currentPlayer");
            $(".one").addClass("currentPlayer");
        }
    }

    function endGame() {
        columns.off("click");
        $(".joker").off("click");
        if (arguments[0] === "tie") {
            $("#title").text("Connect... N O N E");
            $("#one").text("tie ...");
            $("#two").text("tie ...");
        } else {
            if (currentPlayer === "playerOne") {
                $("#one").text("has won!!!");
                $("#two").text("... 🥴 ...");
                highscore(namesOfPlayers[0], connect);
                score[0]++;
            } else {
                $("#two").text("has won!!!");
                $("#one").text("... 🥴 ...");
                highscore(namesOfPlayers[1], connect);
                score[1]++;
            }
        }
        $(".score").text(score[0] + " : " + score[1]);

        $(".joker").css({
            visibility: "hidden",
        });

        $(".overlay").css({
            visibility: "visible",
        });
        $(".messageOne").show(2000);
        $(".messageTwo").show(2000);

        $(".endOfGame").css({
            visibility: "visible",
        });

        $(".showHighscore").on("click", function () {
            if ($(".showHighscore").text() === "Show Highscore") {
                $(".showHighscore").text("Hide Highscore");
                $(".column").hide("slow");
            } else {
                $(".showHighscore").text("Show Highscore");
                $(".column").show("slow");
            }
            $(".highscore").toggle("slow");
        });

        $(".restart").on("click", function () {
            $(".playerOne .hole").css({
                backgroundColor: "transparent",
            });
            $(".playerTwo .hole").css({
                backgroundColor: "transparent",
            });

            for (var i = 0; i < holes.length; i++) {
                holes.eq(i).removeClass("playerOne");
                holes.eq(i).removeClass("playerTwo");
                holes.eq(i).removeClass("winnerCoin");
            }
            $(".overlay").css({
                visibility: "hidden",
            });
            $(".highscore").hide();
            $(".showHighscore").text("Show Highscore");
            $(".endOfGame").css({
                visibility: "hidden",
            });
            $(".messageOne").hide();
            $(".messageTwo").hide();
            $(".showHighscore").off("click");
            $(".column").show();
            $(".restart").off("click");
            changePlayer();
            resetBoard();
        });
    }

    function diagonalLine(element, direction) {
        // find the index of the current element - saved under j
        element.addClass("identify");
        for (var j = 0; j < holes.length; j++) {
            if (holes.eq(j).hasClass("identify")) {
                break;
            }
        }
        element.removeClass("identify");
        // find the first element of the diagonal line going through the element
        var startingIndex = j;
        var incrementor;
        if (direction === "down") {
            incrementor = numberOfRows + 1;
            while (
                startingIndex >= numberOfRows &&
                !firstRow.includes(startingIndex)
            ) {
                startingIndex -= incrementor;
            }
        } else if (direction === "up") {
            incrementor = numberOfRows - 1;
            while (
                startingIndex >= numberOfRows &&
                !lastRow.includes(startingIndex)
            ) {
                startingIndex -= incrementor;
            }
        }
        // fill the jquery-object with the possible diagonal elements
        var diagonal = $();
        for (var i = startingIndex; i < holes.length; i += incrementor) {
            diagonal = diagonal.add(holes.eq(i));
            if (direction === "down" && lastRow.includes(i)) {
                break;
            } else if (direction === "up" && firstRow.includes(i)) {
                break;
            }
        }

        return diagonal;
    }

    function joker2(e) {
        // turn off the joker-card for this round
        if ($(e.currentTarget).hasClass("first")) {
            $(".first").css({
                visibility: "hidden",
            });
        } else {
            $(".second").css({
                visibility: "hidden",
            });
        }
        if (rotation === 0) {
            $(".board").css({
                transform: "rotate(1080deg)",
            });
            rotation++;
        } else {
            $(".board").css({
                transform: "rotate(0deg)",
            });
            rotation = 0;
        }

        // create array of current coin-positions on board
        var position = [];
        var cols = $(".column");
        var rows = 0;
        // set array of element-classes
        for (j = 0; j < cols.length; j++) {
            position[j] = [];
            rows = cols.eq(j).children();
            for (i = 0; i < rows.length; i++) {
                if (rows.eq(i).hasClass("playerOne")) {
                    position[j].push("playerOne");
                } else if (rows.eq(i).hasClass("playerTwo"))
                    position[j].push("playerTwo");
            }
        }

        // create new array with coin-positions of 180° shifted board
        var tmp = [];
        for (var i = 0; i < position.length; i++) {
            tmp.unshift(position[i]);
        }
        for (i = 0; i < $(".row").length; i++) {
            $(".row").eq(i).removeClass("playerOne");
            $(".row").eq(i).removeClass("playerTwo");
        }
        for (i = 0; i < cols.length; i++) {
            rows = cols.eq(i).children();
            for (var j = 0; j < rows.length; j++) {
                if (tmp[i][j] === "playerOne") {
                    rows.eq(rows.length - 1 - j).addClass("playerOne");
                    rows.eq(rows.length - 1 - j).addClass("dropAll");
                } else if (tmp[i][j] === "playerTwo") {
                    rows.eq(rows.length - 1 - j).addClass("playerTwo");
                    rows.eq(rows.length - 1 - j).addClass("dropAll");
                }
            }
        }
        var surpriseWin = [];
        var currentRow = 0;
        setTimeout(function () {
            for (i = 0; i < holes.length; i++) {
                holes.eq(i).removeClass("dropAll");
            }
            for (i = 0; i < 2; i++) {
                for (j = 0; j < rows.length; j++) {
                    currentRow = $(".row:nth-child(" + (j + 1) + ")");

                    if (checkVictory(currentRow)) {
                        surpriseWin.push(currentPlayer);
                    }

                    for (var k = 0; k < currentRow.length; k++) {
                        if (currentRow.eq(k).hasClass(currentPlayer)) {
                            if (
                                checkVictory(
                                    diagonalLine(currentRow.eq(k), "down")
                                ) ||
                                checkVictory(
                                    diagonalLine(currentRow.eq(k), "up")
                                )
                            ) {
                                surpriseWin.push(currentPlayer);
                            }
                        }
                    }
                }
                changePlayer();
            }
            if (surpriseWin.length > 0) {
                if (
                    surpriseWin.includes("playerOne") &&
                    surpriseWin.includes("playerTwo")
                ) {
                    endGame("tie");
                } else if (surpriseWin.includes("playerOne")) {
                    currentPlayer = "playerOne";
                    endGame();
                } else {
                    currentPlayer = "playerTwo";
                    endGame();
                }
            }
        }, 4000);

        // searching for surprise win (there cannot be vertical wins - so no check)
        // loop through both players
        // inside: for current player loop through their coins and check for existing wins
        // --> first check current row if current Player has win
        // --> loop through current row - if current Player coin is found, then check 2x diagonal
    }

    function highscore(winner, points) {
        // get highscore or create empty object for it
        try {
            var highscore = JSON.parse(
                localStorage.getItem("highscoreConnect4")
            );
            if (!highscore) {
                highscore = {};
            }
        } catch (err) {
            console.log(err);
        }
        if (highscore[winner]) {
            highscore[winner] = parseInt(highscore[winner]) + parseInt(points);
        } else {
            highscore[winner] = points;
        }
        var sortedNames = [];
        var sortedScores = [];
        for (var element in highscore) {
            if (sortedScores <= parseInt(highscore[element])) {
                sortedScores.unshift(parseInt(highscore[element]));
                sortedNames.unshift(element);
            } else {
                sortedScores.push(parseInt(highscore[element]));
                sortedNames.push(element);
            }
        }
        var highscoreHtml =
            "<table><tr class='tableHead'><td>#</td><td>Name of Player</td><td>Score</td></tr>";
        for (var i = 0; i < sortedScores.length; i++) {
            // console.log(sortedNames[i], winner);
            if (sortedNames[i] === winner) {
                highscoreHtml +=
                    "<tr class='tableWinner'><td>" +
                    (i + 1) +
                    "</td><td>" +
                    sortedNames[i] +
                    "</td><td>" +
                    sortedScores[i] +
                    "</td></tr>";
            } else {
                highscoreHtml +=
                    "<tr><td>" +
                    (i + 1) +
                    "</td><td>" +
                    sortedNames[i] +
                    "</td><td>" +
                    sortedScores[i] +
                    "</td></tr>";
            }
        }
        highscoreHtml += "</table>";
        $(".highscore").html(highscoreHtml);
        // write new highscore to local Storage
        try {
            localStorage.setItem(
                "highscoreConnect4",
                JSON.stringify(highscore)
            );
        } catch (err) {
            console.log(err);
        }
    }
})();
