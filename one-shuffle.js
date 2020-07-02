window.onload = init;

function init() {
if (localStorage.numCards) {
    document.getElementById("numCards").value = localStorage.numCards;
}
if (localStorage.numColumns) {
    document.getElementById("numColumns").value = localStorage.numColumns;
}
if (localStorage.depth) {
    document.getElementById("depth").value = localStorage.depth;
}

showCards();
}


class Pile {
    constructor(x, y, cardOffset) {
        this.cards = [];
        this.x = x;
        this.y = y;
        this.cardOffset = cardOffset;
    }

    addCard(card) {
        this.cards.push(card);
    }

    redraw() {
        var x = this.x;
        var y = this.y;
        this.cards.forEach((item, index) => {
            if (item.rect.visible()) {
                item.rect.position({x:x, y:y});
                x += this.cardOffset;
                y += this.cardOffset;
            }
        });
    }
}

class Card {
    constructor(rect, pile) {
        this.rect = rect;
        this.pile = pile;
    }
}

function showCards() {

var numCards = document.getElementById("numCards").value;
localStorage.numCards = numCards;
var numColumns = document.getElementById("numColumns").value;
localStorage.numColumns = numColumns;
var depth = document.getElementById("depth").value;
localStorage.depth = depth;
var xMargin = 20;
var yMargin = 40;
var delta = 5;
var gap = depth * delta + 10;
var cardWidth = 50;
var cardHeight = 70;
var maxScale = 2;

var width = window.innerWidth;
var numRows = Math.ceil(numCards / numColumns / depth);
var height = numRows*(cardHeight + gap) - gap + depth*delta + 2*yMargin;

var cardExtent = numColumns*(cardWidth + gap) - gap + depth*delta + 2*xMargin;

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
});

function resizeStage() {
    // After the stage is created recompute the width based on the margins
    width = document.getElementById("container").offsetWidth;
    stage.width(width);

    // If the number of columns is too big to fit the width of the window
    // change the scale of the stage so it will fit
    var scale = width / cardExtent;
    if (scale > maxScale) {
	scale = maxScale;
    }
    stage.scaleX(scale);
    stage.scaleY(scale);
    stage.batchDraw();
    var newHeight = height*scale;
    stage.height(newHeight);
}
resizeStage();
window.addEventListener('resize', resizeStage);

var layer = new Konva.Layer();

var i;
var cards = [];
var piles = [];
var columnCounter = 0;
var rowCounter = 0;
var depthCounter = 0;

var rect = new Konva.Rect({
    x: xMargin,
    y: yMargin,
    width: cardWidth,
    height: cardHeight,
    fill: 'lightblue',
    shadowBlur: 10,
    cornerRadius: 10,
});

layer.add(rect);
var thisPile = new Pile(xMargin, yMargin, delta);
piles.push(thisPile);
var card = new Card(rect, thisPile);
cards.push(card);
thisPile.addCard(card);

var previousRect;
var previousX;

for (i=0; i < numCards-1; i++) {
    previousX = rect.x();
    previousY = rect.y();

    depthCounter += 1;
    if (depthCounter == depth) {
        depthCounter = 0;
        columnCounter += 1;
        dx = xMargin + columnCounter * (cardWidth+gap);
        if (columnCounter == numColumns) {
            columnCounter = 0;
            rowCounter += 1;
            dx = xMargin;
        }
        dy = yMargin + rowCounter * (cardHeight+gap);
        thisPile = new Pile(dx, dy, delta);
        piles.push(thisPile);
    } else {
        dx = previousX + delta;
        dy = previousY + delta;
    }

    rect = new Konva.Rect({
        x: dx,
        y: dy,
        width: cardWidth,
        height: cardHeight,
        fill: 'lightblue',
        shadowBlur: 10,
        cornerRadius: 10,
    });
    rect.on('tap', nextCard);
    layer.add(rect);
    var thisCard = new Card(rect, thisPile);
    cards.push(thisCard);
    thisPile.addCard(thisCard);
}

stage.add(layer);

var randomCard = rect;
var selectedCard = 0;
stage.on('click', nextCard);

function nextCard() {

    if (cards.length > 0) {
        selectedCard = Math.floor(Math.random() * cards.length);
        randomCard = cards[selectedCard];
        randomCard.rect.fill('red');
        layer.draw();
        cards.splice(selectedCard, 1);
    } else {
        layer.draw();
    }
    randomCard.rect.hide();
    randomCard.pile.redraw();
}
}
