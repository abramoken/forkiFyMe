/**Generates a unique id */
// function uniqueid(){
//     // always start with a letter (for DOM friendlyness)
//     var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
//     do {
//         // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
//         var ascicode=Math.floor((Math.random()*42)+48);
//         if (ascicode<58 || ascicode>64){
//             // exclude all chars between : (58) and @ (64)
//             idstr+=String.fromCharCode(ascicode);
//         }
//     } while (idstr.length<32);

//     return (idstr);
// }

/**Generates a unique id */
let uid = (function() {
  let id = 0;
  return function() {
    if (arguments[0] === 0) id = 0;
    return id++;
  };
})();

export default class List {
  constructor() {
    this.items = [];
  }
  addItem(count, unit, ingredient) {
    const item = {
      id: uid(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item;
  }
  deleteItem(id) {
    const index = this.items.findIndex(el => el.id === id);
    //[2,4,8] splice(1,2) -> returns [4,8], original array is [2] it mutates the array
    //[2,4,8] slice(1,2) -> returns 4, original array is [2,4,8] it does not mutate the array
    this.items.splice(index, 1);
  }
  updateCount(count, id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
  }
}
