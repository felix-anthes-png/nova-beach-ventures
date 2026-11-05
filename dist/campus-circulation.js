export const CAMPUS_ARRIVAL_GATES = Object.freeze({
  main: Object.freeze({ id:"main", label:"Main campus entrance", x:2.2, y:14.8 }),
  beach: Object.freeze({ id:"beach", label:"Beach promenade entrance", x:8, y:21.4 }),
  transit: Object.freeze({ id:"transit", label:"Transit arrival", x:87.2, y:14.4 })
});

export const CAMPUS_ROUTE_SPINE = Object.freeze([
  Object.freeze({x:39.5,y:16.05}),
  Object.freeze({x:49,y:16.05}),
  Object.freeze({x:59.5,y:16.05}),
  Object.freeze({x:69,y:16.05}),
  Object.freeze({x:78.5,y:16.05}),
  Object.freeze({x:87,y:16.05})
]);

const CORE_STOPS = new Set(["arrival","academy","courtyard","terrace","foodCourt","hub","eventSquare"]);

export function campusAgendaPhase(minutes){
  if(minutes<570)return "arrival";
  if(minutes<690)return "lecture";
  if(minutes<825)return "lunch";
  if(minutes<990)return "afternoon";
  if(minutes<1110)return "sunset";
  return "evening";
}

export function arrivalGateForGuest({groupId,cohortId=0,transitUnlocked=false}){
  if(groupId==="commuter"&&transitUnlocked)return CAMPUS_ARRIVAL_GATES.transit;
  if(groupId==="surfer"&&cohortId%3===0)return CAMPUS_ARRIVAL_GATES.beach;
  if(groupId==="tourist"&&cohortId%4===0)return CAMPUS_ARRIVAL_GATES.beach;
  return CAMPUS_ARRIVAL_GATES.main;
}

export function agendaStopsForGuest({groupId,clockMinutes,seed=0,activeEvent=false}){
  const phase=campusAgendaPhase(clockMinutes);
  const directBeach=(groupId==="surfer"&&seed%3===0)||(groupId==="tourist"&&seed%4===0);
  if(directBeach)return {phase,label:"Direct beach visit",stops:["promenade"]};
  if(phase==="arrival")return {phase,label:"Morning arrival",stops:["arrival","academy"]};
  if(phase==="lecture")return {phase,label:"Lecture block",stops:[groupId==="staff"||groupId==="professor"?"courtyard":"academy"]};
  if(phase==="lunch")return {phase,label:"Lunch crossing",stops:["courtyard","foodCourt"]};
  if(phase==="afternoon")return {phase,label:"Afternoon campus life",stops:[groupId==="founder"||groupId==="corporate"?"hub":"courtyard"]};
  if(phase==="sunset")return {phase,label:"Sunset migration",stops:activeEvent?["courtyard","eventSquare"]:["courtyard","promenade"]};
  return {phase,label:"Evening campus life",stops:[groupId==="resident"?"hub":"promenade"]};
}

export function isCentralAgendaStop(stopId){return CORE_STOPS.has(stopId);}

export function campusSpineWaypoints(start,target){
  const fromEast=start.x>41,toEast=target.x>41;
  if(fromEast===toEast)return [];
  const usable=CAMPUS_ROUTE_SPINE.filter(point=>point.x<=Math.max(start.x,target.x)+.4);
  return fromEast?[...usable].reverse():usable;
}

export function visibleGuestLimit(companyLevel=1){
  if(companyLevel>=8)return 72;
  if(companyLevel>=5)return 60;
  return 48;
}
