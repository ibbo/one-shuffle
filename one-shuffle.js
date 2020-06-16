window.onload = showCards;

function showCards() {

var numCards = document.getElementById("numCards").value;
var numColumns = document.getElementById("numColumns").value;
var depth = document.getElementById("depth").value;
var xMargin = 20;
var yMargin = 40;
var delta = 5;
var gap = depth * delta + 10;
var cardWidth = 50;
var cardHeight = 70;

var width = window.innerWidth;
var numRows = Math.ceil(numCards / numColumns / depth);
var height = numRows*(cardHeight + gap) - gap + depth*delta + 2*yMargin;

var cardExtent = numColumns*(cardWidth + gap) - gap + depth*delta + 2*xMargin;

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
});
// After the stage is created recompute the width based on the margins
width = document.getElementById("container").offsetWidth;
stage.width(width);

// If the number of columns is too big to fit the width of the window
// change the scale of the stage so it will fit
var scale = width / cardExtent;
if (cardExtent > width) {
    stage.scaleX(scale);
    stage.scaleY(scale);
    stage.batchDraw();
}

var layer = new Konva.Layer();

var i;
var cards = [];
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
cards.push(rect);

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
    cards.push(rect);

}

stage.add(layer);

var randomCard = rect;
var selectedCard = 0;
stage.on('click', nextCard);

function nextCard() {

    if (cards.length > 0) {
        selectedCard = Math.floor(Math.random() * cards.length);
        randomCard = cards[selectedCard];
        randomCard.fill('red');
        layer.draw();
        cards.splice(selectedCard, 1);
    } else {
        layer.draw();
    }
    randomCard.hide();
}
}
