//console.log('yo');
import { BasicEvaluator } from "./evaluators/basic.js";

//const hand = ["2S", "2C", "3D", "4H", "5S", "6C", "6D"];
//const hand = ["2S", "2C", "3D", "4H", "5S", "AC", "7D"];
//const hand = ["2C", "3D", "4H"];
//const hand = ["2C", "3D", "5H"];
//const hand = ["2C", "3D", "AH"];
const hand = ["2H", "3H", "AH", "4H", "5H"];


const ev = new BasicEvaluator(hand);

console.log(ev.has_straight_flush());
