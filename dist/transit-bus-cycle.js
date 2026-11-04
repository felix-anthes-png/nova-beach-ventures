export function transitBusCycle(clockMinutes,{cycleMinutes=120,arrivalMinutes=12,dwellMinutes=22,departureMinutes=13}={}){
  const local=((clockMinutes-480)%cycleMinutes+cycleMinutes)%cycleMinutes,arrivalEnd=arrivalMinutes,dwellEnd=arrivalEnd+dwellMinutes,departureEnd=dwellEnd+departureMinutes;
  if(local<arrivalEnd)return {phase:"arriving",visible:true,doorsOpen:false,routeProgress:local/arrivalEnd,passengerProgress:0,passengers:0};
  if(local<dwellEnd){const progress=(local-arrivalEnd)/dwellMinutes;return {phase:"boarding",visible:true,doorsOpen:true,routeProgress:1,passengerProgress:progress,passengers:Math.min(10,Math.floor(progress*12))};}
  if(local<departureEnd)return {phase:"departing",visible:true,doorsOpen:false,routeProgress:1-(local-dwellEnd)/departureMinutes,passengerProgress:1,passengers:0};
  return {phase:"away",visible:false,doorsOpen:false,routeProgress:0,passengerProgress:0,passengers:0};
}

export function transitBusPosition(state,{startX=89.2,stopX=83.1,y=8.55}={}){
  const x=state.phase==="arriving"?startX-(startX-stopX)*state.routeProgress:state.phase==="departing"?startX-(startX-stopX)*state.routeProgress:stopX;
  return {x,y};
}
