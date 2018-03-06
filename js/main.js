let cardLists = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let moves = 0;
let match_found = 0;
let game_started = false;
let timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {                   $('#timer').html(timer.getTimeValues().toString());
});

$('#reset-button').click(resetGame);

function createCard(card) {
    $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}

function generateCards() {
    for (var i = 0; i < 2; i++) {
        cardLists = shuffle(cardLists);
        cardLists.forEach(createCard);
    }
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length
        , temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

openCards = [];

//função de toggle das cartas
function toggleCard() {

    if (game_started == false) {
        game_started = true;
        timer.start();
    }

    if (openCards.length === 0) {
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        disableCLick();
    }
    else if (openCards.length === 1) {
        updateMoves();
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        setTimeout(matchOpenCards, 1100);
    }
}

//desabilita o click
function disableCLick() {
    openCards.forEach(function (card) {
        card.off('click');
    });
}

// habilita o click
function enableClick() {
    openCards[0].click(toggleCard);
}

//verifica se deu match
function matchOpenCards() {
    if (openCards[0][0].firstChild.className === openCards[1][0].firstChild.className) {
        openCards[0].addClass("match").animateCss('pulse');
        openCards[1].addClass("match").animateCss('pulse');
        disableCLick();
        removeOpenCards();
        setTimeout(checkWin, 1000);
    }
    else {
        openCards[0].toggleClass("show open").animateCss('flipInY');
        openCards[1].toggleClass("show open").animateCss('flipInY');
        enableClick();
        removeOpenCards();
    }
}

function removeOpenCards() {
    openCards = [];
}

$.fn.extend({
    animateCss: function (animationName) {
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
});

//Função para atualizar o numero de jogadas
function updateMoves() {
    moves += 1;
    $('#moves').html(`${moves} Moves`);
    if (moves == 24) {
        addBlankStar();
    }
    else if (moves == 15) {
        addBlankStar();
    }
}
//Verifica se os 8 pares foram encontrados, caso de sucesso mostra os resultados,
function checkWin() {
    match_found += 1;
    if (match_found == 8) {
        $("#play-again-btn").on("click", function() {
            location.reload()
        });
        let starRating = 0
        if (moves > 0 && moves < 16) {
            starRating = '3';
        } else if (moves >= 16 && moves <= 20) {
            $("#starOne").removeClass("fa-star");
            starRating = "2";
        } else if (moves > 20) {
            $("#starTwo").removeClass("fa-star");
            starRating = "1";
        }

        $("#final-time").text(timer.getTimeValues().toString());
        $("#total-stars").text(starRating);
        $("#total-moves").text(moves);

        showResults();
    }
}
// adiciona estrela branca
function addBlankStar() {
    $('#stars').children()[0].remove();
    $('#stars').append('<li><i class="fa fa-star-o"></i></li>');
}

//adiciona estrelas
function addStars() {
    for (var i = 0; i < 3; i++) {
        $('#stars').append('<li><i class="fa fa-star"></i></li>');
    }
}

//reseta o game
function resetGame() {
    location.reload()
}

//inicia o jogo
function playGame() {
    generateCards();
    $('.card').click(toggleCard);
    $('#moves').html("0 Moves");
    addStars(3);
}

//mostra os resultados
function showResults() {
    $('#sucess-result').empty();
    timer.pause();
    var modal = $('#win-popup')
    modal.style.display = "block";
}

playGame();