let message;
let messageBackground;

function preload() {
  const suits = ['hearts','diamonds','clubs','spades'];
  const values = ['2','3','4','5','6','7','8','9','10','jack','queen','king','ace'];

  suits.forEach(suit=>{
    values.forEach(value=>{
      this.load.image(`${suit}-${value}`,`assets/${suit}-${value}.png`);
    });
  });
  this.load.image('card_back','assets/back.png');
  this.load.image('background','assets/background.png');
  this.load.image('placeholder','assets/placeholder.png');
}

function create() {
  let background = this.add.image(0,0,'background');
  background.setOrigin(0,0);
  background.displayWidth = this.sys.canvas.width;
  background.displayHeight = this.sys.canvas.height;

  let cardDeck = createDeck();
  dealCards(cardDeck,this);
  message = this.add.text(config.width/2,config.height/2, 'Hello Player!',{fontSize:'50px',fill:'#f5f5f5',fontStyle:'bold',align:'center'});
  message.setOrigin(0.5);
  message.setAlpha(0);

  messageBackground = this.add.graphics();
  messageBackground.fillStyle(0xbf0a3a,1);
  messageBackground.setVisible(false);

  messageBackground.fillRoundedRect(config.width/2 - message.width/2 -10,config.height/2 - message.height/2-10,message.width+20,message.height+20,5);

  this.children.bringToTop(message);
}

function createDeck() {
  const suits = ['hearts','diamonds','clubs','spades'];
  const values = ['2','3','4','5','6','7','8','9','10','jack','queen','king','ace'];
  let deck = [];
  suits.forEach(suit=>{
    values.forEach(value=>{
      deck.push({suit:suit,value:value});
    });
  });
  Phaser.Utils.Array.Shuffle(deck);
  return deck;
}

function dealCards(deck,scene) {
  const cardWidth = 85;
  const cardHeight = 128;
  const row4Start = {x:95,y:300};
  const rowSpacing = 64;
  const cardSpacing = 5;

  const positions = calculatePositions(row4Start,cardWidth,cardSpacing,rowSpacing);

  let allCards = [];
  let discardedCards = [];

  let drawPile = scene.add.image(400,500,"card_back");
  drawPile.displayWidth = cardWidth;
  drawPile.displayHeight = cardHeight;
  drawPile.setData("type","drawPile");
  drawPile.setInteractive({cursor: "pointer"});
  let discardPile = scene.add.image(600,500,"placeholder");
  discardPile.displayWidth = cardWidth;
  discardPile.displayHeight = cardHeight;
  discardPile.setData("type","discardPile");

  for(let i=0; i<28; i++) {
    let card = deck.pop();
    let cardSprite = createCardSprite(scene,card,positions[i],i<18);
    allCards.push(cardSprite);

    handleCardInteraction(scene,cardSprite,discardPile,allCards,discardedCards);
  }
  scene.drawPileCards = [];
  for(let i=0; i<deck.length;i++) {
    let card = deck[i];
    let cardSprite = createCardSprite(scene,card,{x:drawPile,y:drawPile.y},true,true);
    scene.drawPileCards.push(cardSprite);
  }
  handleDrawPileClick(scene,drawPile,discardPile,allCards,discardedCards);
}

function calculatePositions(row4Start,cardWidth,cardSpacing,rowSpacing) {
  return [
    {x:row4Start.x+1.5*(cardWidth+cardSpacing),y:row4Start.y-3*rowSpacing},
    {x:row4Start.x+4.5*(cardWidth+cardSpacing),y:row4Start.y-3*rowSpacing},
    {x:row4Start.x+7.5*(cardWidth+cardSpacing),y:row4Start.y-3*rowSpacing},

    {x:row4Start.x+(cardWidth+cardSpacing),y:row4Start.y-2*rowSpacing},
    {x:row4Start.x+2*(cardWidth+cardSpacing),y:row4Start.y-2*rowSpacing},
    {x:row4Start.x+4*(cardWidth+cardSpacing),y:row4Start.y-2*rowSpacing},
    {x:row4Start.x+5*(cardWidth+cardSpacing),y:row4Start.y-2*rowSpacing},
    {x:row4Start.x+7*(cardWidth+cardSpacing),y:row4Start.y-2*rowSpacing},
    {x:row4Start.x+8*(cardWidth+cardSpacing),y:row4Start.y-2*rowSpacing},

    {x:row4Start.x+(cardWidth/2+cardSpacing),y:row4Start.y-rowSpacing},
    {x:row4Start.x+1.5*(cardWidth+cardSpacing),y:row4Start.y-rowSpacing},
    {x:row4Start.x+2.5*(cardWidth+cardSpacing),y:row4Start.y-rowSpacing},
    {x:row4Start.x+3.5*(cardWidth+cardSpacing),y:row4Start.y-rowSpacing},
    {x:row4Start.x+4.5*(cardWidth+cardSpacing),y:row4Start.y-rowSpacing},
    {x:row4Start.x+5.5*(cardWidth+cardSpacing),y:row4Start.y-rowSpacing},
    {x:row4Start.x+6.5*(cardWidth+cardSpacing),y:row4Start.y-rowSpacing},
    {x:row4Start.x+7.5*(cardWidth+cardSpacing),y:row4Start.y-rowSpacing},
    {x:row4Start.x+8.5*(cardWidth+cardSpacing),y:row4Start.y-rowSpacing},

    {x:row4Start.x,y:row4Start.y},
    {x:row4Start.x+(cardWidth+cardSpacing),y:row4Start.y},
    {x:row4Start.x+2*(cardWidth+cardSpacing),y:row4Start.y},
    {x:row4Start.x+3*(cardWidth+cardSpacing),y:row4Start.y},
    {x:row4Start.x+4*(cardWidth+cardSpacing),y:row4Start.y},
    {x:row4Start.x+5*(cardWidth+cardSpacing),y:row4Start.y},
    {x:row4Start.x+6*(cardWidth+cardSpacing),y:row4Start.y},
    {x:row4Start.x+7*(cardWidth+cardSpacing),y:row4Start.y},
    {x:row4Start.x+8*(cardWidth+cardSpacing),y:row4Start.y},
    {x:row4Start.x+9*(cardWidth+cardSpacing),y:row4Start.y},
  ];
}

function createCardSprite(scene,card,position,isFaceDown,isFromDrawPile = false) {
  let cardSprite = scene.add.image(position.x,position.y,isFaceDown?"card_back":`${card.suit}-${card.value}`);
  cardSprite.setData("card",card);
  if(!isFromDrawPile)
    cardSprite.setInteractive({cursor:'pointer'});
  cardSprite.displayWidth = 85;
  cardSprite.displayHeight = 128;
  return cardSprite;
}

function handleCardInteraction(scene,cardSprite,discardPile,allCards,discardedCards){
  cardSprite.on("pointerdown",function(pointer){
    let topCardData = discardPile.getData("topCard");
    if(topCardData == undefined)
      return;
    let cardData = cardSprite.getData("card");
    let key = `${cardData.suit}-${cardData.value}`;
    if(isDifferenceOne(topCardData,cardData) && isCardFree(cardSprite,allCards)) {
      scene.children.bringToTop(cardSprite);
      scene.tweens.add({
        targets: cardSprite,
        x: discardPile.x,
        y:discardPile.y,
        duration:500,
        ease: 'Power2',
        onComplete: function() {
          cardSprite.setTexture(key);
          discardPile.setData("topCard",cardData);
          cardSprite.disableInteractive();
          checkAndFlipFreeCards(allCards);
          discardedCards.push(cardSprite);
          checkForEndGame(scene.drawPileCards,discardedCards,allCards,cardData);
        }
      });
    }
  });
}

function isCardFree(card,allCards) {
  const cardX = card.x;
  const cardY = card.y;
  const cardWidth = card.displayWidth;

  for(let i=0; i<allCards.length; i++) {
    let otherCard = allCards[i];
    if(otherCard === card) continue;
    if(
      otherCard.y === cardY+64 &&
      otherCard.x>= cardX - (cardWidth) &&
      otherCard.x <= cardX + (cardWidth)
    ) {
      return false;
    }
  }
  return true;
}

function isDifferenceOne(card1,card2) {
  const values1 = getCardValue(card1);
  const values2 = getCardValue(card2);
  return values1.some(val1=>values2.some(val2 =>Math.abs(val1-val2) ===1 ));
}

function getCardValue(card) {
  const valueMap = {
    '2':2,
    '3':3,
    '4':4,
    '5':5,
    '6':6,
    '7':7,
    '8':8,
    '9':9,
    '10':10,
    'jack':11,
    'queen':12,
    'king':13,
    'ace':1
  };
  return card.value === 'ace' ? [1,14] : [valueMap[card.value]];
}

function checkAndFlipFreeCards(allCards) {
  for(let i=0;i<allCards.length;i++) {
    let key = allCards[i].data.list.card.suit+"-"+allCards[i].data.list.card.value;
    if(isCardFree(allCards[i],allCards))
      allCards[i].setTexture(key);
  }
}

function handleDrawPileClick(scene,drawPile,discardPile,allCards,discardedCards) {
  drawPile.on("pointerdown",function(pointer){
    if(scene.drawPileCards.length === 0)
      return;
    let topCard = scene.drawPileCards.pop();
    let cardData = topCard.getData("card");
    let key = `${cardData.suit}-${cardData.value}`;

    let cardSprite = scene.add.image(drawPile.x,drawPile.y,"card_back");
    cardSprite.displayWidth = topCard.displayWidth;
    cardSprite.displayHeight = topCard.displayHeight;
    cardSprite.setData("card",cardData);

    scene.tweens.add({
      targets:cardSprite,
      x: discardPile.x,
      y:discardPile.y,
      duration: 500,
      ease: "Power2",
      onComplete: function() {
        cardSprite.setTexture(key);
        scene.children.bringToTop(cardSprite);
        if(scene.drawPileCards.length === 0) {
          scene.add.image(drawPile.x,drawPile.y,"placeholder");
        }
        discardPile.setData("topCard",cardData);
        checkForEndGame(scene.drawPileCards,discardedCards,allCards,topCard.data.list.card);
      }
    });
  });
}

function checkForEndGame(drawPileCards,discardedCards,allCards,topCard) {
  if(drawPileCards.length === 0 && !isThereAnyLegalMove(allCards,topCard,discardedCards)) {
    displayEndMessage("You Lost!");
  }
  if(discardedCards.length === 28) {
    displayEndMessage("You Won!",0x048738);
  }
}

function displayEndMessage(messageText,bgColor=0xbf0a3a){
  messageBackground.clear();
  messageBackground.fillStyle(bgColor,1);
  const padding = 10;
  messageBackground.fillRoundedRect(
    config.width/2-message.width/2-padding,
    config.height/2- message.height/2-padding,
    message.width+2*padding,
    message.height+2*padding,
    5
  );
  messageBackground.setVisible(true);
  message.setText(messageText);
  message.setAlpha(1);
}

function isThereAnyLegalMove(allCards,topCard,discardedCards) {
  allCards = allCards.filter(item=> !discardedCards.includes(item));
  for(let i=0;i<allCards.length; i++) {
    if(isCardFree(allCards[i],allCards) && isDifferenceOne(allCards[i].data.list.card,topCard)) {
      return true;
    }
  }
  return false;
}

const config = {
  type : Phaser.AUTO,
  width:1000,
  height:700,
  scene: {
    preload:preload,
    create:create
  }
};

const game = new Phaser.Game(config);



















