function Deck(){
this.DOM = ele => document.querySelector(ele)
this.draw = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`
this.oppVal = []
this.yourVal = []
this.opponentCards = []
this.yourCards = []

this.playJackBlack = _ =>{
    this.deck = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    fetch(this.deck)
    .then(res=>res.json())
    .then(data=>{
    this.deckId = data.deck_id
    this.DOM('.button').addEventListener('click',this.drawFour)
    })
}

this.redeal = _ =>{
    this.deck = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    fetch(this.deck)
    .then(res=>res.json())
    .then(data=>{
    this.deckId = data.deck_id
    this.DOM('.button').classList.remove('hidden')
    this.DOM('#redeal').classList.add('hidden')
    this.DOM('.button').addEventListener('click',this.drawFour)
    })
}

this.removeAllChildNodes = ele =>{
    while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
    }
}

this.drawFour = _ =>{
    
  this.oppHand = ''
  this.yourHand = ''

    this.removeAllChildNodes(this.DOM('#OppHand'))
    this.removeAllChildNodes(this.DOM('#yourHand'))


    this.DOM('#theirTotal').classList.add('hidden')
    this.DOM('#show').classList.remove('hidden')
    this.DOM('#bet').classList.remove('hidden')


    this.DOM('#OppCards1').src = 'img/back.jpg'

    this.DOM('#result').innerText = 'Result'
    this.oppVal = []
    this.yourVal = []


let draw4 = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=4`

fetch(draw4)
  .then(res=>res.json())
  .then(data=>{

    localStorage.clear()
 
    if(data.remaining<=4){
        this.DOM('#redeal').classList.remove('hidden')
       this.DOM('.button').classList.add('hidden')
       this.DOM('#bet').classList.add('hidden')
       this.DOM('#show').classList.add('hidden')
       this.DOM('#redeal').addEventListener('click',this.redeal)
       }


   this.opponentCards = [data.cards[0].images.png, data.cards[1].images.png]
   this.yourCards = [data.cards[2].images.png, data.cards[3].images.png]

  this.oppCardImages = localStorage.setItem('opponentCards',this.opponentCards)
  this.yourCardImages = localStorage.setItem('yourCards',this.yourCards)

  this.DOM('#yourCards').src = this.yourCards[0]
  this.DOM('#yourCards1').src = this.yourCards[1]
  this.DOM('#OppCards').src = this.opponentCards[0]

  this.oppVal.push(data.cards[0].value,data.cards[1].value)
  this.yourVal.push(data.cards[2].value,data.cards[3].value)

  this.yourVal = this.convertNumber(this.yourVal)
  this.oppVal = this.convertNumber(this.oppVal)

  this.DOM('.button').classList.add('hidden')
  this.getSum()

  this.DOM('#show').addEventListener('click',this.showCards)
  this.DOM('#bet').addEventListener('click',this.bet)
  })
}


this.showCards = _ =>{
    this.DOM('#OppCards1').src = this.opponentCards[1]
    this.DOM('#show').classList.add('hidden')
    this.DOM('#bet').classList.add('hidden')
    this.DOM('#theirTotal').classList.remove('hidden')
    this.getFinalSum()
    this.DOM('.button').classList.remove('hidden')
}


this.oppHand = ''
this.yourHand = ''

this.bet = _ =>{
    let drawTwo= `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=2`
fetch(drawTwo)
  .then(res=>res.json())
  .then(data=>{


  let newCard = document.createElement('img')
  newCard.src = data.cards[0].images.png
  this.DOM('#yourHand').appendChild(newCard)
  this.yourVal.push(data.cards[0].value)

  let newOppCard = document.createElement('img')
  newOppCard.src = data.cards[1].images.png
  this.DOM('#OppHand').appendChild(newOppCard)
  this.oppVal.push(data.cards[1].value)

  this.oppHand += data.cards[0].images.png += ', '
  this.yourHand += data.cards[1].images.png += ', '

  this.newOppImages = localStorage.setItem('newOppImages', this.oppHand)
  this.newYourImages = localStorage.setItem('newYourImages', this.yourHand)

this.oppVal = this.convertNumber(this.oppVal)
this.yourVal = this.convertNumber(this.yourVal)
  this.getSum()
})
}

this.convertNumber = (arr) =>{
return arr.map(ele=>{
  if(ele==='JACK'||ele==='QUEEN'||ele==='KING'){
      return 10
  }else if(ele==='ACE'){
      return 11
  }else{
    return Number(ele)
  }
})


}

this.getSum = _ => {
    let yourSum = this.yourVal.reduce((a,b)=>{
 return a+b
   },0)
   this.DOM('#yourTotal').innerText = yourSum
 
 
   let theirSum = this.oppVal.reduce((a,b)=>{
 return a+b
   },0)
 
   this.DOM('#theirTotal').innerText = theirSum
 
   this.yourTotal  = localStorage.setItem('yourTotal' ,yourSum)
   this.oppTotal = localStorage.setItem('oppTotal' ,theirSum)

   if(yourSum>21){
     this.DOM('#result').innerText = "You Lose!"
     this.DOM('.button').classList.remove('hidden')
     this.DOM('#bet').classList.add('hidden')
     this.DOM('#show').classList.add('hidden')
   }else if(theirSum>21){
     this.DOM('#result').innerText = "You Win!"
     this.DOM('.button').classList.remove('hidden')
     this.DOM('#bet').classList.add('hidden')
     this.DOM('#show').classList.add('hidden')
   }
  
 }
 
 this.getFinalSum = _ =>{ 
    let yourSum = this.yourVal.reduce((a,b)=>{
return a+b
    },0)
    this.DOM('#yourTotal').innerText = yourSum
        
        
    let theirSum = this.oppVal.reduce((a,b)=>{
 return a+b
    },0)

  this.DOM('#theirTotal').innerText = theirSum
 
   this.DOM('#theirTotal').innerText = theirSum
   if(yourSum>21){
     this.DOM('#result').innerText = "You Lose!"
     this.DOM('.button').classList.remove('hidden')
     this.DOM('#bet').classList.add('hidden')
     this.DOM('#show').classList.add('hidden')
   }else if(theirSum>21){
     this.DOM('#result').innerText = "You Win!"
     this.DOM('.button').classList.remove('hidden')
     this.DOM('#bet').classList.add('hidden')
     this.DOM('#show').classList.add('hidden')
   }else if(yourSum>theirSum){
     this.DOM('#result').innerText = "You Win!"
     this.DOM('.button').classList.remove('hidden')
     this.DOM('#bet').classList.add('hidden')
     this.DOM('#show').classList.add('hidden')
   }else if(theirSum>yourSum){
     this.DOM('#result').innerText = "You Lose!"
     this.DOM('.button').classList.remove('hidden')
     this.DOM('#bet').classList.add('hidden')
     this.DOM('#show').classList.add('hidden')
   }else if(theirSum===yourSum){
     this.DOM('#result').innerText = "It is a Tie!"
     this.DOM('.button').classList.remove('hidden')
     this.DOM('#bet').classList.add('hidden')
     this.DOM('#show').classList.add('hidden')
 
   }

}

}



let deck1 = new Deck()

deck1.playJackBlack()

deck1.oppCardImages = localStorage.getItem('opponentCards')
deck1.yourCardImages = localStorage.getItem('yourCards')
deck1.newOppImages = localStorage.getItem('newOppImages')
deck1.newYourImages = localStorage.getItem('newYourImages')
deck1.yourTotal  = localStorage.getItem('yourTotal')
deck1.oppTotal = localStorage.getItem('oppTotal')

if(deck1.oppCardImages!==null||deck1.yourCardImages!==null||deck1.oppTotal!==null||deck1.yourTotal!==null){
  deck1.DOM('#yourCards').src = (deck1.yourCardImages.split(','))[0]
  deck1.DOM('#yourCards1').src = (deck1.yourCardImages.split(','))[1]
  deck1.DOM('#OppCards').src = (deck1.oppCardImages.split(','))[0]
  deck1.DOM('#OppCards1').src = (deck1.oppCardImages.split(','))[1]
  deck1.DOM('#yourTotal').innerText = deck1.yourTotal
  deck1.DOM('#theirTotal').innerText = deck1.oppTotal
}

if(deck1.newOppImages!==null||deck1.newYourImages!==null && deck1.newOppImages.length === 1){
  let newCard = document.createElement('img')
  deck1.newOppImages = deck1.newOppImages.split(', ')
  newCard.src = deck1.newOppImages[0]
  deck1.DOM('#yourHand').appendChild(newCard)
  deck1.yourVal.push(data.cards[0].value)
}