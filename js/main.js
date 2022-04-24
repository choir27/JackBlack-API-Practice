// let deck = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
// let deckId = ''
// let draw = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
// let opponentCards

// function DOM(ele){
//   return document.querySelector(ele)
// }
// let oppVal = []
// let yourVal = []

// fetch(deck)
//   .then(res=>res.json())
//   .then(data=>{
//   deckId = data.deck_id
//   DOM('.button').addEventListener('click',drawFour)
//   })

//   function removeAllChildNodes(parent) {
//     while (parent.firstChild) {
//         parent.removeChild(parent.firstChild);
//     }
// }

//   function drawFour(){

//     DOM('#theirTotal').classList.add('hidden')
//     DOM('#OppCards1').src = 'img/back.jpg'
//     removeAllChildNodes(DOM('#OppHand'))
//     removeAllChildNodes(DOM('#yourHand'))
//     DOM('#result').innerText = 'Result'
//     oppVal = []
//     yourVal = []

//     DOM('#show').classList.remove('hidden')
//     DOM('#bet').classList.remove('hidden')

// let drawFour = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`
// fetch(drawFour)
//   .then(res=>res.json())
//   .then(data=>{
//    opponentCards = [data.cards[0].images.png, data.cards[1].images.png]
//    let yourCards = [data.cards[2].images.png, data.cards[3].images.png]

//   DOM('#yourCards').src = yourCards[0]
//   DOM('#yourCards1').src = yourCards[1]
//   DOM('#OppCards').src = opponentCards[0]

//   oppVal.push(data.cards[0].value, data.cards[1].value)
//   yourVal.push(data.cards[2].value, data.cards[3].value)
//   convertNumber(yourVal)
//   DOM('.button').classList.add('hidden')
//   getSum()

//   DOM('#show').addEventListener('click',showCards)
//   DOM('#bet').addEventListener('click',bet)
//   })
//   }

// function showCards(){
// DOM('#OppCards1').src = opponentCards[1]
// DOM('#show').classList.add('hidden')
// DOM('#bet').classList.add('hidden')
// DOM('#theirTotal').classList.remove('hidden')
// getFinalSum()
// DOM('.button').classList.remove('hidden')
// }



// let yourHand = ''

// function bet(){
// let drawTwo= `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
// fetch(drawTwo)
//   .then(res=>res.json())
//   .then(data=>{
  
//   let newCard = document.createElement('img')
//   DOM('#yourHand').appendChild(newCard)
//   newCard.src = data.cards[0].images.png
//   yourVal.push(data.cards[0].value)
//   convertNumber(yourVal)
//   yourHand += data.cards[0].images.png += ', '
//   getSum()

//   let OppHand = ''
//   let newOppCard = document.createElement('img')
//   DOM('#OppHand').appendChild(newOppCard)
//   newOppCard.src = data.cards[1].images.png
//   oppVal.push(data.cards[1].value)
//   convertNumber(oppVal)
//   OppHand += data.cards[1].images.png
//   getSum()

// })
// }


// function convertNumber(arr){
//   return arr.map(ele=>{
//     ele = ele.toLowerCase()
//     if(ele==='jack'||ele==='queen'||ele==='king'){
//       return 10
//     }else if(ele==='ace'){
//      return 11
//     }else{
//       return Number(ele)
//     }
//   })
// }


// function getSum(){
  
//   let yourConverted = convertNumber(yourVal) 
//   let oppConverted = convertNumber(oppVal)

//   let yourSum = yourConverted.reduce((a,b)=>{
// return a+b
//   },0)
//   DOM('#yourTotal').innerText = yourSum


//   let theirSum = oppConverted.reduce((a,b)=>{
// return a+b
//   },0)

//   DOM('#theirTotal').innerText = theirSum

//   if(yourSum>21){
//     DOM('#result').innerText = "You Lose!"
//     DOM('.button').classList.remove('hidden')
//   }else if(theirSum>21){
//     DOM('#result').innerText = "You Win!"
//     DOM('.button').classList.remove('hidden')
//   }
 
// }

// function getFinalSum(){
//   let yourConverted = convertNumber(yourVal) 
//   let oppConverted = convertNumber(oppVal)

//   let yourSum = yourConverted.reduce((a,b)=>{
// return a+b
//   },0)
//   DOM('#yourTotal').innerText = yourSum


//   let theirSum = oppConverted.reduce((a,b)=>{
// return a+b
//   },0)

//   DOM('#theirTotal').innerText = theirSum
//   if(yourSum>21){
//     DOM('#result').innerText = "You Lose!"
//     DOM('.button').classList.remove('hidden')
//   }else if(theirSum>21){
//     DOM('#result').innerText = "You Win!"
//     DOM('.button').classList.remove('hidden')
//   }else if(yourSum>theirSum){
//     DOM('#result').innerText = "You Win!"
//     DOM('.button').classList.remove('hidden')
//   }else if(theirSum>yourSum){
//     DOM('#result').innerText = "You Lose!"
//     DOM('.button').classList.remove('hidden')
//   }else if(theirSum===yourSum){
//     DOM('#result').innerText = "It is a Tie!"
//     DOM('.button').classList.remove('hidden')

//   }
// }

