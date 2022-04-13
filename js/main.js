let deck = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
let deckId = ''
let draw = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
let opponentCards
function DOM(ele){
  return document.querySelector(ele)
}
let oppVal = []
let yourVal = []


fetch(deck)
  .then(res=>res.json())
  .then(data=>{
  deckId = data.deck_id
  DOM('.button').addEventListener('click',drawFour)
  })


  function drawFour(){
    DOM('#show').classList.remove('hidden')
    DOM('#bet').classList.remove('hidden')

let drawFour = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`
fetch(drawFour)
  .then(res=>res.json())
  .then(data=>{
   opponentCards = [data.cards[0].images.png, data.cards[1].images.png]
   let yourCards = [data.cards[2].images.png, data.cards[3].images.png]
  DOM('#yourCards').src = yourCards[0]
  DOM('#yourCards1').src = yourCards[1]

  oppVal.push(data.cards[0].value, data.cards[1].value)
  yourVal.push(data.cards[2].value, data.cards[3].value)

  DOM('.button').remove()

  
  DOM('#show').addEventListener('click',showCards)
  DOM('#bet').addEventListener('click',bet)
  })
  }

function showCards(){
DOM('#OppCards').src = opponentCards[0]
DOM('#OppCards1').src = opponentCards[1]
DOM('#show').remove()
DOM('#bet').remove()
getSum()
}

function bet(){
let drawOne = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
fetch(drawOne)
  .then(res=>res.json())
  .then(data=>{
  let newCard = document.createElement('img')
  DOM('#yourHand').appendChild(newCard)
  newCard.src = data.cards[0].images.png
  yourVal.push(data.cards[0].value)
})
}

function convertNumber(){
  yourVal.forEach(ele=>{
    ele = ele.toLowerCase()
    console.log(ele)
    if(ele==='jack'||ele==='queen'||ele==='king'){
      return 10
    }else if(ele==='ace'){
      return 11
    }else{
      return Number(ele)
    }
  })
  oppVal.forEach(ele=>{
    ele = ele.toLowerCase()
    if(ele==='jack'||ele==='queen'||ele==='king'){
      return 10
    }else if(ele==='ace'){
      return 11
    }else{
      return Number(ele)
    }
  })
}

function getSum(){
  DOM('#yourTotal').classList.remove('hidden')
  DOM('#theirTotal').classList.remove('hidden')
  convertNumber()
console.log(yourVal)
//   let yourSum = yourVal.reduce((a,b)=>{
// return a+b
//   },0)
//   DOM('#yourTotal').innerText = yourSum
//   let theirSum = oppVal.reduce((a,b)=>{
// return a+b
//   },0)
  // DOM('#theirTotal').innerText = theirSum
}