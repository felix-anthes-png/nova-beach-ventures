export const INITIAL_CASH = 10000;
export const SHOWCASE_BUDGET = 25000000;
export const VENUE_PROJECT_DURATIONS = Object.freeze({ open: 90, upgrade2: 120, upgrade3: 180, refit: 75 });
export const STORAGE_KEY = "nova-beach-ventures-v1";
export const DAY_START = 450;
export const DAY_END = 1170;

export const CAMPUS_DAY_PHASES = Object.freeze([
  {id:"arrival",name:"Morning arrival",short:"ARRIVAL",start:450,end:570,multiplier:2.15,color:"#f6c868",description:"Students stream through the gates before first lectures."},
  {id:"lecture-am",name:"Lecture block",short:"LECTURES",start:570,end:690,multiplier:.48,color:"#7eb7c5",description:"Most students are in class; queues settle and operators restock."},
  {id:"lunch",name:"Lunch rush",short:"LUNCH RUSH",start:690,end:840,multiplier:2.55,color:"#ff8a61",description:"The whole campus spills onto the promenade for food and drinks."},
  {id:"lecture-pm",name:"Afternoon lectures",short:"LECTURES",start:840,end:990,multiplier:.58,color:"#73a9bd",description:"Footfall falls while the second lecture block is running."},
  {id:"break",name:"Afternoon break",short:"BREAK",start:990,end:1050,multiplier:1.75,color:"#b9dc69",description:"A compact rush forms between the last classes of the day."},
  {id:"sunset",name:"Sunset social",short:"SUNSET",start:1050,end:1170,multiplier:1.3,color:"#ec765f",description:"The campus moves toward the beach, bars and live events."}
]);

export const GUEST_GROUPS = Object.freeze([
  {id:"student",name:"Students",short:"Student",icon:"S",color:"#bce65f",budget:[700,2600],patience:[32,88],priceTolerance:.92,preferences:{food:.72,drinks:.76,shopping:.48,social:.8,excitement:.62,calm:.48,intensity:52},schedule:{arrival:1.5,"lecture-am":.34,lunch:1.55,"lecture-pm":.38,break:1.48,sunset:1.08}},
  {id:"professor",name:"Professors",short:"Professor",icon:"P",color:"#7e9ec5",budget:[1500,4200],patience:[48,90],priceTolerance:1.12,preferences:{food:.66,drinks:.82,shopping:.28,social:.42,excitement:.24,calm:.88,intensity:30},schedule:{arrival:.92,"lecture-am":.46,lunch:1.1,"lecture-pm":.5,break:.78,sunset:.32}},
  {id:"staff",name:"Campus staff",short:"Staff",icon:"N",color:"#64cbc8",budget:[1100,3300],patience:[58,94],priceTolerance:1.02,preferences:{food:.74,drinks:.7,shopping:.24,social:.4,excitement:.24,calm:.62,intensity:34},schedule:{arrival:1.1,"lecture-am":.9,lunch:1.25,"lecture-pm":.92,break:.85,sunset:.48}},
  {id:"tourist",name:"Tourists",short:"Tourist",icon:"T",color:"#ff9b61",budget:[2200,6200],patience:[36,78],priceTolerance:1.32,preferences:{food:.72,drinks:.76,shopping:.82,social:.64,excitement:.72,calm:.34,intensity:58},schedule:{arrival:.28,"lecture-am":.62,lunch:1.02,"lecture-pm":1.08,break:1.2,sunset:1.55}},
  {id:"surfer",name:"Surfers",short:"Surfer",icon:"≈",color:"#479fb5",budget:[1200,4400],patience:[24,72],priceTolerance:1.08,preferences:{food:.62,drinks:.8,shopping:.66,social:.72,excitement:.94,calm:.22,intensity:76},schedule:{arrival:1.18,"lecture-am":.72,lunch:1.02,"lecture-pm":.9,break:1.24,sunset:1.5}},
  {id:"corporate",name:"Corporate guests",short:"Corporate",icon:"C",color:"#9a7bc1",budget:[3500,9000],patience:[62,96],priceTolerance:1.55,preferences:{food:.7,drinks:.72,shopping:.56,social:.68,excitement:.38,calm:.72,intensity:38},schedule:{arrival:1.05,"lecture-am":1.16,lunch:1.35,"lecture-pm":1.12,break:.78,sunset:.52}},
  {id:"local",name:"Local residents",short:"Local",icon:"L",color:"#f5c95e",budget:[1600,4800],patience:[40,86],priceTolerance:1.18,preferences:{food:.78,drinks:.74,shopping:.42,social:.76,excitement:.58,calm:.48,intensity:48},schedule:{arrival:.3,"lecture-am":.46,lunch:.9,"lecture-pm":.78,break:1.2,sunset:1.62}},
  {id:"family",name:"Families",short:"Family",icon:"F",color:"#ed7458",budget:[2600,7600],patience:[46,84],priceTolerance:1.2,preferences:{food:.82,drinks:.58,shopping:.54,social:.82,excitement:.44,calm:.72,intensity:28},schedule:{arrival:.38,"lecture-am":.72,lunch:1.2,"lecture-pm":1.08,break:1.28,sunset:.72}},
  {id:"resident",name:"Village residents",short:"Resident",icon:"V",color:"#d58b68",budget:[1200,4300],patience:[44,88],priceTolerance:1.08,preferences:{food:.78,drinks:.62,shopping:.48,social:.82,excitement:.34,calm:.68,intensity:34},schedule:{arrival:.35,"lecture-am":.55,lunch:.92,"lecture-pm":.68,break:1.1,sunset:1.72}},
  {id:"founder",name:"Founders",short:"Founder",icon:"I",color:"#a58bd0",budget:[3600,9800],patience:[58,94],priceTolerance:1.62,preferences:{food:.68,drinks:.86,shopping:.72,social:.74,excitement:.42,calm:.76,intensity:42},schedule:{arrival:1.1,"lecture-am":1.24,lunch:1.28,"lecture-pm":1.2,break:.9,sunset:.66}},
  {id:"athlete",name:"Club athletes",short:"Athlete",icon:"R",color:"#70b979",budget:[1800,5600],patience:[34,78],priceTolerance:1.16,preferences:{food:.72,drinks:.9,shopping:.68,social:.66,excitement:.82,calm:.24,intensity:78},schedule:{arrival:1.2,"lecture-am":.72,lunch:1.05,"lecture-pm":.82,break:1.4,sunset:1.18}},
  {id:"commuter",name:"Commuters",short:"Commuter",icon:"↗",color:"#779eb8",budget:[1300,4700],patience:[18,58],priceTolerance:1.12,preferences:{food:.64,drinks:.78,shopping:.38,social:.24,excitement:.18,calm:.34,intensity:38},schedule:{arrival:1.9,"lecture-am":.45,lunch:1.12,"lecture-pm":.5,break:1.18,sunset:1.5}}
]);

export const CAMPUS_CALENDAR = Object.freeze([
  {id:"lecture",name:"Lecture Day",short:"LECTURES",icon:"A",color:"#64cbc8",attendance:1,description:"Predictable student traffic with strong arrival, lunch and break peaks.",focus:"Coffee, fast food and queue coverage",groups:{student:52,professor:12,staff:14,tourist:6,surfer:5,corporate:2,local:7,family:2},phaseMultipliers:{}},
  {id:"exam",name:"Exam Day",short:"EXAMS",icon:"✎",color:"#7e9ec5",attendance:.92,description:"Quieter paths but urgent demand for caffeine, calm spaces and reliable service.",focus:"Coffee, calm facilities and long opening hours",groups:{student:61,professor:15,staff:13,tourist:2,surfer:2,corporate:1,local:5,family:1},phaseMultipliers:{arrival:1.12,"lecture-am":.72,lunch:.86,"lecture-pm":.72,break:1.2,sunset:.58}},
  {id:"career",name:"Career Fair",short:"CAREER FAIR",icon:"◇",color:"#9a7bc1",attendance:1.2,description:"Corporate visitors join students and spend more on premium food and merchandise.",focus:"Premium pricing, merchandise and staffed queues",groups:{student:36,professor:7,staff:12,tourist:3,surfer:1,corporate:32,local:7,family:2},phaseMultipliers:{arrival:1.08,"lecture-am":1.22,lunch:1.25,"lecture-pm":1.18,break:1.08,sunset:.82}},
  {id:"open",name:"Campus Open Day",short:"OPEN DAY",icon:"◎",color:"#f5c95e",attendance:1.28,description:"Families and visitors stay longer and put pressure on food, seating and restrooms.",focus:"Food, seating, water and restroom capacity",groups:{student:20,professor:8,staff:13,tourist:18,surfer:3,corporate:4,local:8,family:26},phaseMultipliers:{arrival:.88,"lecture-am":1.12,lunch:1.3,"lecture-pm":1.22,break:1.18,sunset:.94}},
  {id:"surf",name:"Surf Tournament",short:"SURF CUP",icon:"≈",color:"#479fb5",attendance:1.34,description:"Surfers, tourists and locals pull the crowd toward the promenade and ocean pier.",focus:"Beach drinks, surf retail and late staffing",groups:{student:16,professor:2,staff:8,tourist:24,surfer:35,corporate:1,local:12,family:2},phaseMultipliers:{arrival:1.08,"lecture-am":1.04,lunch:1.16,"lecture-pm":1.2,break:1.34,sunset:1.5}},
  {id:"festival",name:"Festival Evening",short:"FESTIVAL",icon:"♫",color:"#ff8060",attendance:1.42,description:"A moderate daytime builds into the busiest sunset crowd of the week.",focus:"Events, food, drinks and evening operations",groups:{student:34,professor:3,staff:8,tourist:14,surfer:8,corporate:2,local:25,family:6},phaseMultipliers:{arrival:.7,"lecture-am":.72,lunch:1.02,"lecture-pm":1.05,break:1.42,sunset:2.05}},
  {id:"weekend",name:"Coastal Weekend",short:"WEEKEND",icon:"☀",color:"#f2b94b",attendance:1.08,description:"Academic traffic falls while tourists, surfers, locals and families take over.",focus:"Leisure venues and afternoon opening hours",groups:{student:8,professor:2,staff:7,tourist:24,surfer:23,corporate:1,local:22,family:13},phaseMultipliers:{arrival:.42,"lecture-am":.78,lunch:1.15,"lecture-pm":1.2,break:1.35,sunset:1.48}}
]);

export function calendarDay(run,offset=0){const day=Math.max(1,Math.floor((run?.currentDay||1)+offset)),index=(day-1)%CAMPUS_CALENDAR.length,week=Math.floor((day-1)/CAMPUS_CALENDAR.length)+1;return {...CAMPUS_CALENDAR[index],day,index,week};}

const DISTRICT_GUEST_WEIGHTS=Object.freeze({village:{resident:22,student:8,local:4},east:{surfer:18,tourist:10,local:5},innovation:{founder:22,corporate:13,student:4},sports:{athlete:24,student:5,local:4},transit:{commuter:28,tourist:5,staff:4}});
export function guestGroupMix(run,minutes=run?.clockMinutes??DAY_START,offset=0){
  const day=calendarDay(run,offset),phase=campusPhase(minutes),districtWeights={};for(const [districtId,weights] of Object.entries(DISTRICT_GUEST_WEIGHTS))if(run?.districts?.[districtId])for(const [groupId,value] of Object.entries(weights))districtWeights[groupId]=(districtWeights[groupId]||0)+value;
  const rows=GUEST_GROUPS.map(group=>({groupId:group.id,name:group.name,short:group.short,icon:group.icon,color:group.color,weight:((day.groups[group.id]||0)+(districtWeights[group.id]||0))*(group.schedule[phase.id]||1)})),total=rows.reduce((sum,row)=>sum+row.weight,0)||1;
  return rows.map(row=>({...row,share:row.weight/total,count:Math.round(row.weight/total*100)})).sort((a,b)=>b.share-a.share);
}

export function selectGuestGroup(run,seed=0,minutes=run?.clockMinutes??DAY_START){const mix=guestGroupMix(run,minutes),roll=((Math.sin((seed+1)*73.17)*43758.5453)%1+1)%1;let cursor=0;for(const row of mix){cursor+=row.share;if(roll<=cursor)return GUEST_GROUPS.find(group=>group.id===row.groupId);}return GUEST_GROUPS[0];}

export function calendarForecast(run,offset=0){const projected={...run,currentDay:Math.max(1,(run?.currentDay||1)+offset)},day=calendarDay(projected),metrics=campusMetrics(projected),groups=guestGroupMix(projected,720).map(row=>({...row,expected:Math.round(metrics.guests*row.share)}));return {day,expectedGuests:metrics.guests,rating:metrics.rating,groups};}

export const DEFAULT_STORE_HOURS = Object.freeze({
  cafe:{open:450,close:1080}, snack:{open:540,close:1140}, merch:{open:600,close:1050}, beach:{open:660,close:1170}, surf:{open:510,close:1110}
});

export const STORE_DAILY_BASE_COSTS = Object.freeze({ cafe:120, snack:160, merch:150, beach:220, surf:280 });
export const DISTRICT_DAILY_COSTS = Object.freeze({ coast:0, village:180, east:320, innovation:520, sports:430, transit:610, pier:0 });

export const DELIVERY_WINDOWS = Object.freeze([
  {id:"morning",minute:495,label:"Morning van"},
  {id:"midday",minute:735,label:"Midday cargo bike"},
  {id:"afternoon",minute:975,label:"Afternoon van"}
]);

export const FACILITY_CATALOGUE = Object.freeze([
  { id:"path", name:"Promenade Tile", icon:"▦", cost:100, color:"#c9c9b9", description:"Extend the walkable campus route one tile at a time.", needs:{} },
  { id:"scenery", name:"Palm Planter", icon:"♧", cost:300, color:"#5aa86a", description:"Scenery that makes the campus feel more welcoming.", needs:{ mood:3 } },
  { id:"bench", name:"Atlantic Bench", icon:"▰", cost:500, color:"#d7a968", description:"Rest spot that restores energy and mood.", needs:{ energy:10, mood:7 } },
  { id:"bin", name:"Recycling Point", icon:"♻", cost:400, color:"#70bd77", description:"Keeps paths clean and protects the campus rating.", needs:{ cleanliness:13 } },
  { id:"water", name:"Water Fountain", icon:"◒", cost:900, color:"#68cbd8", description:"A free refill point for thirsty students.", needs:{ thirst:18 } },
  { id:"restroom", name:"Restroom Pod", icon:"WC", cost:1600, color:"#7e9ec5", description:"Essential relief for longer campus visits.", needs:{ bladder:22, cleanliness:4 } },
  { id:"foodGarden", name:"Food Garden", icon:"✦", cost:2200, color:"#f2a65f", description:"A social food court that tackles hunger and mood.", needs:{ hunger:20, mood:8 } }
]);

export const FACILITY_FOOTPRINTS = Object.freeze({
  path:{width:1,height:1}, scenery:{width:1.1,height:1.1}, bench:{width:1.8,height:.8},
  bin:{width:1,height:1}, water:{width:1.2,height:1.2}, restroom:{width:1.7,height:1.45},
  foodGarden:{width:2.7,height:2.1}, experience:{width:3.7,height:2.55}
});

export const STAFF_CATALOGUE = Object.freeze([
  { id:"service", name:"Queue Lead", icon:"↗", color:"#bce65f", cost:900, wage:360, level:2, description:"Works a venue district and speeds up its live shop queues." },
  { id:"caretaker", name:"Campus Caretaker", icon:"⌁", color:"#64cbc8", cost:1000, wage:320, level:2, description:"Patrols one district and clears litter before rating falls." },
  { id:"technician", name:"Experience Technician", icon:"⚙", color:"#f5c95e", cost:1200, wage:440, level:3, description:"Repairs failed stores and amenities so they can reopen." },
  { id:"host", name:"Student Host", icon:"◎", color:"#ff8060", cost:1400, wage:380, level:4, description:"Guides visitors in one district while their shift is active." },
  { id:"entertainer", name:"Coast Entertainer", icon:"★", color:"#9a7bc1", cost:1800, wage:480, level:6, description:"Builds mood and event energy during an assigned shift." }
]);

export const STAFF_SHIFTS = Object.freeze([
  {id:"morning",name:"Morning",start:450,end:810,wageFactor:.7,label:"07:30–13:30"},
  {id:"full",name:"Full day",start:450,end:1170,wageFactor:1,label:"07:30–19:30"},
  {id:"late",name:"Late",start:810,end:1170,wageFactor:.7,label:"13:30–19:30"}
]);

export const OPERATIONS_DISTRICTS = Object.freeze([
  {id:"coast",name:"Academic Core",color:"#64cbc8"},
  {id:"village",name:"Student Village",color:"#d58b68"},
  {id:"east",name:"Beachfront",color:"#f2b94b"},
  {id:"innovation",name:"Innovation District",color:"#a58bd0"},
  {id:"sports",name:"Sports Campus",color:"#70b979"},
  {id:"transit",name:"Transit & Arrival",color:"#779eb8"},
  {id:"pier",name:"Ocean Pier",color:"#479fb5",legacy:true}
]);

export const EXPERIENCE_MODULES = Object.freeze([
  { id:"music", name:"Live DJ Deck", icon:"♫", cost:600, excitement:18, intensity:5, comfort:1 },
  { id:"sunset", name:"Sunset Lookout", icon:"☀", cost:900, excitement:27, intensity:13, comfort:4 },
  { id:"shade", name:"Canvas Shade", icon:"⌂", cost:700, excitement:4, intensity:0, comfort:23 },
  { id:"social", name:"Social Seating", icon:"◎", cost:500, excitement:9, intensity:1, comfort:16 },
  { id:"surf", name:"Surf Simulator", icon:"≈", cost:1200, excitement:36, intensity:34, comfort:-9 }
]);

export const STORES = Object.freeze([
  { id: "cafe", name: "Atlantic Café", short: "Café", icon: "☕", color: "#ff815d", pitch: "Coffee and quick campus comfort." },
  { id: "snack", name: "Beach Fuel Bar", short: "Fuel Bar", icon: "◉", color: "#b3dc65", pitch: "Fresh snacks for the promenade crowd." },
  { id: "merch", name: "Nova Merch Lab", short: "Merch Lab", icon: "◆", color: "#67c7c4", pitch: "Campus gear with stronger margins." },
  { id: "beach", name: "Maré Beach Bar", short: "Beach Bar", icon: "☀", color: "#f2b94b", pitch: "Cold coastal drinks on the expanded eastern promenade." },
  { id: "surf", name: "Carcavelos Surf Shack", short: "Surf Shack", icon: "≈", color: "#479fb5", pitch: "Beach essentials and surf-day rentals beside the new pier." }
]);

export const SPECIALIZATION_FOCUSES = Object.freeze([
  {id:"flow",name:"Flow",color:"#64cbc8",icon:"↗",description:"Faster service and shorter queues."},
  {id:"wellbeing",name:"Wellbeing",color:"#bce65f",icon:"○",description:"More comfort, stronger needs and longer visits."},
  {id:"experience",name:"Experience",color:"#ff8060",icon:"✦",description:"More destination appeal and campus identity."}
]);

export const STORE_SPECIALIZATIONS = Object.freeze([
  {id:"cafe-express",storeId:"cafe",name:"Lecture Express",focus:"flow",cost:1200,service:1.25,appeal:3,operating:90,needs:{energy:2},description:"A high-throughput counter tuned for the rush between lectures."},
  {id:"cafe-study",storeId:"cafe",name:"Study House",focus:"wellbeing",cost:1400,service:1.02,appeal:9,operating:120,needs:{energy:4,mood:3},description:"Quiet tables, charging points and longer, calmer visits."},
  {id:"cafe-roastery",storeId:"cafe",name:"Atlantic Roastery",focus:"experience",cost:1700,service:.94,appeal:17,operating:180,needs:{mood:5},description:"A premium coffee ritual that turns the café into a destination."},
  {id:"snack-express",storeId:"snack",name:"Grab & Go",focus:"flow",cost:1500,service:1.28,appeal:3,operating:110,needs:{hunger:2},description:"Pre-built bowls and a fast pickup lane for peak periods."},
  {id:"snack-wellness",storeId:"snack",name:"Wellness Kitchen",focus:"wellbeing",cost:1800,service:1,appeal:10,operating:150,needs:{hunger:5,energy:3},description:"Healthy campus food with a stronger satisfaction effect."},
  {id:"snack-social",storeId:"snack",name:"Fuel Social",focus:"experience",cost:2100,service:.95,appeal:18,operating:210,needs:{mood:5},description:"A colourful social counter designed to pull people together."},
  {id:"merch-click",storeId:"merch",name:"Campus Click & Collect",focus:"flow",cost:1900,service:1.22,appeal:5,operating:130,needs:{},description:"A compact collection desk that processes shoppers quickly."},
  {id:"merch-essentials",storeId:"merch",name:"Student Essentials",focus:"wellbeing",cost:2200,service:1.04,appeal:11,operating:160,needs:{mood:3},description:"Useful campus goods with a friendly, practical identity."},
  {id:"merch-drops",storeId:"merch",name:"Nova Limited Drops",focus:"experience",cost:2700,service:.92,appeal:21,operating:240,needs:{mood:6},description:"Limited collections create buzz and destination shopping."},
  {id:"beach-service",storeId:"beach",name:"Promenade Service",focus:"flow",cost:2200,service:1.3,appeal:4,operating:160,needs:{thirst:2},description:"A dual-sided bar built to absorb the sunset queue."},
  {id:"beach-lounge",storeId:"beach",name:"Mare Lounge",focus:"wellbeing",cost:2600,service:1,appeal:13,operating:210,needs:{thirst:4,mood:4},description:"Shade, seating and coastal comfort keep guests on campus."},
  {id:"beach-sunset",storeId:"beach",name:"Sunset Club",focus:"experience",cost:3200,service:.9,appeal:24,operating:320,needs:{mood:8},description:"A landmark evening concept that thrives around events."},
  {id:"surf-rental",storeId:"surf",name:"Fast Rental Dock",focus:"flow",cost:2500,service:1.24,appeal:6,operating:180,needs:{},description:"Pre-sized equipment and a rapid return lane improve throughput."},
  {id:"surf-local",storeId:"surf",name:"Local Surf Base",focus:"wellbeing",cost:2900,service:1.01,appeal:14,operating:230,needs:{energy:3,mood:4},description:"Beginner guidance and local knowledge build confidence."},
  {id:"surf-pro",storeId:"surf",name:"Atlantic Pro Shop",focus:"experience",cost:3500,service:.92,appeal:25,operating:350,needs:{mood:7},description:"Specialist gear and a bold identity attract surf enthusiasts."}
]);

export const FACILITY_SPECIALIZATIONS = Object.freeze([
  {id:"scenery-shade",type:"scenery",name:"Shade Grove",focus:"wellbeing",cost:350,appeal:5,needs:{energy:4,mood:3},description:"Dense coastal planting creates a cooler recovery point."},
  {id:"scenery-landmark",type:"scenery",name:"Campus Landmark",focus:"experience",cost:450,appeal:10,needs:{mood:5},description:"Graphic planting and a marker create a memorable meeting point."},
  {id:"bench-study",type:"bench",name:"Study Nook",focus:"wellbeing",cost:500,appeal:6,needs:{energy:7,mood:2},description:"Shade and charging turn a bench into a productive pause."},
  {id:"bench-social",type:"bench",name:"Social Steps",focus:"experience",cost:650,appeal:11,needs:{mood:7},description:"Grouped seating encourages visible campus life."},
  {id:"bin-sort",type:"bin",name:"Rapid Sort Point",focus:"flow",cost:350,appeal:3,needs:{cleanliness:7},description:"Clear sorting and a larger opening reduce litter pressure."},
  {id:"bin-eco",type:"bin",name:"Circular Campus Hub",focus:"wellbeing",cost:500,appeal:7,needs:{cleanliness:9,mood:2},description:"A planted recycling hub makes sustainability visible."},
  {id:"water-fast",type:"water",name:"Bottle Express",focus:"flow",cost:600,appeal:4,needs:{thirst:8},description:"Multiple taps serve more guests during short breaks."},
  {id:"water-calm",type:"water",name:"Hydration Garden",focus:"wellbeing",cost:800,appeal:9,needs:{thirst:10,mood:3},description:"Refill taps, shade and planting form a calmer stop."},
  {id:"restroom-capacity",type:"restroom",name:"High-Capacity Pod",focus:"flow",cost:900,appeal:4,needs:{bladder:12},description:"An extra module keeps relief queues moving at lunch."},
  {id:"restroom-comfort",type:"restroom",name:"Comfort Suite",focus:"wellbeing",cost:1100,appeal:9,needs:{bladder:8,cleanliness:7,mood:2},description:"Better finish, accessibility and care raise campus comfort."},
  {id:"garden-market",type:"foodGarden",name:"Quick Market Hall",focus:"flow",cost:1200,appeal:8,needs:{hunger:9},description:"A clear service spine moves guests through food stalls quickly."},
  {id:"garden-courtyard",type:"foodGarden",name:"Social Courtyard",focus:"experience",cost:1500,appeal:16,needs:{hunger:5,mood:9},description:"Shared tables and a small stage create an all-day destination."}
]);

export const STORE_UNLOCKS = Object.freeze({ cafe:0, snack:12000, merch:28000, beach:40000, surf:65000 });
export const STORE_REQUIREMENTS = Object.freeze({ cafe:1, snack:2, merch:4, beach:6, surf:8 });
export const DISTRICT_CATALOGUE = Object.freeze([
  {id:"village",name:"Student Village",level:3,cost:26000,color:"#d58b68",icon:"⌂",problem:"Evening economy",rhythm:"Evenings and weekends",description:"Residential demand arrives after lectures. Build useful, affordable services that remain viable beyond the lunch rush.",features:["Mini-market and laundrette","Late-night takeaway","Gym and study lounge","Resident guest group"]},
  {id:"east",name:"Beachfront",level:5,cost:45000,color:"#f2b94b",icon:"☀",problem:"Weather exposure",rhythm:"Afternoons and sunset",description:"A leisure strip whose sales swing with coastal conditions, events and late staffing.",features:["Beach bar and surf rental","Ice-cream and seafood","Volleyball courts","Tourist and surfer traffic"]},
  {id:"innovation",name:"Innovation District",level:7,cost:72000,color:"#a58bd0",icon:"◇",problem:"Premium expectations",rhythm:"Weekdays and corporate events",description:"High-spending business visitors expect excellent service, calm spaces and professional event capacity.",features:["Coworking café and tech shop","Startup incubator","Conference centre","Founder guest group"]},
  {id:"sports",name:"Sports Campus",level:8,cost:88000,color:"#70b979",icon:"R",problem:"Peak capacity",rhythm:"Training blocks and tournaments",description:"Club traffic arrives in sharp waves and creates strong demand for hydration, recovery and specialist retail.",features:["Fitness and smoothie venues","Sports shop","Padel courts","Athlete guest group"]},
  {id:"transit",name:"Transit & Arrival",level:9,cost:110000,color:"#779eb8",icon:"↗",problem:"Traffic and logistics",rhythm:"Arrival and departure peaks",description:"The busiest gateway increases campus capacity but requires clean routes and reliable delivery access.",features:["Parking and bus interchange","Bicycle station","Grab-and-go bakery","Commuter guest group"]}
]);

export const DISTRICT_BUSINESSES = Object.freeze([
  {id:"village-market",districtId:"village",name:"Nova Mini-Market",icon:"▦",cost:12000,upkeep:90,income:520,appeal:5,problem:"Daily essentials",description:"Reliable residential shopping throughout the evening."},
  {id:"village-laundry",districtId:"village",name:"Wave Laundrette",icon:"○",cost:9500,upkeep:70,income:360,appeal:3,problem:"Utility demand",description:"A steady service that performs best after lectures."},
  {id:"village-takeaway",districtId:"village",name:"After Class Takeaway",icon:"◉",cost:16000,upkeep:130,income:740,appeal:8,problem:"Late queues",description:"Fast evening food for residents and student groups."},
  {id:"village-gym",districtId:"village",name:"Village Gym",icon:"R",cost:22000,upkeep:190,income:820,appeal:10,problem:"Peak capacity",description:"Membership income with strong morning and evening peaks."},
  {id:"village-study",districtId:"village",name:"Night Study Lounge",icon:"A",cost:14000,upkeep:105,income:430,appeal:9,problem:"Quiet capacity",description:"Long-stay study space that improves residential appeal."},
  {id:"beach-bar",districtId:"east",name:"Maré Beach Bar",icon:"☀",cost:40000,upkeep:220,income:1120,appeal:14,problem:"Weather",description:"The established sunset anchor of the beachfront."},
  {id:"beach-surf",districtId:"east",name:"Surf Rental",icon:"≈",cost:28000,upkeep:180,income:860,appeal:12,problem:"Weather",description:"Boards and wetsuits for tourists and club surfers."},
  {id:"beach-icecream",districtId:"east",name:"Gelado Kiosk",icon:"●",cost:13000,upkeep:95,income:610,appeal:7,problem:"Weather",description:"A compact high-margin warm-weather kiosk."},
  {id:"beach-seafood",districtId:"east",name:"Atlantic Table",icon:"◇",cost:46000,upkeep:360,income:1420,appeal:18,problem:"Premium service",description:"A destination seafood restaurant for sunset trade."},
  {id:"beach-volleyball",districtId:"east",name:"Volleyball Courts",icon:"◎",cost:19000,upkeep:110,income:480,appeal:13,problem:"Event scheduling",description:"Bookable courts that create leisure crowds."},
  {id:"innovation-cafe",districtId:"innovation",name:"Founders Café",icon:"☕",cost:24000,upkeep:180,income:900,appeal:11,problem:"Premium service",description:"Coffee, meeting booths and dependable weekday trade."},
  {id:"innovation-tech",districtId:"innovation",name:"Print & Tech Lab",icon:"◆",cost:30000,upkeep:210,income:1060,appeal:9,problem:"Equipment reliability",description:"Printing, accessories and urgent technical support."},
  {id:"innovation-incubator",districtId:"innovation",name:"Startup Incubator",icon:"I",cost:52000,upkeep:390,income:1520,appeal:20,problem:"Occupancy",description:"Premium desks that unlock a visible founder community."},
  {id:"innovation-conference",districtId:"innovation",name:"Conference Centre",icon:"◇",cost:68000,upkeep:520,income:1940,appeal:24,problem:"Event calendar",description:"Large corporate bookings with demanding service standards."},
  {id:"sports-fitness",districtId:"sports",name:"Atlantic Fitness",icon:"R",cost:42000,upkeep:320,income:1280,appeal:16,problem:"Peak capacity",description:"A full fitness centre serving students and clubs."},
  {id:"sports-smoothie",districtId:"sports",name:"Recovery Smoothies",icon:"◒",cost:17000,upkeep:120,income:720,appeal:8,problem:"Rush throughput",description:"Fast nutrition before and after training blocks."},
  {id:"sports-shop",districtId:"sports",name:"Club Sports Shop",icon:"◆",cost:29000,upkeep:190,income:980,appeal:10,problem:"Stock variety",description:"Specialist kit for teams, visitors and tournaments."},
  {id:"sports-padel",districtId:"sports",name:"Padel Courts",icon:"◎",cost:48000,upkeep:290,income:1360,appeal:21,problem:"Booking peaks",description:"Bookable courts that generate club and tournament traffic."},
  {id:"sports-recovery",districtId:"sports",name:"Recovery Station",icon:"○",cost:26000,upkeep:210,income:780,appeal:12,problem:"Staff coverage",description:"Treatment and recovery space for longer athlete visits."},
  {id:"transit-parking",districtId:"transit",name:"Smart Parking",icon:"P",cost:52000,upkeep:350,income:1180,appeal:8,problem:"Traffic",description:"Paid parking that raises visitor capacity and congestion."},
  {id:"transit-bike",districtId:"transit",name:"Bicycle Station",icon:"○",cost:18000,upkeep:90,income:440,appeal:7,problem:"Route access",description:"A low-cost mobility hub for students and staff."},
  {id:"transit-bus",districtId:"transit",name:"Campus Bus Stop",icon:"↗",cost:34000,upkeep:230,income:680,appeal:13,problem:"Arrival surges",description:"High-volume arrivals in sharp timetable-driven waves."},
  {id:"transit-bakery",districtId:"transit",name:"Gate Bakery",icon:"✦",cost:23000,upkeep:160,income:920,appeal:9,problem:"Fast queues",description:"Grab-and-go food built for impatient commuters."},
  {id:"transit-store",districtId:"transit",name:"Arrival Convenience",icon:"▦",cost:27000,upkeep:180,income:1020,appeal:8,problem:"Restocking",description:"Travel essentials and dependable all-day trade."},
  {id:"transit-info",districtId:"transit",name:"Visitor Information",icon:"i",cost:15000,upkeep:110,income:260,appeal:14,problem:"Wayfinding",description:"Guidance that improves the whole arrival experience."}
]);

const DISTRICT_OFFER_SETS=Object.freeze({
  "village-market":[["essentials","Daily Essentials",180,450,"mood"],["study-pack","Study Pack",240,650,"energy"]],
  "village-laundry":[["wash","Wash Cycle",110,350,"mood"],["wash-dry","Wash & Dry",190,550,"energy"]],
  "village-takeaway":[["toastie","Nova Toastie",210,650,"hunger"],["meal-box","Late Meal Box",330,950,"hunger"]],
  "village-gym":[["day-pass","Gym Day Pass",180,700,"energy"],["membership","Monthly Membership",900,2400,"mood"]],
  "village-study":[["desk-hour","Quiet Desk Hour",80,300,"energy"],["group-room","Group Room",220,700,"mood"]],
  "beach-bar":[["lemonade","Atlantic Lemonade",120,550,"thirst"],["sunset-combo","Sunset Combo",310,1100,"hunger"]],
  "beach-surf":[["board-hour","Board Rental",380,1200,"mood"],["lesson","Surf Lesson",850,2400,"mood"]],
  "beach-icecream":[["scoop","Gelado Scoop",90,400,"hunger"],["sundae","Beach Sundae",190,700,"mood"]],
  "beach-seafood":[["lunch","Atlantic Lunch",520,1450,"hunger"],["sunset-table","Sunset Table",900,2400,"mood"]],
  "beach-volleyball":[["court-hour","Court Hour",220,800,"mood"],["tournament","Tournament Entry",480,1400,"mood"]],
  "innovation-cafe":[["flat-white","Founder Flat White",95,450,"energy"],["meeting-combo","Meeting Combo",260,900,"hunger"]],
  "innovation-tech":[["print-pack","Print Pack",80,350,"mood"],["tech-support","Tech Support",300,1100,"mood"]],
  "innovation-incubator":[["desk-day","Coworking Day",350,1200,"energy"],["startup-pass","Startup Pass",1050,3000,"mood"]],
  "innovation-conference":[["delegate-seat","Delegate Seat",750,2200,"mood"],["event-room","Event Room",1800,5200,"mood"]],
  "sports-fitness":[["fitness-pass","Fitness Day Pass",200,750,"energy"],["club-membership","Club Membership",950,2600,"mood"]],
  "sports-smoothie":[["smoothie","Recovery Smoothie",130,550,"thirst"],["protein-bowl","Protein Bowl",240,850,"hunger"]],
  "sports-shop":[["training-kit","Training Kit",380,1100,"mood"],["club-shirt","Club Shirt",520,1500,"mood"]],
  "sports-padel":[["court-hour","Padel Court Hour",300,1000,"mood"],["racket-set","Racket Set Rental",160,550,"mood"]],
  "sports-recovery":[["recovery-slot","Recovery Session",280,950,"energy"],["treatment","Sports Treatment",650,1800,"energy"]],
  "transit-parking":[["parking-hour","Parking Hour",60,250,"mood"],["day-parking","Day Parking",180,700,"mood"]],
  "transit-bike":[["bike-hour","Bike Rental",120,450,"energy"],["day-bike","Bike Day Pass",260,850,"mood"]],
  "transit-bus":[["campus-ticket","Campus Ticket",70,300,"energy"],["day-ticket","Day Ticket",160,600,"mood"]],
  "transit-bakery":[["croissant","Butter Croissant",85,350,"hunger"],["filled-roll","Filled Roll",190,650,"hunger"]],
  "transit-store":[["travel-pack","Travel Essentials",180,550,"mood"],["commuter-combo","Commuter Combo",260,800,"hunger"]],
  "transit-info":[["tour-pass","Campus Tour",160,600,"mood"],["visitor-pack","Visitor Pack",110,400,"mood"]]
});
export const DISTRICT_BUSINESS_OFFERS=Object.freeze(Object.entries(DISTRICT_OFFER_SETS).flatMap(([businessId,offers])=>offers.map(([suffix,name,cost,reference,need])=>({id:`${businessId}-${suffix}`,businessId,name,cost,reference,need}))));
export const EVENT_CATALOGUE = Object.freeze([
  {id:"sunset",name:"Sunset Sessions",icon:"♫",level:7,cost:3500,duration:180,guestBonus:16,moodBonus:12,description:"A compact DJ event that creates an evening crowd spike."},
  {id:"market",name:"Founders Market",icon:"◇",level:8,cost:5000,duration:240,guestBonus:22,moodBonus:9,description:"Student brands and food pop-ups pull visitors toward every open store."},
  {id:"surfCup",name:"Nova Surf Cup",icon:"≈",level:9,cost:8500,duration:300,guestBonus:34,moodBonus:16,description:"A flagship beach event with the strongest visitor draw."}
]);
export const DJ_EVENT_SLOTS = Object.freeze([
  {id:"afternoon",name:"Afternoon Session",startMinute:870,duration:120,demand:1,noiseFactor:.9,description:"A lower-risk daytime set between classes."},
  {id:"sunset",name:"Sunset Session",startMinute:1035,duration:120,demand:1.2,noiseFactor:1.08,description:"A premium golden-hour slot with stronger demand."}
]);
export const DJ_STYLES = Object.freeze([
  {id:"house",name:"Atlantic House",color:"#64cbc8",appeal:1.12,excitement:26,noise:68,comfort:-4,description:"High-energy coastal house with a louder footprint."},
  {id:"sunset",name:"Sunset Grooves",color:"#f5c95e",appeal:1.05,excitement:18,noise:48,comfort:10,description:"Warm disco and soul built for long, comfortable stays."},
  {id:"pop",name:"Campus Pop",color:"#ff8060",appeal:1.18,excitement:21,noise:58,comfort:3,description:"Broad appeal and reliable turnout at a balanced intensity."},
  {id:"indie",name:"Indie Waves",color:"#9a7bc1",appeal:.94,excitement:14,noise:42,comfort:14,description:"A calmer niche set that protects comfort and rating."}
]);
export const DJ_ROSTER = Object.freeze([
  {id:"ines",name:"Inês Vale",tag:"Campus resident",hireCost:900,eventFee:180,appeal:.94,excitement:3,description:"Affordable and dependable for a first event programme."},
  {id:"marco",name:"Marco Luz",tag:"Lisbon selector",hireCost:2400,eventFee:420,appeal:1.1,excitement:9,description:"A recognisable local name with a stronger crowd pull."},
  {id:"luma",name:"LUMA",tag:"Coast headliner",hireCost:4800,eventFee:850,appeal:1.3,excitement:16,description:"Expensive, exciting and capable of filling an upgraded deck."}
]);
export const DJ_UPGRADES = Object.freeze([
  {id:"speakers",name:"Sound System",icon:"◖",costs:[1800,3200,5200],excitement:8,noise:7,comfort:0,capacity:0,operating:80,description:"More impact and reach, but more noise to manage."},
  {id:"lighting",name:"Stage Lighting",icon:"✦",costs:[1400,2600,4200],excitement:7,noise:0,comfort:1,capacity:0,operating:60,description:"Raises spectacle without disturbing nearby spaces."},
  {id:"shade",name:"Canvas Shade",icon:"⌂",costs:[1200,2200,3600],excitement:0,noise:0,comfort:11,capacity:0,operating:30,description:"Keeps afternoon crowds comfortable for longer."},
  {id:"capacity",name:"Crowd Deck",icon:"◎",costs:[2000,3600,6000],excitement:2,noise:2,comfort:-1,capacity:15,operating:70,description:"Expands the safe standing area and ticket ceiling."}
]);
export const PROGRESSION_LEVELS = Object.freeze([
  {level:1,xp:0,title:"Café Starter",unlock:"Atlantic Café"},{level:2,xp:50,title:"Campus Operator",unlock:"Fuel Bar + queue staff"},
  {level:3,xp:130,title:"Village Operator",unlock:"Student Village land"},{level:4,xp:240,title:"Retail Founder",unlock:"Merch Lab + village services"},
  {level:5,xp:380,title:"District Developer",unlock:"Beachfront land"},{level:6,xp:560,title:"Beach Entrepreneur",unlock:"Maré Beach Bar + leisure venues"},
  {level:7,xp:780,title:"Innovation Founder",unlock:"Innovation District + conferences"},{level:8,xp:1050,title:"Campus Athlete",unlock:"Sports Campus + Surf Shack"},
  {level:9,xp:1380,title:"Mobility Director",unlock:"Transit & Arrival District"},{level:10,xp:1750,title:"Nova Legend",unlock:"Complete district portfolio"}
]);

export const CATALOGUE = Object.freeze([
  { id: "coldBrew", storeId: "cafe", tier: 1, name: "Atlantic Cold Brew", short: "Cold Brew", icon: "☕", cost: 200, reference: 400, color: "#e98a55" },
  { id: "nata", storeId: "cafe", tier: 2, name: "Pastel de Nata", short: "Nata", icon: "✦", cost: 120, reference: 250, color: "#efbd58" },
  { id: "toastie", storeId: "cafe", tier: 3, name: "Campus Toastie", short: "Toastie", icon: "▰", cost: 300, reference: 650, color: "#d77c4c" },
  { id: "acai", storeId: "snack", tier: 1, name: "Surf Açaí Cup", short: "Açaí Cup", icon: "◉", cost: 300, reference: 600, color: "#a979bd" },
  { id: "water", storeId: "snack", tier: 2, name: "Lemon Water", short: "Lemon Water", icon: "◇", cost: 80, reference: 200, color: "#8dcae5" },
  { id: "bites", storeId: "snack", tier: 3, name: "Energy Bites", short: "Energy Bites", icon: "●", cost: 150, reference: 350, color: "#9fbb55" },
  { id: "tote", storeId: "merch", tier: 1, name: "Nova Wave Tote", short: "Wave Tote", icon: "▱", cost: 500, reference: 1000, color: "#58bdb4" },
  { id: "cap", storeId: "merch", tier: 2, name: "Carcavelos Cap", short: "Campus Cap", icon: "⌒", cost: 700, reference: 1500, color: "#5a90ad" },
  { id: "hoodie", storeId: "merch", tier: 3, name: "Nova Coast Hoodie", short: "Hoodie", icon: "⌂", cost: 1400, reference: 3000, color: "#4a687e" },
  { id: "tonic", storeId: "beach", tier: 1, name: "Espresso Tonic", short: "Tonic", icon: "☀", cost: 180, reference: 450, color: "#e4a83f" },
  { id: "lime", storeId: "beach", tier: 2, name: "Atlantic Lime Soda", short: "Lime Soda", icon: "◇", cost: 100, reference: 320, color: "#9dcc63" },
  { id: "sunsetCup", storeId: "beach", tier: 3, name: "Sunset Fruit Cup", short: "Fruit Cup", icon: "●", cost: 220, reference: 550, color: "#ef7c59" },
  { id: "wax", storeId: "surf", tier: 1, name: "Carcavelos Board Wax", short: "Board Wax", icon: "≈", cost: 260, reference: 650, color: "#5eb9c8" },
  { id: "towel", storeId: "surf", tier: 2, name: "Nova Beach Towel", short: "Beach Towel", icon: "▰", cost: 650, reference: 1450, color: "#4b91aa" },
  { id: "boardPass", storeId: "surf", tier: 3, name: "Surf Board Day Pass", short: "Board Pass", icon: "↗", cost: 1200, reference: 2800, color: "#2d7188" }
]);

export function createRun() {
  const stock = {}, prices = {};
  CATALOGUE.forEach(product => { stock[product.id] = 0; prices[product.id] = product.reference; });
  return { version: 9, cash: INITIAL_CASH, stock, prices, currentDay: 1, completed: false, history: [], purchases: [], deliveries:[], storeHours:structuredClone(DEFAULT_STORE_HOURS), venues: { cafe: 1, snack: 0, merch: 0, beach:0, surf:0 }, venueProjects:[], storeSpecializations:{}, specializationHistory:[], districts:{coast:1,village:0,east:0,innovation:0,sports:0,transit:0,pier:0}, districtBusinesses:{}, districtBusinessHistory:[], districtOperations:{}, districtOfferSales:[], eventVenue:0, activeEvent:null, scheduledEvent:null, djOperations:{deckId:null,slotId:"sunset",styleId:"sunset",ticketPrice:600,djId:null,upgrades:{speakers:0,lighting:0,shade:0,capacity:0},lifetimeAttendance:0,lifetimeRevenue:0}, reputation: 0, upgrades: [], facilities: [], staff: { service:0, caretaker:0, technician:0, host:0, entertainer:0 }, staffRoster:[], operations:createOperationsState(), performance:createPerformanceState(), calendar:{cycle:"nova-week-v1",startedDay:1}, clockMinutes:DAY_START, speed:1, today:createToday(), salesMode:"guests", guestSales:[], salesProgress:{}, visitorProgress:0, totalSales:0, totalVisitors:0, totalCampusInteractions:0, facilityUsage:{}, venueVisits:{}, guestEconomy:{purchases:0,spend:0,walkaways:0}, player: { x: 21, y: 18, zone: "campus" } };
}

export function createShowcaseRun(){
  const run=createRun();run.campaignType="showcase";run.cash=SHOWCASE_BUDGET;run.totalSales=150;run.totalVisitors=250;run.totalCampusInteractions=120;run.reputation=50;run.speed=4;return run;
}

function createToday(){return {revenue:0,cogs:0,unitsSold:0,visitors:0,eventRevenue:0,eventCosts:0,eventAttendance:0,districtRevenue:0,staffWages:0,staffWagesPaid:0,operatingCosts:0,operatingCostsPaid:0,issuesResolved:0,walkaways:0,products:{},activities:{},deliveries:[],guestGroups:{}};}

function createOperationsState(){return {issues:[],history:[],litterLoad:0,breakdownLoad:0,nextIssueSequence:1,payrollDue:0,totalWagesPaid:0,totalIssuesResolved:0};}
function createPerformanceState(){return {momentum:50,peakRating:0,profitableDays:0,lossDays:0,operatingDue:0,totalOperatingCostsPaid:0,lastDay:null};}

function ensurePerformanceState(run){
  if(!run.performance)run.performance=createPerformanceState();const performance=run.performance;
  if(!Number.isFinite(performance.momentum))performance.momentum=50;performance.momentum=Math.max(15,Math.min(100,Math.round(performance.momentum)));
  if(!Number.isInteger(performance.peakRating))performance.peakRating=0;if(!Number.isInteger(performance.profitableDays))performance.profitableDays=0;if(!Number.isInteger(performance.lossDays))performance.lossDays=0;
  if(!Number.isInteger(performance.operatingDue)||performance.operatingDue<0)performance.operatingDue=0;if(!Number.isInteger(performance.totalOperatingCostsPaid)||performance.totalOperatingCostsPaid<0)performance.totalOperatingCostsPaid=0;
  if(performance.lastDay===undefined)performance.lastDay=null;return performance;
}

function ensureDjOperations(run){if(!run.djOperations)run.djOperations={deckId:null,slotId:"sunset",styleId:"sunset",ticketPrice:600,djId:null,upgrades:{},lifetimeAttendance:0,lifetimeRevenue:0};if(!run.djOperations.upgrades)run.djOperations.upgrades={};for(const item of DJ_UPGRADES)if(!Number.isInteger(run.djOperations.upgrades[item.id]))run.djOperations.upgrades[item.id]=0;if(!Number.isInteger(run.djOperations.ticketPrice)||run.djOperations.ticketPrice<=0)run.djOperations.ticketPrice=600;if(!DJ_EVENT_SLOTS.some(item=>item.id===run.djOperations.slotId))run.djOperations.slotId="sunset";if(!DJ_STYLES.some(item=>item.id===run.djOperations.styleId))run.djOperations.styleId="sunset";}
function djDeckExists(run,deckId){return deckId==="pavilion"?Boolean(run.eventVenue&&!assetIsClosed(run,"venue","pavilion")):(run.facilities||[]).some(item=>item.id===deckId&&item.type==="experience"&&(item.modules||[]).includes("music")&&!assetIsClosed(run,"facility",item.id));}
function priceDemandFactor(price){const ratio=price/800;if(ratio<=.75)return 1.18;if(ratio<=1)return 1.08;if(ratio<=1.5)return 1.08-(ratio-1)*.72;if(ratio<=2)return .72-(ratio-1.5)*.64;return .18;}

export function djEventProjection(run,overrides={}){
  const ops=structuredClone(run.djOperations||{}),mergedUpgrades={speakers:0,lighting:0,shade:0,capacity:0,...ops.upgrades,...overrides.upgrades};Object.assign(ops,overrides);ops.upgrades=mergedUpgrades;
  const slot=DJ_EVENT_SLOTS.find(item=>item.id===ops.slotId)||DJ_EVENT_SLOTS[1],style=DJ_STYLES.find(item=>item.id===ops.styleId)||DJ_STYLES[1],dj=DJ_ROSTER.find(item=>item.id===ops.djId)||null;
  const upgrade=id=>Math.max(0,Math.min(3,ops.upgrades?.[id]||0)),capacity=24+upgrade("capacity")*15;
  const excitement=Math.min(100,style.excitement+(dj?.excitement||0)+upgrade("speakers")*8+upgrade("lighting")*7+upgrade("capacity")*2);
  const noise=Math.min(100,Math.round((style.noise+upgrade("speakers")*7+upgrade("capacity")*2)*slot.noiseFactor));
  const comfort=Math.max(0,Math.min(100,58+style.comfort+upgrade("shade")*11+upgrade("lighting")-upgrade("capacity")-Math.max(0,noise-72)*.45));
  const operatingCost=300+(dj?.eventFee||0)+DJ_UPGRADES.reduce((sum,item)=>sum+upgrade(item.id)*item.operating,0),ticketPrice=Math.max(1,Number(ops.ticketPrice)||600);
  const baseGuests=campusMetrics(run).guests,expectedAttendance=Math.max(4,Math.min(capacity,Math.round((baseGuests*.72+excitement*.25+comfort*.08)*(dj?.appeal||.72)*style.appeal*slot.demand*priceDemandFactor(ticketPrice))));
  const expectedRevenue=expectedAttendance*ticketPrice,expectedProfit=expectedRevenue-operatingCost;
  return {slot,style,dj,ticketPrice,capacity,excitement,noise,comfort,operatingCost,expectedAttendance,expectedRevenue,expectedProfit,guestBonus:Math.max(4,Math.round(expectedAttendance/3)),moodBonus:Math.max(2,Math.round((excitement+comfort-noise*.35)/12))};
}

export function configureDjOperations(run,changes={}){const next=structuredClone(run);ensureDjOperations(next);if(changes.deckId!==undefined){if(!djDeckExists(next,changes.deckId))throw new Error("Choose a built DJ deck.");next.djOperations.deckId=changes.deckId;}if(changes.slotId!==undefined){if(!DJ_EVENT_SLOTS.some(item=>item.id===changes.slotId))throw new Error("Choose a valid event time.");next.djOperations.slotId=changes.slotId;}if(changes.styleId!==undefined){if(!DJ_STYLES.some(item=>item.id===changes.styleId))throw new Error("Choose a valid music style.");next.djOperations.styleId=changes.styleId;}if(changes.ticketPrice!==undefined){if(!Number.isInteger(changes.ticketPrice)||changes.ticketPrice<=0)throw new Error("Ticket price must be a positive euro amount with at most two decimals.");next.djOperations.ticketPrice=changes.ticketPrice;}return next;}
export function hireDj(run,djId,deckId,now=new Date().toISOString()){const dj=DJ_ROSTER.find(item=>item.id===djId);if(!dj)throw new Error("Choose a valid DJ.");const next=configureDjOperations(run,{deckId});if(next.cash<dj.hireCost)throw new Error(`You need ${formatEuro(dj.hireCost)} to hire ${dj.name}.`);next.cash-=dj.hireCost;next.djOperations.djId=dj.id;if(!Array.isArray(next.djHires))next.djHires=[];next.djHires.push({at:now,day:run.currentDay,djId,deckId,cost:dj.hireCost});return next;}
export function upgradeDjDeck(run,upgradeId,deckId,now=new Date().toISOString()){const item=DJ_UPGRADES.find(entry=>entry.id===upgradeId);if(!item)throw new Error("Unknown deck upgrade.");const next=configureDjOperations(run,{deckId}),level=next.djOperations.upgrades[upgradeId]||0;if(level>=3)throw new Error("This deck upgrade is already at maximum level.");const cost=item.costs[level];if(next.cash<cost)throw new Error(`You need ${formatEuro(cost)} for this upgrade.`);next.cash-=cost;next.djOperations.upgrades[upgradeId]=level+1;if(!Array.isArray(next.djUpgrades))next.djUpgrades=[];next.djUpgrades.push({at:now,day:run.currentDay,deckId,upgradeId,fromLevel:level,toLevel:level+1,cost});return next;}
export function scheduleDjEvent(run,deckId,now=new Date().toISOString()){const next=configureDjOperations(run,{deckId});if(next.activeEvent)throw new Error("Another event is already live.");if(next.scheduledEvent)throw new Error("An event is already scheduled.");if(!next.djOperations.djId)throw new Error("Hire a DJ before scheduling an event.");const projection=djEventProjection(next);if(next.cash<projection.operatingCost)throw new Error(`You need ${formatEuro(projection.operatingCost)} to operate this event.`);const eventDay=next.clockMinutes<projection.slot.startMinute-10?next.currentDay:next.currentDay+1;next.cash-=projection.operatingCost;next.scheduledEvent={id:"dj-event",name:`${projection.style.name} · ${projection.slot.name}`,source:"dj",deckId,day:eventDay,startMinute:projection.slot.startMinute,duration:projection.slot.duration,styleId:projection.style.id,slotId:projection.slot.id,djId:projection.dj.id,djName:projection.dj.name,ticketPrice:projection.ticketPrice,capacity:projection.capacity,excitement:projection.excitement,noise:projection.noise,comfort:projection.comfort,operatingCost:projection.operatingCost,expectedAttendance:projection.expectedAttendance,expectedRevenue:projection.expectedRevenue,expectedProfit:projection.expectedProfit,guestBonus:projection.guestBonus,moodBonus:projection.moodBonus,scheduledAt:now};return next;}

const GUEST_RELIEF = Object.freeze({
  bench:{energy:42,mood:10}, water:{thirst:70}, restroom:{bladder:78}, foodGarden:{hunger:62,mood:16},
  scenery:{mood:18}, experience:{mood:62,energy:-8}, cafe:{hunger:35,energy:46,thirst:12},
  snack:{hunger:48,thirst:36}, beach:{thirst:48,hunger:18,mood:16}, surf:{mood:34}, merch:{mood:28}, academy:{mood:8}, hub:{mood:22}, forum:{mood:26}, pavilion:{mood:54}
});

function guestNeed(needs,key,fallback=35){const value=Number(needs?.[key]);return Number.isFinite(value)?Math.max(0,Math.min(100,value)):fallback;}

function guestTrait(profile,key,fallback){const value=Number(profile?.[key]);return Number.isFinite(value)?value:fallback;}
function preference(profile,key,fallback=.5){return Math.max(0,Math.min(1,guestTrait(profile?.preferences,key,fallback)));}
function queueSize(context,kind,id){return Math.max(0,Math.round(Number(context?.queues?.[`${kind}:${id}`]??context?.queues?.[id]??0)||0));}
function queuePenalty(length,patience){return length*(8+(100-patience)*.22);}
function optionReason(parts){return parts.filter(Boolean).slice(0,3).join(" · ");}

export function guestDestinationOptions(run,guestOrNeeds={},seed=0,context={}){
  const profile=guestOrNeeds?.needs?guestOrNeeds:{needs:guestOrNeeds},needs=profile.needs||{};
  const hunger=guestNeed(needs,"hunger"),thirst=guestNeed(needs,"thirst"),bladder=guestNeed(needs,"bladder"),energy=guestNeed(needs,"energy"),mood=guestNeed(needs,"mood");
  const budget=Math.max(0,guestTrait(profile,"budget",Number.POSITIVE_INFINITY)),patience=Math.max(0,Math.min(100,guestTrait(profile,"queuePatience",65))),priceTolerance=Math.max(.55,Math.min(1.8,guestTrait(profile,"priceTolerance",1))),quality=Math.max(0,Math.min(100,guestTrait(context,"campusQuality",campusMetrics(run).rating)));
  const social=preference(profile,"social"),calm=preference(profile,"calm"),excitement=preference(profile,"excitement"),food=preference(profile,"food"),drinks=preference(profile,"drinks"),shopping=preference(profile,"shopping");
  const options=[
    {kind:"landmark",id:"academy",label:"Academic Wing",score:18+calm*18+quality*.08+((seed+1)%7),reason:optionReason(["quiet destination",`${quality}% campus quality`])},
    {kind:"landmark",id:"hub",label:"Student Hub",score:13+mood*.34+social*28+quality*.1+((seed+3)%6),reason:optionReason(["social preference",`${quality}% campus quality`])},
    {kind:"landmark",id:"forum",label:"Sunset Forum",score:12+mood*.4+social*20+calm*12+quality*.1+((seed+5)%8),reason:optionReason(["open-air destination",`${quality}% campus quality`])}
  ];
  if(run.activeEvent&&(run.eventVenue||run.activeEvent.deckId)&&!assetIsClosed(run,run.activeEvent.deckId==="pavilion"?"venue":"facility",run.activeEvent.deckId)){
    const event=run.activeEvent,isDj=event.source==="dj",ticketPrice=isDj?(event.ticketPrice||0):0,q=queueSize(context,isDj?"event":"landmark",isDj?"dj-event":"pavilion");
    if(!ticketPrice||ticketPrice<=budget){const priceRatio=ticketPrice/800,score=82+mood*.32+excitement*(isDj?42:35)+(event.excitement||0)*.28+(event.comfort||50)*.12-calm*(event.noise||0)*.22-Math.max(0,priceRatio-1)*18-queuePenalty(q,patience);options.push({kind:isDj?"event":"landmark",id:isDj?"dj-event":"pavilion",type:"pavilion",deckId:event.deckId||"pavilion",label:event.name||"Coastline Pavilion",score,price:ticketPrice,queueLength:q,reason:optionReason([isDj?`${event.styleName||"live music"} event`:"live event",ticketPrice?`${formatEuro(ticketPrice)} ticket`:"free entry",`${event.comfort||50}% comfort`])});}
  }
  for(const facility of run.facilities||[]){
    if(assetIsClosed(run,"facility",facility.id))continue;
    const specialization=facilitySpecialization(facility),q=queueSize(context,"facility",facility.id);let score=8+quality*.08+(specialization?.appeal||0);
    if(facility.type==="bench")score+=energy*1.08+mood*.18;
    else if(facility.type==="water")score+=thirst*1.35;
    else if(facility.type==="restroom")score+=bladder*1.5;
    else if(facility.type==="foodGarden")score+=hunger*1.28+mood*.22+food*30+social*14;
    else if(facility.type==="experience"){const stats=attractionStats(facility.modules),intensityTarget=guestTrait(profile?.preferences,"intensity",50);score+=mood*1.08+stats.excitement*.3+excitement*38-Math.abs(stats.intensity-intensityTarget)*.3;}
    else if(facility.type==="scenery")score+=mood*.48+calm*18;
    else if(facility.type==="path")continue;
    else score+=12;
    score-=queuePenalty(q,patience);options.push({kind:"facility",id:facility.id,type:facility.type,label:specialization?.name||facility.name,score,queueLength:q,reason:optionReason([specialization?.name,q?`${q} already there`:"available now",facility.type==="experience"?"attraction fit":`${quality}% campus quality`])});
  }
  const groupDistrict={resident:"village",surfer:"east",tourist:"east",founder:"innovation",corporate:"innovation",athlete:"sports",commuter:"transit"}[profile.groupId];
  for(const business of DISTRICT_BUSINESSES){if(!run.districtBusinesses?.[business.id]||assetIsClosed(run,"district-business",business.id))continue;const forecast=districtBusinessForecast(run,business.id),affordable=forecast.offers.filter(offer=>offer.stock>0&&offer.remainingDemand>0&&offer.price<=budget);if(!affordable.length)continue;const choice=affordable.sort((a,b)=>(a.price/a.reference)-(b.price/b.reference)||a.price-b.price)[0],q=queueSize(context,"district-business",business.id),groupFit=groupDistrict===business.districtId?28:0,urgency={hunger,thirst,energy,mood}[choice.need]||mood,priceRatio=choice.price/choice.reference/priceTolerance,score=12+business.appeal*1.2+quality*.09+groupFit+urgency*.72+social*7+Math.max(-28,22-priceRatio*15)+((seed+business.id.length)%9)-queuePenalty(q,patience);options.push({kind:"district-business",id:business.id,type:choice.need,label:business.name,offerId:choice.id,productName:choice.name,price:choice.price,score,queueLength:q,reason:optionReason([groupFit?"made for this visitor group":`${choice.need} demand`,priceRatio<=1?"good value":"premium price",q?`${q} already there`:null])});}
  for(const store of STORES){
    if((run.venues?.[store.id]??0)<1)continue;
    if(!storeIsOpen(run,store.id,run.clockMinutes))continue;
    const products=CATALOGUE.filter(product=>product.storeId===store.id&&run.stock?.[product.id]>0&&(run.today?.products?.[product.id]?.unitsSold||0)<demandFor(run.prices?.[product.id]??product.reference,product.reference));
    if(!products.length)continue;
    const affordable=products.map(product=>({...product,price:run.prices?.[product.id]??product.reference})).filter(product=>product.price<=budget&&demandFor(product.price,product.reference)>0&&(demandFor(product.price,product.reference)>=10||Math.abs(Math.floor(seed))%10<demandFor(product.price,product.reference)));
    if(!affordable.length)continue;
    const choice=affordable.sort((a,b)=>(a.price/a.reference)-(b.price/b.reference)||a.price-b.price)[0],priceRatio=choice.price/choice.reference,q=queueSize(context,"store",store.id);
    const specialization=storeSpecialization(run,store.id),synergy=specializationSynergy(run,store.id),perceivedRatio=priceRatio/priceTolerance;let score=10+quality*.14+Math.max(-42,30-perceivedRatio*20)-queuePenalty(q,patience)+(specialization?.appeal||0)+synergy.appeal;
    if(store.id==="cafe")score+=hunger*.68+energy*.82+thirst*.18;
    else if(store.id==="snack")score+=hunger*.92+thirst*.6;
    else score+=mood*.52+12;
    if(store.id==="cafe")score+=food*22+drinks*18;else if(store.id==="snack"||store.id==="beach")score+=food*16+drinks*26;else if(store.id==="merch")score+=shopping*35;else if(store.id==="surf")score+=shopping*18+excitement*28;
    options.push({kind:"store",id:store.id,label:store.name,score,productIds:affordable.map(product=>product.id),productId:choice.id,productName:choice.name,price:choice.price,baseDemand:demandFor(choice.price,choice.reference),queueLength:q,reason:optionReason([profile.groupName,synergy.matches?`${synergy.matches} district synergy`:null,perceivedRatio<=1?"good value":perceivedRatio>1.5?"high price":"acceptable price"])});
  }
  return options.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}

export function applyGuestNeedRelief(needs={},destinationType){
  const next={hunger:guestNeed(needs,"hunger",0),thirst:guestNeed(needs,"thirst",0),bladder:guestNeed(needs,"bladder",0),energy:guestNeed(needs,"energy",0),mood:guestNeed(needs,"mood",0)};
  for(const [key,value] of Object.entries(GUEST_RELIEF[destinationType]||{}))next[key]=Math.max(0,Math.min(100,next[key]-value));
  return next;
}

function recordGuestActivityInPlace(next,destination){
  if(!next.today)next.today=createToday();if(!next.today.activities)next.today.activities={};
  const key=`${destination.kind}:${destination.id}`;next.today.activities[key]=(next.today.activities[key]||0)+1;
  next.totalCampusInteractions=(next.totalCampusInteractions||0)+1;
  if(destination.kind==="facility"){if(!next.facilityUsage)next.facilityUsage={};next.facilityUsage[destination.id]=(next.facilityUsage[destination.id]||0)+1;}
  if(destination.kind==="store"){if(!next.venueVisits)next.venueVisits={};next.venueVisits[destination.id]=(next.venueVisits[destination.id]||0)+1;}
}

export function recordGuestActivity(run,destination){
  if(!destination?.id||!destination.kind)throw new Error("Choose a valid guest destination.");
  const next=structuredClone(run);recordGuestActivityInPlace(next,destination);
  return next;
}

export function completeGuestSale(run,productId,guestBudget,guestId=null,now=new Date().toISOString()){
  const product=CATALOGUE.find(item=>item.id===productId);if(!product)throw new Error("Choose a valid product.");
  const price=run.prices?.[productId];
  if(!Number.isInteger(price)||price<=0)throw new Error("Selling price must be a positive euro amount with at most two decimals.");
  if(!Number.isInteger(guestBudget)||guestBudget<price)throw new Error("This guest cannot afford the purchase.");
  if((run.venues?.[product.storeId]??0)<(product.tier||1))throw new Error("This product is not unlocked yet.");
  if(!storeIsOpen(run,product.storeId,run.clockMinutes))throw new Error("This store is currently closed.");
  const dailyDemand=demandFor(price,product.reference);if(dailyDemand<=0)throw new Error("The price is above this product's demand range.");
  if((run.today?.products?.[productId]?.unitsSold||0)>=dailyDemand)throw new Error("Today's demand for this product has been served.");
  if(!Number.isInteger(run.stock?.[productId])||run.stock[productId]<=0)throw new Error("This product is out of stock.");
  const next=structuredClone(run);ensureTycoonState(next);const revenue=price,cogs=product.cost;
  next.stock[productId]-=1;next.cash+=revenue;next.today.revenue+=revenue;next.today.cogs+=cogs;next.today.unitsSold+=1;next.totalSales+=1;
  const row=next.today.products[productId]||{unitsSold:0,revenue:0,cogs:0};row.unitsSold+=1;row.revenue+=revenue;row.cogs+=cogs;next.today.products[productId]=row;
  next.guestEconomy.purchases+=1;next.guestEconomy.spend+=revenue;
  recordGuestActivityInPlace(next,{kind:"store",id:product.storeId});
  next.guestSales.push({id:`sale-${next.currentDay}-${next.totalSales}`,at:now,day:next.currentDay,minute:next.clockMinutes,guestId,storeId:product.storeId,productId,price,revenue,cogs,grossProfit:revenue-cogs});
  if(next.guestSales.length>200)next.guestSales=next.guestSales.slice(-200);
  return next;
}

export function attractionStats(moduleIds=[]) {
  const modules=moduleIds.map(id=>EXPERIENCE_MODULES.find(item=>item.id===id)).filter(Boolean);
  return {
    excitement:Math.min(100,modules.reduce((sum,item)=>sum+item.excitement,0)),
    intensity:Math.min(100,modules.reduce((sum,item)=>sum+item.intensity,0)),
    comfort:Math.max(0,Math.min(100,42+modules.reduce((sum,item)=>sum+item.comfort,0))),
    cost:modules.reduce((sum,item)=>sum+item.cost,0)
  };
}

export function districtForPosition(x=0,y=0){if(x>=69.4)return "transit";if(x>=60.8&&y>=16)return "sports";if(x>=53.4&&y<16)return "innovation";if(x>=40&&y<16)return "village";if(x>=40)return "east";return "coast";}
export function districtForStore(storeId){return ["surf","beach"].includes(storeId)?"east":"coast";}

function shiftFor(worker){return STAFF_SHIFTS.find(item=>item.id===worker?.shiftId)||STAFF_SHIFTS[1];}
export function staffDailyWage(worker){const role=STAFF_CATALOGUE.find(item=>item.id===worker?.roleId);return role?Math.round(role.wage*shiftFor(worker).wageFactor):0;}

function legacyRoster(run){
  const roster=[];for(const role of STAFF_CATALOGUE){const count=Math.max(0,Math.floor(run.staff?.[role.id]||0));for(let index=0;index<count;index++)roster.push({id:`staff-${role.id}-${index+1}`,roleId:role.id,districtId:"coast",shiftId:"full",hiredDay:run.currentDay||1,hiredAt:null});}return roster;
}

function ensureOperationsState(run){
  if(!Array.isArray(run.staffRoster))run.staffRoster=legacyRoster(run);
  if(!run.staff)run.staff={};for(const role of STAFF_CATALOGUE)run.staff[role.id]=run.staffRoster.filter(worker=>worker.roleId===role.id).length;
  for(const worker of run.staffRoster){if(!STAFF_SHIFTS.some(item=>item.id===worker.shiftId))worker.shiftId="full";if(!OPERATIONS_DISTRICTS.some(item=>item.id===worker.districtId)||!run.districts?.[worker.districtId])worker.districtId="coast";}
  if(!run.operations)run.operations=createOperationsState();const operations=run.operations;
  if(!Array.isArray(operations.issues))operations.issues=[];if(!Array.isArray(operations.history))operations.history=[];
  if(!Number.isFinite(operations.litterLoad))operations.litterLoad=0;if(!Number.isFinite(operations.breakdownLoad))operations.breakdownLoad=0;
  if(!Number.isInteger(operations.nextIssueSequence)||operations.nextIssueSequence<1)operations.nextIssueSequence=1;
  if(!Number.isInteger(operations.payrollDue)||operations.payrollDue<0)operations.payrollDue=0;
  if(!Number.isInteger(operations.totalWagesPaid)||operations.totalWagesPaid<0)operations.totalWagesPaid=0;
  if(!Number.isInteger(operations.totalIssuesResolved)||operations.totalIssuesResolved<0)operations.totalIssuesResolved=0;
  return run;
}

export function migrateStaffOperations(run){ensureOperationsState(run);ensurePerformanceState(run);if(!run.storeSpecializations)run.storeSpecializations={};if(!Array.isArray(run.specializationHistory))run.specializationHistory=[];if(!Array.isArray(run.venueProjects))run.venueProjects=[];if(!run.calendar)run.calendar={cycle:"nova-week-v1",startedDay:1};if(!run.today)run.today=createToday();if(!run.today.guestGroups)run.today.guestGroups={};if(!run.districts)run.districts={coast:1};for(const id of ["coast","village","east","innovation","sports","transit","pier"])if(!Number.isInteger(run.districts[id]))run.districts[id]=id==="coast"?1:0;if(!run.districtBusinesses)run.districtBusinesses={};if(!Array.isArray(run.districtBusinessHistory))run.districtBusinessHistory=[];ensureDistrictOperations(run);(run.facilities||[]).forEach(facility=>{if(facility.specializationId&&!FACILITY_SPECIALIZATIONS.some(item=>item.id===facility.specializationId&&item.type===facility.type))delete facility.specializationId;});run.version=9;return run;}

export function activeVenueProject(run,storeId){return (run.venueProjects||[]).find(project=>project.storeId===storeId&&project.status==="building")||null;}
export function venueProjectProgress(project){if(!project)return 1;const duration=Math.max(1,project.durationMinutes||1),remaining=Math.max(0,project.remainingMinutes||0);return Math.max(0,Math.min(1,1-remaining/duration));}
function startVenueProject(run,storeId,kind,fromLevel,toLevel,durationMinutes,now){
  if(!Array.isArray(run.venueProjects))run.venueProjects=[];
  const project={id:`venue-project-${storeId}-${run.currentDay}-${run.venueProjects.length+1}`,storeId,kind,fromLevel,toLevel,status:"building",startedAt:now,startDay:run.currentDay,startMinute:run.clockMinutes,durationMinutes,remainingMinutes:durationMinutes};
  run.venueProjects.push(project);return project;
}

export function staffIsOnShift(worker,minutes){const shift=shiftFor(worker);return minutes>=shift.start&&minutes<shift.end;}
export function activeStaffCount(run,roleId,districtId="coast",minutes=run.clockMinutes){ensureOperationsState(run);if(run.operations.payrollDue>0)return 0;return run.staffRoster.filter(worker=>worker.roleId===roleId&&worker.districtId===districtId&&staffIsOnShift(worker,minutes)).length;}
export function dailyPayroll(run){ensureOperationsState(run);return run.staffRoster.reduce((sum,worker)=>sum+staffDailyWage(worker),0);}

export function assignStaff(run,staffId,districtId){
  if(!OPERATIONS_DISTRICTS.some(item=>item.id===districtId)||!run.districts?.[districtId])throw new Error("Acquire that district before assigning staff there.");
  const next=structuredClone(run);ensureOperationsState(next);const worker=next.staffRoster.find(item=>item.id===staffId);if(!worker)throw new Error("That staff member no longer exists.");worker.districtId=districtId;return next;
}

export function setStaffShift(run,staffId,shiftId){
  if(!STAFF_SHIFTS.some(item=>item.id===shiftId))throw new Error("Choose a valid shift.");
  const next=structuredClone(run);ensureOperationsState(next);const worker=next.staffRoster.find(item=>item.id===staffId);if(!worker)throw new Error("That staff member no longer exists.");worker.shiftId=shiftId;return next;
}

export function settlePayroll(run){const next=structuredClone(run);ensureOperationsState(next);const amount=Math.min(next.cash,next.operations.payrollDue);next.cash-=amount;next.operations.payrollDue-=amount;next.operations.totalWagesPaid+=amount;return next;}

export function storeSpecialization(run,storeId){return STORE_SPECIALIZATIONS.find(item=>item.id===run.storeSpecializations?.[storeId]&&item.storeId===storeId)||null;}
export function facilitySpecialization(facility){return FACILITY_SPECIALIZATIONS.find(item=>item.id===facility?.specializationId&&item.type===facility?.type)||null;}
export function specializationSynergy(run,storeId){const specialization=storeSpecialization(run,storeId);if(!specialization)return {focus:null,matches:0,service:1,appeal:0};const districtId=districtForStore(storeId),matches=Math.min(3,(run.facilities||[]).filter(facility=>districtForPosition(facility.x,facility.y)===districtId&&facilitySpecialization(facility)?.focus===specialization.focus).length);return {focus:specialization.focus,matches,service:1+matches*.04,appeal:matches*4};}

export function specializationSnapshot(run){
  const stores=STORES.filter(store=>(run.venues?.[store.id]||0)>0).map(store=>{const specialization=storeSpecialization(run,store.id),synergy=specializationSynergy(run,store.id);return {id:store.id,name:store.name,level:run.venues[store.id],specializationId:specialization?.id||null,specializationName:specialization?.name||null,focus:specialization?.focus||null,synergy:synergy.matches,service:venueServiceMultiplier(run,store.id),appeal:(specialization?.appeal||0)+synergy.appeal};});
  const facilities=(run.facilities||[]).filter(facility=>facilitySpecialization(facility)).map(facility=>{const specialization=facilitySpecialization(facility);return {id:facility.id,name:facility.name,type:facility.type,specializationId:specialization.id,specializationName:specialization.name,focus:specialization.focus,districtId:districtForPosition(facility.x,facility.y)};});
  return {stores,facilities,configuredStores:stores.filter(store=>store.specializationId).length,specializedFacilities:facilities.length,totalSynergies:stores.reduce((sum,store)=>sum+store.synergy,0)};
}

export function setStoreSpecialization(run,storeId,specializationId,now=new Date().toISOString()){
  const level=run.venues?.[storeId]||0;if(level<2)throw new Error("Upgrade this store to level 2 before choosing a concept.");
  const specialization=STORE_SPECIALIZATIONS.find(item=>item.id===specializationId&&item.storeId===storeId);if(!specialization)throw new Error("Choose a valid store concept.");
  if(run.storeSpecializations?.[storeId]===specializationId)throw new Error("This concept is already active.");if(run.cash<specialization.cost)throw new Error(`You need ${formatEuro(specialization.cost)} to fit out this concept.`);
  const next=structuredClone(run);if(!next.storeSpecializations)next.storeSpecializations={};if(!Array.isArray(next.specializationHistory))next.specializationHistory=[];const previousId=next.storeSpecializations[storeId]||null;next.cash-=specialization.cost;next.storeSpecializations[storeId]=specializationId;next.specializationHistory.push({at:now,day:run.currentDay,kind:"store",targetId:storeId,previousId,specializationId,cost:specialization.cost});return next;
}

export function setFacilitySpecialization(run,facilityId,specializationId,now=new Date().toISOString()){
  const facility=(run.facilities||[]).find(item=>item.id===facilityId);if(!facility)throw new Error("That facility no longer exists.");
  const specialization=FACILITY_SPECIALIZATIONS.find(item=>item.id===specializationId&&item.type===facility.type);if(!specialization)throw new Error("Choose a blueprint designed for this facility.");
  if(facility.specializationId===specializationId)throw new Error("This blueprint is already active.");if(run.cash<specialization.cost)throw new Error(`You need ${formatEuro(specialization.cost)} to apply this blueprint.`);
  const next=structuredClone(run);if(!Array.isArray(next.specializationHistory))next.specializationHistory=[];const target=next.facilities.find(item=>item.id===facilityId),previousId=target.specializationId||null;next.cash-=specialization.cost;target.specializationId=specializationId;target.specializedDay=run.currentDay;next.specializationHistory.push({at:now,day:run.currentDay,kind:"facility",targetId:facilityId,previousId,specializationId,cost:specialization.cost});return next;
}

export function venueServiceMultiplier(run,storeId){const level=Math.max(0,run.venues?.[storeId]||0),specialization=storeSpecialization(run,storeId),synergy=specializationSynergy(run,storeId);return level?(1+(level-1)*.28)*(specialization?.service||1)*synergy.service:0;}

export function storeOperatingCost(run,storeId){
  const level=Math.max(0,run.venues?.[storeId]||0);if(!level)return 0;
  const hours=run.storeHours?.[storeId]||DEFAULT_STORE_HOURS[storeId],duration=Math.max(120,(hours?.close||DAY_END)-(hours?.open||DAY_START)),dayShare=duration/(DAY_END-DAY_START);
  return Math.round((STORE_DAILY_BASE_COSTS[storeId]||150)*(.42+dayShare*.58)*(1+(level-1)*.62)+(storeSpecialization(run,storeId)?.operating||0));
}

export function dailyOperatingCosts(run){
  const stores=STORES.filter(store=>(run.venues?.[store.id]||0)>0).map(store=>({storeId:store.id,label:store.short,level:run.venues[store.id],cost:storeOperatingCost(run,store.id)}));
  const districts=OPERATIONS_DISTRICTS.filter(district=>district.id!=="coast"&&run.districts?.[district.id]).map(district=>({districtId:district.id,label:district.name,cost:DISTRICT_DAILY_COSTS[district.id]||0}));
  const businesses=DISTRICT_BUSINESSES.filter(business=>run.districtBusinesses?.[business.id]).map(business=>({businessId:business.id,districtId:business.districtId,label:business.name,cost:business.upkeep}));
  return {stores,districts,businesses,total:[...stores,...districts,...businesses].reduce((sum,item)=>sum+item.cost,0)};
}

export function settleOperatingCosts(run){const next=structuredClone(run),performance=ensurePerformanceState(next),amount=Math.min(next.cash,performance.operatingDue);next.cash-=amount;performance.operatingDue-=amount;performance.totalOperatingCostsPaid+=amount;return next;}

export function assetIsClosed(run,targetKind,targetId){ensureOperationsState(run);return run.operations.issues.some(issue=>issue.type==="breakdown"&&issue.targetKind===targetKind&&issue.targetId===targetId);}

export function operationsSnapshot(run){
  ensureOperationsState(run);const open=run.operations.issues,closedAssets=open.filter(issue=>issue.type==="breakdown").length,litter=open.filter(issue=>issue.type==="litter").length;
  const districts=OPERATIONS_DISTRICTS.filter(district=>run.districts?.[district.id]).map(district=>{const issues=open.filter(issue=>issue.districtId===district.id),onShift=run.staffRoster.filter(worker=>worker.districtId===district.id&&staffIsOnShift(worker,run.clockMinutes)).length;return {...district,issues:issues.length,litter:issues.filter(issue=>issue.type==="litter").length,breakdowns:issues.filter(issue=>issue.type==="breakdown").length,onShift,cleanliness:Math.max(0,Math.min(100,94-issues.filter(issue=>issue.type==="litter").length*14))};});
  return {openIssues:open.length,closedAssets,litter,payroll:dailyPayroll(run),payrollDue:run.operations.payrollDue,onShift:run.staffRoster.filter(worker=>staffIsOnShift(worker,run.clockMinutes)).length,districts};
}

export function campusMetrics(run) {
  ensureOperationsState(run);const performance=ensurePerformanceState(run);
  const needs={ hunger:42, thirst:39, bladder:44, energy:46, mood:47, cleanliness:52 };
  const activeEvent=EVENT_CATALOGUE.find(item=>item.id===run.activeEvent?.id)||run.activeEvent;
  for(const facility of run.facilities||[]){
    const blueprint=FACILITY_CATALOGUE.find(item=>item.id===facility.type);
    if(blueprint) Object.entries(blueprint.needs||{}).forEach(([key,value])=>needs[key]+=value);
    const specialization=facilitySpecialization(facility);if(specialization)Object.entries(specialization.needs||{}).forEach(([key,value])=>needs[key]+=value);
  }
  for(const store of STORES){const specialization=storeSpecialization(run,store.id);if((run.venues?.[store.id]||0)>0&&specialization)Object.entries(specialization.needs||{}).forEach(([key,value])=>needs[key]+=value);}
  const activeRole=role=>run.operations.payrollDue>0?0:run.staffRoster.filter(worker=>worker.roleId===role&&staffIsOnShift(worker,run.clockMinutes)).length,openIssues=run.operations.issues||[];
  needs.cleanliness+=activeRole("caretaker")*5-openIssues.filter(issue=>issue.type==="litter").length*8;
  needs.mood+=activeRole("host")*6+activeRole("entertainer")*7-openIssues.filter(issue=>issue.type==="breakdown").length*3;
  needs.energy+=activeRole("host")*2;
  needs.mood+=activeEvent?.moodBonus||0;
  Object.keys(needs).forEach(key=>needs[key]=Math.max(0,Math.min(100,needs[key])));
  const experiences=(run.facilities||[]).filter(item=>item.type==="experience");
  const attraction=experiences.reduce((best,item)=>{const stats=attractionStats(item.modules);return stats.excitement>best.excitement?stats:best;},{excitement:0,intensity:0,comfort:42,cost:0});
  attraction.comfort=Math.min(100,attraction.comfort+activeRole("technician")*4);
  const satisfaction=Math.round(Object.values(needs).reduce((sum,value)=>sum+value,0)/Object.keys(needs).length);
  const intensityFit=attraction.intensity<=70?10:Math.max(-18,10-(attraction.intensity-70));
  const eventNoisePenalty=activeEvent?Math.max(0,(activeEvent.noise||0)-55)*.2:0,eventComfortBonus=activeEvent?((activeEvent.comfort||50)-50)*.08:0;
  const rating=Math.max(0,Math.min(100,Math.round(satisfaction*.72+Math.min(100,attraction.excitement+20)*.18+intensityFit-eventNoisePenalty+eventComfortBonus)));
  const venueLevels=Object.values(run.venues||{}).reduce((sum,level)=>sum+(level||0),0),openVenues=Object.values(run.venues||{}).filter(level=>level>0).length,districts=DISTRICT_CATALOGUE.filter(district=>run.districts?.[district.id]).length+1,builtBusinesses=DISTRICT_BUSINESSES.filter(business=>run.districtBusinesses?.[business.id]),businessAppeal=builtBusinesses.reduce((sum,business)=>sum+business.appeal,0),eventBonus=activeEvent?(activeEvent.guestBonus+activeRole("entertainer")*3):0,momentumFactor=.7+performance.momentum*.006;
  const specializationAppeal=STORES.reduce((sum,store)=>{const specialization=storeSpecialization(run,store.id),synergy=specializationSynergy(run,store.id);return sum+(specialization?.appeal||0)+synergy.appeal;},0)+(run.facilities||[]).reduce((sum,facility)=>sum+(facilitySpecialization(facility)?.appeal||0),0);
  const baseGuests=10+rating*.27+(run.facilities||[]).length*1.5+activeRole("host")*3+attraction.excitement*.12+openVenues*2.3+Math.max(0,venueLevels-openVenues)*1.35+Math.max(0,districts-1)*5+builtBusinesses.length*1.6+businessAppeal*.16+eventBonus+specializationAppeal*.08;
  const calendar=calendarDay(run),guests=Math.max(8,Math.round(baseGuests*momentumFactor*calendar.attendance));
  return { needs, satisfaction, rating, guests, baseGuests:Math.round(baseGuests), momentum:performance.momentum, momentumFactor, attraction, calendar };
}

export function tycoonPulse(run){
  ensureOperationsState(run);const performance=ensurePerformanceState(run),metrics=campusMetrics(run),operations=operationsSnapshot(run),costs=dailyOperatingCosts(run);
  const products=CATALOGUE.filter(product=>(run.venues?.[product.storeId]||0)>=(product.tier||1)),stocked=products.filter(product=>(run.stock?.[product.id]||0)>0).length,stockCoverage=products.length?Math.round(stocked/products.length*100):0;
  const priceScore=products.length?Math.round(products.reduce((sum,product)=>{const ratio=(run.prices?.[product.id]||product.reference)/product.reference;return sum+(ratio<=1.05?100:ratio<=1.5?Math.round(100-(ratio-1.05)*75):ratio<=2?Math.round(66-(ratio-1.5)*92):0);},0)/products.length):0;
  const cleanliness=operations.districts.length?Math.round(operations.districts.reduce((sum,district)=>sum+district.cleanliness,0)/operations.districts.length):100,openAssets=Math.max(0,100-operations.closedAssets*22),coverage=operations.openIssues?Math.min(100,Math.round((operations.onShift/Math.max(1,operations.openIssues))*72)):Math.min(100,55+operations.onShift*12);
  const operationsScore=Math.max(0,Math.min(100,Math.round(cleanliness*.44+openAssets*.36+coverage*.2-(operations.payrollDue?30:0)-(performance.operatingDue?18:0))));
  const lastProfit=run.history?.at(-1)?.totals?.operatingProfit??0,profitSignal=run.history?.length?Math.max(0,Math.min(100,50+lastProfit/18)):55,commercialScore=Math.max(0,Math.min(100,Math.round(stockCoverage*.42+priceScore*.34+profitSignal*.24)));
  const guestScore=Math.max(0,Math.min(100,Math.round(metrics.rating*.55+metrics.satisfaction*.25+performance.momentum*.2))),score=Math.round(guestScore*.38+operationsScore*.32+commercialScore*.3);
  const alerts=[];
  if(operations.payrollDue)alerts.push({severity:"critical",title:"Staff payroll overdue",detail:`${formatEuro(operations.payrollDue)} must be settled before the team works again.`,action:"operations"});
  if(performance.operatingDue)alerts.push({severity:"critical",title:"Campus bills overdue",detail:`${formatEuro(performance.operatingDue)} in venue and district costs is weakening momentum.`,action:"finance"});
  if(operations.closedAssets)alerts.push({severity:"high",title:`${operations.closedAssets} asset${operations.closedAssets===1?"":"s"} closed`,detail:"Closed destinations reduce choice, rating and earning capacity.",action:"operations"});
  if(operations.litter)alerts.push({severity:"medium",title:"Cleanliness pressure",detail:`${operations.litter} litter work order${operations.litter===1?" is":"s are"} lowering campus quality.`,action:"operations"});
  if(stockCoverage<65)alerts.push({severity:"high",title:"Sales are being left on the table",detail:`Only ${stockCoverage}% of unlocked products are stocked.`,action:"stock"});
  if(priceScore<60)alerts.push({severity:"medium",title:"Price resistance is growing",detail:"Several products are priced high enough to reduce guest conversion.",action:"stores"});
  if(metrics.rating<60)alerts.push({severity:"medium",title:"Campus quality is limiting attendance",detail:`A ${metrics.rating}% rating suppresses the next visitor waves.`,action:"build"});
  if(!alerts.length)alerts.push({severity:"good",title:"Campus systems are aligned",detail:"Use the healthy momentum to invest before the next crowd peak.",action:"progress"});
  const projectedProfit=(run.today?.revenue||0)-(run.today?.cogs||0)+(run.today?.eventRevenue||0)-(run.today?.eventCosts||0)+districtPortfolio(run).totalProjectedIncome-dailyPayroll(run)-costs.total;
  return {score,status:score>=82?"Thriving":score>=66?"Healthy":score>=48?"Under pressure":"At risk",guestScore,operationsScore,commercialScore,stockCoverage,priceScore,cleanliness,momentum:performance.momentum,momentumFactor:metrics.momentumFactor,projectedGuests:metrics.guests,projectedProfit,costs,alerts:alerts.slice(0,5)};
}

export function managementOverview(run){
  const metrics=campusMetrics(run),operations=operationsSnapshot(run),pulse=tycoonPulse(run),phase=campusPhase(run.clockMinutes);
  const stores=STORES.map(store=>{
    const level=run.venues?.[store.id]||0,products=CATALOGUE.filter(product=>product.storeId===store.id&&(product.tier||1)<=level),stockUnits=products.reduce((sum,product)=>sum+(run.stock?.[product.id]||0),0),stocked=products.filter(product=>(run.stock?.[product.id]||0)>0).length;
    const coverage=products.length?Math.round(stocked/products.length*100):0,closed=level>0&&assetIsClosed(run,"venue",store.id),open=level>0&&storeIsOpen(run,store.id)&&!closed;
    const sales=products.reduce((sum,product)=>sum+(run.today?.products?.[product.id]?.revenue||0),0),cogs=products.reduce((sum,product)=>sum+(run.today?.products?.[product.id]?.cogs||0),0);
    return {id:store.id,name:store.name,short:store.short,color:store.color,districtId:districtForStore(store.id),level,open,closed,status:!level?"locked":closed?"repair":open?"open":"closed",products:products.length,stocked,stockUnits,stockCoverage:coverage,revenue:sales,grossProfit:sales-cogs,dailyCost:storeOperatingCost(run,store.id)};
  });
  const districts=operations.districts.map(district=>{
    const venues=stores.filter(store=>store.level>0&&store.districtId===district.id),facilities=(run.facilities||[]).filter(facility=>districtForPosition(facility.x,facility.y)===district.id);
    return {...district,venues:venues.length,openVenues:venues.filter(store=>store.open).length,stockUnits:venues.reduce((sum,store)=>sum+store.stockUnits,0),facilities:facilities.length};
  });
  const needs=Object.entries(metrics.needs).map(([id,value])=>({id,label:id[0].toUpperCase()+id.slice(1),value})).sort((a,b)=>a.value-b.value);
  return {phase:{id:phase.id,name:phase.name,multiplier:phase.multiplier},guests:metrics.guests,rating:metrics.rating,satisfaction:metrics.satisfaction,momentum:pulse.momentum,score:pulse.score,status:pulse.status,projectedProfit:pulse.projectedProfit,alerts:pulse.alerts,weakestNeeds:needs.slice(0,3),stores,districts};
}

function closeDayMomentum(run,operatingProfit,metrics,stockCoverage){
  const performance=ensurePerformanceState(run),before=performance.momentum,issues=run.operations?.issues?.length||0,walkaways=run.today?.walkaways||0;
  const drivers=[
    {label:`${metrics.rating}% campus rating`,impact:Math.round((metrics.rating-62)/9)},
    {label:operatingProfit>=0?"Profitable operation":"Operating loss",impact:operatingProfit>=0?5:-7},
    {label:`${stockCoverage}% product availability`,impact:stockCoverage>=80?3:stockCoverage<50?-5:0},
    {label:issues?`${issues} unresolved work orders`:"Campus clear at close",impact:issues?-Math.min(6,issues*2):2},
    {label:walkaways?`${walkaways} queue walkaways`:"Queues retained guests",impact:walkaways?-Math.min(5,walkaways):1}
  ];
  if(performance.operatingDue)drivers.push({label:"Campus bills overdue",impact:-6});
  const change=drivers.reduce((sum,driver)=>sum+driver.impact,0);performance.momentum=Math.max(15,Math.min(100,before+change));performance.peakRating=Math.max(performance.peakRating,metrics.rating);if(operatingProfit>=0)performance.profitableDays+=1;else performance.lossDays+=1;
  performance.lastDay={day:run.currentDay,before,after:performance.momentum,change:performance.momentum-before,drivers};return performance.lastDay;
}

export function progressionState(run){
  const venueLevels=Object.values(run.venues||{}).reduce((sum,level)=>sum+(level||0),0),districtCount=DISTRICT_CATALOGUE.filter(district=>run.districts?.[district.id]).length+1,businessCount=Object.values(run.districtBusinesses||{}).filter(Boolean).length;
  const xp=Math.floor((run.totalSales||0)*12+(run.totalCampusInteractions||0)*1.5+(run.reputation||0)*8+(run.facilities||[]).length*18+(run.upgrades||[]).length*30+venueLevels*12+Math.max(0,districtCount-1)*70+businessCount*24+(run.eventHistory||[]).length*45);
  let current=PROGRESSION_LEVELS[0];for(const tier of PROGRESSION_LEVELS)if(xp>=tier.xp)current=tier;
  const next=PROGRESSION_LEVELS.find(tier=>tier.level===current.level+1)||null,span=next?next.xp-current.xp:1,progress=next?Math.max(0,Math.min(100,Math.round((xp-current.xp)/span*100))):100;
  return {xp,level:current.level,title:current.title,unlock:current.unlock,next,progress};
}

export function scenarioGoals(run){const metrics=campusMetrics(run),progress=progressionState(run);return [
  {id:"visitors",name:"Campus destination",description:"Welcome 250 lifetime guests",value:Math.min(250,run.totalVisitors||0),target:250,complete:(run.totalVisitors||0)>=250},
  {id:"rating",name:"World-class campus",description:"Reach a 90% campus rating",value:metrics.rating,target:90,complete:metrics.rating>=90},
  {id:"portfolio",name:"District portfolio",description:"Acquire all five expansion districts",value:DISTRICT_CATALOGUE.filter(district=>run.districts?.[district.id]).length,target:DISTRICT_CATALOGUE.length,complete:DISTRICT_CATALOGUE.every(district=>run.districts?.[district.id])},
  {id:"legend",name:"Nova legend",description:"Reach company level 10",value:progress.level,target:10,complete:progress.level>=10}
];}

export function districtWeather(run,offset=0){const states=[{id:"clear",name:"Clear Atlantic sun",icon:"☀",factor:1.22},{id:"wind",name:"Strong coastal wind",icon:"≈",factor:.92},{id:"cloud",name:"Bright overcast",icon:"☁",factor:1},{id:"rain",name:"Coastal showers",icon:"☂",factor:.58}],index=Math.abs(((run?.currentDay||1)+offset)*7+3)%states.length;return states[index];}

function districtBusinessMultiplier(run,business){
  const day=calendarDay(run),phase=campusPhase(run.clockMinutes),weather=districtWeather(run);let factor=1;
  if(business.districtId==="village")factor*=phase.id==="sunset"||day.id==="weekend"?1.38:.88;
  if(business.districtId==="east")factor*=weather.factor*(phase.id==="sunset"?1.25:1);
  if(business.districtId==="innovation")factor*=day.id==="career"?1.52:["lecture","exam"].includes(day.id)?1.12:.76;
  if(business.districtId==="sports")factor*=["surf","festival"].includes(day.id)?1.42:phase.id==="break"?1.22:.92;
  if(business.districtId==="transit")factor*=["arrival","sunset"].includes(phase.id)?1.46:1.02;
  return factor;
}

function ensureDistrictOperations(run,businessId=null,starterStock=0){
  if(!run.districtOperations)run.districtOperations={};if(!Array.isArray(run.districtOfferSales))run.districtOfferSales=[];
  const businesses=businessId?[businessId]:DISTRICT_BUSINESSES.map(item=>item.id);for(const id of businesses){const created=!run.districtOperations[id];if(created)run.districtOperations[id]={stock:{},prices:{}};const operation=run.districtOperations[id],initialStock=created&&run.districtBusinesses?.[id]?Math.max(4,starterStock):starterStock;if(!operation.stock)operation.stock={};if(!operation.prices)operation.prices={};for(const offer of DISTRICT_BUSINESS_OFFERS.filter(item=>item.businessId===id)){if(!Number.isInteger(operation.stock[offer.id]))operation.stock[offer.id]=initialStock;if(!Number.isInteger(operation.prices[offer.id]))operation.prices[offer.id]=offer.reference;}}
  return run;
}

export function districtOfferDemand(run,offerId){
  const offer=DISTRICT_BUSINESS_OFFERS.find(item=>item.id===offerId);if(!offer)return 0;ensureDistrictOperations(run,offer.businessId);const business=DISTRICT_BUSINESSES.find(item=>item.id===offer.businessId),price=run.districtOperations[offer.businessId].prices[offer.id],phase=campusPhase(run.clockMinutes);let needFactor=1;if(offer.need==="hunger")needFactor=["lunch","sunset"].includes(phase.id)?1.45:.88;if(offer.need==="thirst")needFactor=["arrival","break","sunset"].includes(phase.id)?1.35:.92;if(offer.need==="energy")needFactor=["arrival","break"].includes(phase.id)?1.4:.9;if(offer.need==="mood")needFactor=phase.id==="sunset"?1.35:1;return Math.max(0,Math.min(30,Math.round(demandFor(price,offer.reference)*districtBusinessMultiplier(run,business)*needFactor)));
}

export function districtBusinessForecast(run,businessId){
  ensureDistrictOperations(run,businessId);const operation=run.districtOperations[businessId],offers=DISTRICT_BUSINESS_OFFERS.filter(item=>item.businessId===businessId).map(offer=>{const price=operation.prices[offer.id],stock=operation.stock[offer.id],demand=districtOfferDemand(run,offer.id),soldToday=run.today?.districtOffers?.[offer.id]?.units||0,remainingDemand=Math.max(0,demand-soldToday),units=Math.min(stock,remainingDemand);return {...offer,price,stock,demand,soldToday,remainingDemand,units,revenue:units*price,cogs:units*offer.cost,grossProfit:units*(price-offer.cost)};});return {businessId,offers,revenue:offers.reduce((sum,item)=>sum+item.revenue,0),cogs:offers.reduce((sum,item)=>sum+item.cogs,0),grossProfit:offers.reduce((sum,item)=>sum+item.grossProfit,0)};
}

export function buyDistrictOfferStock(run,offerId,quantity,now=new Date().toISOString()){
  const offer=DISTRICT_BUSINESS_OFFERS.find(item=>item.id===offerId);if(!offer)throw new Error("Unknown district offer.");if(!Number.isInteger(quantity)||quantity<=0)throw new Error("Quantity must be a positive whole number.");if(!run.districtBusinesses?.[offer.businessId])throw new Error("Open this business first.");const total=offer.cost*quantity;if(run.cash<total)throw new Error(`You need ${formatEuro(total)} for this order.`);const next=structuredClone(run);ensureDistrictOperations(next,offer.businessId);next.cash-=total;next.districtOperations[offer.businessId].stock[offer.id]+=quantity;next.districtBusinessHistory.push({at:now,day:run.currentDay,businessId:offer.businessId,offerId,cost:total,quantity,type:"stock"});return next;
}

export function setDistrictOfferPrice(run,offerId,price,now=new Date().toISOString()){
  const offer=DISTRICT_BUSINESS_OFFERS.find(item=>item.id===offerId);if(!offer)throw new Error("Unknown district offer.");if(!Number.isInteger(price)||price<=0)throw new Error("Price must be a positive euro amount.");if(!run.districtBusinesses?.[offer.businessId])throw new Error("Open this business first.");const next=structuredClone(run);ensureDistrictOperations(next,offer.businessId);next.districtOperations[offer.businessId].prices[offer.id]=price;next.districtBusinessHistory.push({at:now,day:run.currentDay,businessId:offer.businessId,offerId,price,type:"price"});return next;
}

export function completeDistrictOfferSale(run,offerId,budget=Infinity,guestId=null,now=new Date().toISOString()){
  const offer=DISTRICT_BUSINESS_OFFERS.find(item=>item.id===offerId);if(!offer)throw new Error("Unknown district offer.");if(!run.districtBusinesses?.[offer.businessId]||assetIsClosed(run,"district-business",offer.businessId))throw new Error("This business is not operating.");const next=structuredClone(run);ensureDistrictOperations(next,offer.businessId);const operation=next.districtOperations[offer.businessId],price=operation.prices[offer.id];if(operation.stock[offer.id]<=0)throw new Error(`${offer.name} is out of capacity.`);if(price>budget)throw new Error(`${offer.name} is outside this guest's budget.`);if((next.today?.districtOffers?.[offer.id]?.units||0)>=districtOfferDemand(next,offer.id))throw new Error(`Today's demand for ${offer.name} has been met.`);operation.stock[offer.id]-=1;next.cash+=price;if(!next.today.districtOffers)next.today.districtOffers={};const row=next.today.districtOffers[offer.id]||{units:0,revenue:0,cogs:0};row.units+=1;row.revenue+=price;row.cogs+=offer.cost;next.today.districtOffers[offer.id]=row;next.today.districtOfferRevenue=(next.today.districtOfferRevenue||0)+price;next.today.districtOfferCogs=(next.today.districtOfferCogs||0)+offer.cost;next.districtOfferSales.push({at:now,day:next.currentDay,businessId:offer.businessId,offerId,price,cost:offer.cost,guestId});next.guestEconomy.purchases+=1;next.guestEconomy.spend+=price;next.totalSales+=1;recordGuestActivityInPlace(next,{kind:"district-business",id:offer.businessId});return next;
}

export function districtPortfolio(run){
  ensureDistrictOperations(run);const businesses=DISTRICT_BUSINESSES.map(business=>{const owned=Boolean(run.districtBusinesses?.[business.id]),closed=owned&&assetIsClosed(run,"district-business",business.id),multiplier=districtBusinessMultiplier(run,business),forecast=owned&&!closed?districtBusinessForecast(run,business.id):{revenue:0,cogs:0,grossProfit:0,offers:[]};return {...business,owned,closed,multiplier,forecast,projectedIncome:forecast.revenue,projectedProfit:forecast.grossProfit};});
  const districts=[{id:"coast",name:"Academic Core",color:"#64cbc8",icon:"A",problem:"Predictable student traffic",rhythm:"Arrival, lunch and lecture breaks",owned:true,level:1,cost:0,description:"The original campus economy around Atlantic Café and the academic courtyard.",features:["Atlantic Café","Study spaces","Predictable student traffic"]},...DISTRICT_CATALOGUE].map(district=>{const rows=businesses.filter(business=>business.districtId===district.id),owned=district.id==="coast"||Boolean(run.districts?.[district.id]);return {...district,owned,businesses:rows,built:rows.filter(row=>row.owned).length,projectedIncome:rows.reduce((sum,row)=>sum+row.projectedIncome,0),upkeep:rows.filter(row=>row.owned).reduce((sum,row)=>sum+row.upkeep,0)};});
  return {districts,businesses,weather:districtWeather(run),totalProjectedIncome:businesses.reduce((sum,row)=>sum+row.projectedIncome,0),totalUpkeep:businesses.filter(row=>row.owned).reduce((sum,row)=>sum+row.upkeep,0)};
}

export function unlockDistrict(run,districtId,now=new Date().toISOString()){
  const district=DISTRICT_CATALOGUE.find(item=>item.id===districtId);if(!district)throw new Error("Unknown campus district.");
  if(run.districts?.[districtId])throw new Error("This district is already unlocked.");
  if(progressionState(run).level<district.level)throw new Error(`Reach company level ${district.level} to acquire ${district.name}.`);
  const prerequisites={innovation:"village",sports:"east",transit:"innovation"},requiredDistrict=prerequisites[districtId];if(requiredDistrict&&!run.districts?.[requiredDistrict])throw new Error(`Acquire ${DISTRICT_CATALOGUE.find(item=>item.id===requiredDistrict)?.name} first.`);
  if(run.cash<district.cost)throw new Error(`You need ${formatEuro(district.cost)} to acquire ${district.name}.`);
  const next=structuredClone(run);if(!next.districts)next.districts={coast:1,village:0,east:0,innovation:0,sports:0,transit:0,pier:0};next.cash-=district.cost;next.districts[districtId]=1;
  if(!Array.isArray(next.districtPurchases))next.districtPurchases=[];next.districtPurchases.push({at:now,day:run.currentDay,districtId,cost:district.cost});next.reputation=(next.reputation||0)+12;return next;
}

export function unlockDistrictBusiness(run,businessId,now=new Date().toISOString()){
  const business=DISTRICT_BUSINESSES.find(item=>item.id===businessId);if(!business)throw new Error("Unknown district business.");
  if(!run.districts?.[business.districtId])throw new Error(`Acquire ${DISTRICT_CATALOGUE.find(item=>item.id===business.districtId)?.name} first.`);
  if(run.districtBusinesses?.[businessId])throw new Error("This business is already operating.");if(run.cash<business.cost)throw new Error(`You need ${formatEuro(business.cost)} to open ${business.name}.`);
  const next=structuredClone(run);if(!next.districtBusinesses)next.districtBusinesses={};if(!Array.isArray(next.districtBusinessHistory))next.districtBusinessHistory=[];next.cash-=business.cost;next.districtBusinesses[businessId]=1;ensureDistrictOperations(next,businessId,4);next.districtBusinessHistory.push({at:now,day:run.currentDay,businessId,districtId:business.districtId,cost:business.cost});next.reputation=(next.reputation||0)+Math.max(2,Math.round(business.appeal/3));return next;
}

export function unlockEventVenue(run,now=new Date().toISOString()){
  if(run.eventVenue)throw new Error("The Coastline Pavilion is already open.");if(!run.districts?.east)throw new Error("Acquire the Beachfront first.");
  if(progressionState(run).level<7)throw new Error("Reach company level 7 to build the Coastline Pavilion.");const cost=50000;if(run.cash<cost)throw new Error(`You need ${formatEuro(cost)} to build the pavilion.`);
  const next=structuredClone(run);next.cash-=cost;next.eventVenue=1;next.reputation=(next.reputation||0)+18;next.eventVenueOpenedAt={at:now,day:run.currentDay,cost};return next;
}

export function launchEvent(run,eventId,now=new Date().toISOString()){
  const event=EVENT_CATALOGUE.find(item=>item.id===eventId);if(!event)throw new Error("Unknown event.");if(!run.eventVenue)throw new Error("Build the Coastline Pavilion first.");
  if(run.activeEvent)throw new Error("Another event is already running.");if(progressionState(run).level<event.level)throw new Error(`Reach company level ${event.level} to host ${event.name}.`);if(run.cash<event.cost)throw new Error(`You need ${formatEuro(event.cost)} to host this event.`);
  const next=structuredClone(run);next.cash-=event.cost;next.activeEvent={id:event.id,name:event.name,remainingMinutes:event.duration,startedAt:now,day:run.currentDay};if(!Array.isArray(next.eventHistory))next.eventHistory=[];next.eventHistory.push({at:now,day:run.currentDay,eventId:event.id,cost:event.cost});return next;
}

export function facilityFootprint(type,rotation=0) {
  const base=FACILITY_FOOTPRINTS[type]||{width:1,height:1},turn=((Number(rotation)||0)%4+4)%4;
  return turn%2?{width:base.height,height:base.width}:{...base};
}

function facilityOverlap(a,b) {
  const af=facilityFootprint(a.type,a.rotation),bf=facilityFootprint(b.type,b.rotation);
  return Math.abs(a.x-b.x)<(af.width+bf.width)/2+.08&&Math.abs(a.y-b.y)<(af.height+bf.height)/2+.08;
}

export function placeFacility(run,type,x,y,moduleIds=[],rotation=0) {
  if(!Number.isFinite(x)||!Number.isFinite(y)) throw new Error("Choose a valid campus tile.");
  const turn=((Number(rotation)||0)%4+4)%4;
  const candidate={type,x,y,rotation:turn};
  if((run.facilities||[]).some(item=>facilityOverlap(item,candidate))) throw new Error("That footprint overlaps another facility.");
  let cost,name,modules=[];
  if(type==="experience"){
    modules=[...new Set(moduleIds)].filter(id=>EXPERIENCE_MODULES.some(item=>item.id===id));
    if(!modules.length) throw new Error("Choose at least one attraction module.");
    cost=1200+attractionStats(modules).cost;name="Custom Beach Experience";
  }else{
    const blueprint=FACILITY_CATALOGUE.find(item=>item.id===type);if(!blueprint)throw new Error("Unknown facility.");
    if(type==="foodGarden"&&progressionState(run).level<3)throw new Error("Reach company level 3 to build the Food Garden.");
    cost=blueprint.cost;name=blueprint.name;
  }
  if(run.cash<cost) throw new Error(`You need ${formatEuro(cost)} but only have ${formatEuro(run.cash)}.`);
  const next=structuredClone(run);if(!Array.isArray(next.facilities))next.facilities=[];
  next.cash-=cost;next.facilities.push({id:`facility-${Date.now()}-${next.facilities.length}`,type,name,x,y,rotation:turn,modules,builtDay:run.currentDay,cost});
  return next;
}

export function moveFacility(run,facilityId,x,y,rotation=0) {
  if(!Number.isFinite(x)||!Number.isFinite(y))throw new Error("Choose a valid campus tile.");
  const source=(run.facilities||[]).find(item=>item.id===facilityId);if(!source)throw new Error("That facility no longer exists.");
  const turn=((Number(rotation)||0)%4+4)%4,candidate={...source,x,y,rotation:turn};
  if((run.facilities||[]).some(item=>item.id!==facilityId&&facilityOverlap(item,candidate)))throw new Error("That footprint overlaps another facility.");
  const next=structuredClone(run),target=next.facilities.find(item=>item.id===facilityId);target.x=x;target.y=y;target.rotation=turn;return next;
}

export function demolishFacility(run,facilityId) {
  const source=(run.facilities||[]).find(item=>item.id===facilityId);if(!source)throw new Error("That facility no longer exists.");
  const next=structuredClone(run),refund=Math.floor((source.cost||0)*.4);next.facilities=next.facilities.filter(item=>item.id!==facilityId);next.cash+=refund;
  if(!Array.isArray(next.demolitions))next.demolitions=[];next.demolitions.push({facilityId,name:source.name,day:run.currentDay,refund});return next;
}

export function hireStaff(run,staffId,now=new Date().toISOString()) {
  const role=STAFF_CATALOGUE.find(item=>item.id===staffId);if(!role)throw new Error("Unknown staff role.");
  if(progressionState(run).level<(role.level||1))throw new Error(`Reach company level ${role.level} to hire ${role.name}.`);
  if(run.cash<role.cost) throw new Error(`You need ${formatEuro(role.cost)} but only have ${formatEuro(run.cash)}.`);
  const next=structuredClone(run);ensureOperationsState(next);const ordinal=next.staffRoster.filter(worker=>worker.roleId===staffId).length+1,id=`staff-${staffId}-${next.currentDay}-${next.staffRoster.length+1}`;
  next.cash-=role.cost;next.staffRoster.push({id,roleId:staffId,districtId:"coast",shiftId:"full",hiredDay:next.currentDay,hiredAt:now});next.staff[staffId]=ordinal;
  if(!Array.isArray(next.staffHires))next.staffHires=[];next.staffHires.push({at:now,day:run.currentDay,staffId,staffRecordId:id,cost:role.cost});
  return next;
}

export function demandFor(price, reference) {
  if (!Number.isInteger(price) || price <= 0) throw new Error("Price must be positive and use at most two decimal places.");
  if (price <= reference) return 10;
  if (price <= reference * 2) return 5;
  return 0;
}

export function parseEuro(value) {
  const clean = String(value).trim().replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(clean)) throw new Error("Enter a positive euro amount with up to two decimals.");
  const cents = Math.round(Number(clean) * 100);
  if (cents <= 0) throw new Error("Price must be greater than €0.00.");
  return cents;
}

export function buyStock(run, productId, quantity, now = new Date().toISOString()) {
  if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("Quantity must be a positive whole number.");
  const product = CATALOGUE.find(item => item.id === productId);
  if (!product) throw new Error("Unknown product.");
  if ((run.venues?.[product.storeId] ?? 0) < (product.tier || 1)) throw new Error(`Open or upgrade this venue to level ${product.tier} to unlock ${product.name}.`);
  const total = product.cost * quantity;
  if (total > run.cash) throw new Error(`You need ${formatEuro(total)} but only have ${formatEuro(run.cash)}.`);
  const next = structuredClone(run);
  next.cash -= total;
  next.stock[productId] += quantity;
  next.purchases.push({ at: now, day: run.currentDay, productId, quantity, total });
  return next;
}

export function campusPhase(minutes){
  const value=Math.max(DAY_START,Math.min(DAY_END-.001,Number(minutes)||DAY_START));
  return CAMPUS_DAY_PHASES.find(phase=>value>=phase.start&&value<phase.end)||CAMPUS_DAY_PHASES.at(-1);
}

export function storeIsOpen(run,storeId,minutes=run.clockMinutes){
  const hours=run.storeHours?.[storeId]||DEFAULT_STORE_HOURS[storeId];
  return Boolean(hours&&minutes>=hours.open&&minutes<hours.close&&!assetIsClosed(run,"store",storeId)&&!activeVenueProject(run,storeId));
}

export function setStoreHours(run,storeId,open,close){
  if(!STORES.some(store=>store.id===storeId))throw new Error("Unknown venue.");
  if(!Number.isInteger(open)||!Number.isInteger(close)||open<DAY_START||close>DAY_END||close-open<120)throw new Error("Opening hours must fit the campus day and span at least two hours.");
  const next=structuredClone(run);if(!next.storeHours)next.storeHours=structuredClone(DEFAULT_STORE_HOURS);next.storeHours[storeId]={open,close};return next;
}

export function nextDeliveryWindow(run){
  const slot=DELIVERY_WINDOWS.find(window=>window.minute>run.clockMinutes+5);
  return slot?{day:run.currentDay,...slot}:{day:run.currentDay+1,...DELIVERY_WINDOWS[0]};
}

export function scheduleDelivery(run,productId,quantity,now=new Date().toISOString()){
  if(!Number.isInteger(quantity)||quantity<=0)throw new Error("Quantity must be a positive whole number.");
  const product=CATALOGUE.find(item=>item.id===productId);if(!product)throw new Error("Unknown product.");
  if((run.venues?.[product.storeId]??0)<(product.tier||1))throw new Error(`Open or upgrade this venue to level ${product.tier} to unlock ${product.name}.`);
  const total=product.cost*quantity;if(total>run.cash)throw new Error(`You need ${formatEuro(total)} but only have ${formatEuro(run.cash)}.`);
  const next=structuredClone(run),window=nextDeliveryWindow(next);if(!Array.isArray(next.deliveries))next.deliveries=[];
  next.cash-=total;const delivery={id:`delivery-${next.currentDay}-${next.deliveries.length+1}-${productId}`,orderedAt:now,orderedDay:next.currentDay,productId,quantity,total,arrivalDay:window.day,arrivalMinute:window.minute,windowId:window.id,label:window.label,status:"scheduled"};
  next.deliveries.push(delivery);next.purchases.push({at:now,day:run.currentDay,productId,quantity,total,deliveryId:delivery.id,arrivalDay:window.day,arrivalMinute:window.minute});return next;
}

export function setPrice(run, productId, cents) {
  if (!Number.isInteger(cents) || cents <= 0) throw new Error("Price must be positive and use at most two decimals.");
  if (!CATALOGUE.some(item => item.id === productId)) throw new Error("Unknown product.");
  const next = structuredClone(run);
  next.prices[productId] = cents;
  return next;
}

export function unlockVenue(run,storeId,now=new Date().toISOString()){
  if(!STORES.some(store=>store.id===storeId))throw new Error("Unknown venue.");
  if((run.venues?.[storeId]??0)>0)throw new Error("This venue is already open.");
  const required=STORE_REQUIREMENTS[storeId]||1;if(progressionState(run).level<required)throw new Error(`Reach company level ${required} to open this venue.`);
  if(storeId==="beach"&&!run.districts?.east)throw new Error("Acquire the Beachfront before opening the Beach Bar.");
  if(storeId==="surf"&&!run.districts?.east)throw new Error("Acquire the Beachfront before opening the Surf Shack.");
  const cost=STORE_UNLOCKS[storeId];if(run.cash<cost)throw new Error(`You need ${formatEuro(cost)} to open this venue.`);
  if(activeVenueProject(run,storeId))throw new Error("This venue already has an active construction project.");
  const next=structuredClone(run);next.cash-=cost;next.venues[storeId]=1;startVenueProject(next,storeId,"open",0,1,VENUE_PROJECT_DURATIONS.open,now);
  if(!Array.isArray(next.venuePurchases))next.venuePurchases=[];next.venuePurchases.push({at:now,day:run.currentDay,storeId,cost});
  return next;
}

export function crowdPeak(minutes,run=null){
  const phase=campusPhase(minutes),day=run?calendarDay(run):null,dayFactor=day?.phaseMultipliers?.[phase.id]||1;return {id:phase.id,label:phase.name,multiplier:phase.multiplier*dayFactor,start:phase.start,end:phase.end,color:phase.color,description:phase.description,dayFactor,calendarId:day?.id||null};
}

export function advanceTycoon(run,minutes){
  const next=structuredClone(run);ensureTycoonState(next);let remaining=Math.max(0,minutes);
  while(remaining>.001){
    const untilClose=DAY_END-next.clockMinutes,step=Math.min(5,remaining,untilClose);
    if(step<=0){closeTycoonDay(next);continue;}
    processSlice(next,step);next.clockMinutes+=step;remaining-=step;
    if(next.clockMinutes>=DAY_END-.001)closeTycoonDay(next);
  }
  return next;
}

function ensureTycoonState(run){
  if(!Number.isFinite(run.clockMinutes))run.clockMinutes=DAY_START;
  if(!run.today)run.today=createToday();if(!run.today.products)run.today.products={};if(!run.today.activities)run.today.activities={};if(!run.today.guestGroups)run.today.guestGroups={};
  if(!Number.isFinite(run.today.eventRevenue))run.today.eventRevenue=0;if(!Number.isFinite(run.today.eventCosts))run.today.eventCosts=0;if(!Number.isInteger(run.today.eventAttendance))run.today.eventAttendance=0;
  if(!Number.isInteger(run.today.staffWages))run.today.staffWages=0;if(!Number.isInteger(run.today.staffWagesPaid))run.today.staffWagesPaid=0;if(!Number.isInteger(run.today.operatingCosts))run.today.operatingCosts=0;if(!Number.isInteger(run.today.operatingCostsPaid))run.today.operatingCostsPaid=0;if(!Number.isInteger(run.today.issuesResolved))run.today.issuesResolved=0;if(!Number.isInteger(run.today.walkaways))run.today.walkaways=0;
  if(!run.salesProgress)run.salesProgress={};if(!Number.isFinite(run.visitorProgress))run.visitorProgress=0;
  if(!Number.isInteger(run.totalSales))run.totalSales=run.history?.reduce((sum,day)=>sum+(day.totals?.unitsSold||0),0)||0;
  if(!Number.isInteger(run.totalVisitors))run.totalVisitors=run.history?.reduce((sum,day)=>sum+(day.campus?.guests||0),0)||0;
  run.version=9;run.salesMode="guests";if(!Array.isArray(run.guestSales))run.guestSales=[];if(!run.guestEconomy)run.guestEconomy={purchases:0,spend:0,walkaways:0};if(!run.storeSpecializations)run.storeSpecializations={};if(!Array.isArray(run.specializationHistory))run.specializationHistory=[];if(!Array.isArray(run.venueProjects))run.venueProjects=[];if(!run.calendar)run.calendar={cycle:"nova-week-v1",startedDay:1};if(!run.districtBusinesses)run.districtBusinesses={};if(!Array.isArray(run.districtBusinessHistory))run.districtBusinessHistory=[];ensureDistrictOperations(run);
  if(!Number.isInteger(run.guestEconomy.purchases))run.guestEconomy.purchases=0;if(!Number.isInteger(run.guestEconomy.spend))run.guestEconomy.spend=0;if(!Number.isInteger(run.guestEconomy.walkaways))run.guestEconomy.walkaways=0;
  if(!run.districts)run.districts={coast:1};for(const id of ["coast","village","east","innovation","sports","transit","pier"])if(!Number.isInteger(run.districts[id]))run.districts[id]=id==="coast"?1:0;if(!Number.isInteger(run.eventVenue))run.eventVenue=0;
  if(!run.storeHours)run.storeHours=structuredClone(DEFAULT_STORE_HOURS);for(const store of STORES)if(!run.storeHours[store.id])run.storeHours[store.id]={...DEFAULT_STORE_HOURS[store.id]};
  if(!Array.isArray(run.deliveries))run.deliveries=[];if(!Array.isArray(run.today.deliveries))run.today.deliveries=[];ensureDjOperations(run);ensureOperationsState(run);ensurePerformanceState(run);
}

const LITTER_POINTS=Object.freeze({
  coast:[{x:12.5,y:18.8},{x:25.4,y:19.7},{x:34.7,y:17.3},{x:18.2,y:22.1}],
  village:[{x:43,y:12},{x:47,y:9.8},{x:49,y:14.2}],
  east:[{x:42.6,y:18.5},{x:46.4,y:16.5},{x:47.1,y:21.5}],
  innovation:[{x:54,y:11},{x:59,y:9.5},{x:62,y:13.8}],
  sports:[{x:59,y:19},{x:64,y:17.4},{x:68,y:21.2}],
  transit:[{x:69,y:11.2},{x:74,y:14.3},{x:78,y:9.8}],
  pier:[{x:50.4,y:18.2},{x:53.8,y:19.6},{x:55.1,y:15.2}]
});

function unlockedDistricts(run){return OPERATIONS_DISTRICTS.filter(district=>run.districts?.[district.id]);}
function breakdownTargets(run,districtId){
  const stores=STORES.filter(store=>(run.venues?.[store.id]||0)>0&&districtForStore(store.id)===districtId).map(store=>({targetKind:"store",targetId:store.id,label:store.name,districtId}));
  const facilities=(run.facilities||[]).filter(facility=>!["path","scenery","bin"].includes(facility.type)&&districtForPosition(facility.x,facility.y)===districtId).map(facility=>({targetKind:"facility",targetId:facility.id,label:facility.name,districtId}));
  const businesses=DISTRICT_BUSINESSES.filter(business=>business.districtId===districtId&&run.districtBusinesses?.[business.id]).map(business=>({targetKind:"district-business",targetId:business.id,label:business.name,districtId}));
  if(districtId==="east"&&run.eventVenue)facilities.push({targetKind:"venue",targetId:"pavilion",label:"Coastline Pavilion",districtId});
  return [...stores,...facilities,...businesses].filter(target=>!assetIsClosed(run,target.targetKind,target.targetId));
}

export function addOperationsIssue(run,type,districtId="coast",targetKind=null,targetId=null){
  if(!["litter","breakdown"].includes(type))throw new Error("Unknown operations issue.");
  if(!run.districts?.[districtId])throw new Error("That district is not part of the campus yet.");
  const next=structuredClone(run);ensureOperationsState(next);const sequence=next.operations.nextIssueSequence++;
  if(type==="litter"){
    const points=LITTER_POINTS[districtId]||LITTER_POINTS.coast,point=points[(sequence-1)%points.length];next.operations.issues.push({id:`issue-${sequence}`,type,districtId,targetKind:"ground",targetId:`${districtId}-${sequence}`,label:"Litter spill",x:point.x,y:point.y,progress:0,required:45,createdDay:next.currentDay,createdMinute:next.clockMinutes});
  }else{
    const targets=breakdownTargets(next,districtId),chosen=targetKind&&targetId?targets.find(target=>target.targetKind===targetKind&&target.targetId===targetId):targets[(sequence-1)%Math.max(1,targets.length)];if(!chosen)throw new Error("There is no operational asset to break down in this district.");
    next.operations.issues.push({id:`issue-${sequence}`,type,districtId,targetKind:chosen.targetKind,targetId:chosen.targetId,label:chosen.label,progress:0,required:90,createdDay:next.currentDay,createdMinute:next.clockMinutes});
  }
  return next;
}

function createIssueInPlace(run,type,districtId){const next=addOperationsIssue(run,type,districtId);run.operations=next.operations;}

function processOperations(run,minutes){
  ensureOperationsState(run);const metrics=campusMetrics(run),peak=crowdPeak(run.clockMinutes,run),districts=unlockedDistricts(run);
  run.operations.litterLoad+=metrics.guests*peak.multiplier*minutes/2400;
  const venueWear=Object.values(run.venues||{}).reduce((sum,level)=>sum+(level||0)*.72,0),assetCount=venueWear+(run.facilities||[]).filter(facility=>!["path","scenery","bin"].includes(facility.type)).length+Object.values(run.districtBusinesses||{}).filter(Boolean).length*.42+(run.eventVenue?1.4:0),technicians=unlockedDistricts(run).reduce((sum,district)=>sum+activeStaffCount(run,"technician",district.id,run.clockMinutes),0);
  run.operations.breakdownLoad+=Math.max(.3,assetCount-technicians*.55)*minutes/900;
  while(run.operations.litterLoad>=1&&run.operations.issues.filter(issue=>issue.type==="litter").length<8){run.operations.litterLoad-=1;const district=districts[(run.operations.nextIssueSequence-1)%districts.length];createIssueInPlace(run,"litter",district.id);}
  while(run.operations.breakdownLoad>=1&&run.operations.issues.filter(issue=>issue.type==="breakdown").length<4){run.operations.breakdownLoad-=1;const candidates=districts.filter(district=>breakdownTargets(run,district.id).length);if(!candidates.length)break;const district=candidates[(run.operations.nextIssueSequence-1)%candidates.length];createIssueInPlace(run,"breakdown",district.id);}
  const resolved=[];
  for(const issue of run.operations.issues){const role=issue.type==="litter"?"caretaker":"technician",workers=activeStaffCount(run,role,issue.districtId,run.clockMinutes);if(!workers)continue;issue.progress=Math.min(issue.required,issue.progress+minutes*workers);if(issue.progress>=issue.required)resolved.push(issue);}
  if(resolved.length){for(const issue of resolved){run.operations.history.push({...issue,resolvedDay:run.currentDay,resolvedMinute:run.clockMinutes+minutes});run.today.issuesResolved+=1;run.operations.totalIssuesResolved+=1;run.reputation=(run.reputation||0)+1;}run.operations.issues=run.operations.issues.filter(issue=>!resolved.some(item=>item.id===issue.id));if(run.operations.history.length>120)run.operations.history=run.operations.history.slice(-120);}
}

function processDeliveries(run,minutes){
  const sliceEnd=run.clockMinutes+minutes;
  for(const delivery of run.deliveries||[]){
    if(delivery.status!=="scheduled")continue;
    const due=delivery.arrivalDay<run.currentDay||(delivery.arrivalDay===run.currentDay&&delivery.arrivalMinute<sliceEnd);
    if(!due)continue;
    run.stock[delivery.productId]=(run.stock[delivery.productId]||0)+delivery.quantity;delivery.status="delivered";delivery.deliveredDay=run.currentDay;delivery.deliveredMinute=Math.max(run.clockMinutes,delivery.arrivalMinute);run.today.deliveries.push({id:delivery.id,productId:delivery.productId,quantity:delivery.quantity,total:delivery.total,minute:delivery.deliveredMinute});
  }
}

function processVenueProjects(run,minutes){
  if(!Array.isArray(run.venueProjects))run.venueProjects=[];
  for(const project of run.venueProjects){
    if(project.status!=="building")continue;
    project.remainingMinutes=Math.max(0,(project.remainingMinutes||0)-minutes);
    if(project.remainingMinutes>0)continue;
    project.status="complete";project.completedDay=run.currentDay;project.completedMinute=run.clockMinutes+minutes;project.completedAt=new Date().toISOString();run.reputation=(run.reputation||0)+(project.kind==="open"?4:5);
  }
  if(run.venueProjects.length>40)run.venueProjects=run.venueProjects.slice(-40);
}

function processDjEvent(run,minutes){
  const scheduled=run.scheduledEvent;if(scheduled&&scheduled.day===run.currentDay&&scheduled.startMinute>=run.clockMinutes&&scheduled.startMinute<run.clockMinutes+minutes){run.activeEvent={...scheduled,styleName:DJ_STYLES.find(item=>item.id===scheduled.styleId)?.name||"Live set",remainingMinutes:scheduled.duration,attendance:0,revenue:0,attendanceProgress:0,startedAt:new Date().toISOString()};run.today.eventCosts+=scheduled.operatingCost||0;run.scheduledEvent=null;}
  if(!run.activeEvent)return;
  if(run.activeEvent.source!=="dj"){run.activeEvent.remainingMinutes-=minutes;if(run.activeEvent.remainingMinutes<=0)run.activeEvent=null;return;}
  const event=run.activeEvent,activeMinutes=Math.min(minutes,event.remainingMinutes),target=Math.max(0,event.expectedAttendance||0);event.attendanceProgress=(event.attendanceProgress||0)+target*activeMinutes/Math.max(1,event.duration);const available=Math.max(0,(event.capacity||target)-(event.attendance||0)),arrivals=Math.min(available,Math.floor(event.attendanceProgress));if(arrivals>0){event.attendanceProgress-=arrivals;event.attendance=(event.attendance||0)+arrivals;const revenue=arrivals*(event.ticketPrice||0);event.revenue=(event.revenue||0)+revenue;run.cash+=revenue;run.today.eventRevenue+=revenue;run.today.eventAttendance+=arrivals;run.djOperations.lifetimeAttendance=(run.djOperations.lifetimeAttendance||0)+arrivals;run.djOperations.lifetimeRevenue=(run.djOperations.lifetimeRevenue||0)+revenue;}
  event.remainingMinutes-=minutes;if(event.remainingMinutes<=0){if(!Array.isArray(run.eventHistory))run.eventHistory=[];run.eventHistory.push({at:event.startedAt,day:run.currentDay,eventId:"dj-event",name:event.name,deckId:event.deckId,styleId:event.styleId,slotId:event.slotId,djId:event.djId,ticketPrice:event.ticketPrice,attendance:event.attendance||0,revenue:event.revenue||0,cost:event.operatingCost||0,grossProfit:(event.revenue||0)-(event.operatingCost||0),excitement:event.excitement,noise:event.noise,comfort:event.comfort});run.reputation=(run.reputation||0)+Math.max(1,Math.round((event.attendance||0)/10));run.activeEvent=null;}
}

function processSlice(run,minutes){
  processVenueProjects(run,minutes);
  processDeliveries(run,minutes);
  processDjEvent(run,minutes);
  processOperations(run,minutes);
  const metrics=campusMetrics(run),peak=crowdPeak(run.clockMinutes,run);
  run.visitorProgress+=metrics.guests*peak.multiplier*minutes/115;
  const arrived=Math.floor(run.visitorProgress);run.visitorProgress-=arrived;run.today.visitors+=arrived;run.totalVisitors+=arrived;
}

function closeTycoonDay(run){
  const metrics=campusMetrics(run),performance=ensurePerformanceState(run),items=CATALOGUE.map(product=>{const row=run.today.products[product.id]||{unitsSold:0,revenue:0,cogs:0};return {productId:product.id,unitsSold:row.unitsSold,demand:null,price:run.prices[product.id],revenue:row.revenue,cogs:row.cogs,grossProfit:row.revenue-row.cogs};});
  const portfolio=districtPortfolio(run),districtRevenue=run.today.districtOfferRevenue||0,districtCogs=run.today.districtOfferCogs||0;run.today.districtRevenue=districtRevenue;
  const wageDue=run.operations.payrollDue>0?0:dailyPayroll(run),wagesPaid=Math.min(run.cash,wageDue),wageShortfall=wageDue-wagesPaid;run.cash-=wagesPaid;run.operations.payrollDue+=wageShortfall;run.operations.totalWagesPaid+=wagesPaid;run.today.staffWages=wageDue;run.today.staffWagesPaid=wagesPaid;
  const operating=dailyOperatingCosts(run),totalOperatingDue=performance.operatingDue+operating.total,operatingPaid=Math.min(run.cash,totalOperatingDue),operatingShortfall=totalOperatingDue-operatingPaid;run.cash-=operatingPaid;performance.operatingDue=operatingShortfall;performance.totalOperatingCostsPaid+=operatingPaid;run.today.operatingCosts=operating.total;run.today.operatingCostsPaid=operatingPaid;
  const deliveredUnits=(run.today.deliveries||[]).reduce((sum,item)=>sum+item.quantity,0),districtUnits=Object.values(run.today.districtOffers||{}).reduce((sum,item)=>sum+(item.units||0),0),grossProfit=run.today.revenue-run.today.cogs+(run.today.eventRevenue||0)-(run.today.eventCosts||0)+districtRevenue-districtCogs,operatingProfit=grossProfit-wageDue-operating.total,unlocked=CATALOGUE.filter(product=>(run.venues?.[product.storeId]||0)>=(product.tier||1)),stockCoverage=unlocked.length?Math.round(unlocked.filter(product=>(run.stock?.[product.id]||0)>0).length/unlocked.length*100):0,momentum=closeDayMomentum(run,operatingProfit,metrics,stockCoverage),totals={unitsSold:run.today.unitsSold+districtUnits,revenue:run.today.revenue,cogs:run.today.cogs,eventRevenue:run.today.eventRevenue||0,eventCosts:run.today.eventCosts||0,eventAttendance:run.today.eventAttendance||0,districtRevenue,districtCogs,districtUnits,staffWages:wageDue,staffWagesPaid:wagesPaid,payrollShortfall:wageShortfall,operatingCosts:operating.total,operatingCostsPaid:operatingPaid,operatingShortfall,issuesResolved:run.today.issuesResolved||0,walkaways:run.today.walkaways||0,deliveries:(run.today.deliveries||[]).length,deliveredUnits,grossProfit,operatingProfit};
  run.history.push({day:run.currentDay,eventId:crowdPeak(720,run).id,calendar:calendarDay(run),guestGroups:structuredClone(run.today.guestGroups||{}),districtOffers:structuredClone(run.today.districtOffers||{}),districts:portfolio.districts.filter(district=>district.owned).map(district=>({id:district.id,built:district.built,projectedIncome:district.projectedIncome})),completedAt:new Date().toISOString(),items,totals,closingCash:run.cash,deliveries:structuredClone(run.today.deliveries||[]),storeHours:structuredClone(run.storeHours||{}),costs:operating,performance:structuredClone(momentum),campus:{...metrics,guests:run.today.visitors,stockCoverage,activities:{...(run.today.activities||{})}}});
  run.reputation=(run.reputation||0)+Math.max(0,Math.floor(totals.operatingProfit/300))+Math.floor(metrics.rating/25);run.currentDay+=1;run.clockMinutes=DAY_START;run.today=createToday();
  if(run.history.length>60)run.history=run.history.slice(-60);
}

export function inventoryValue(run) {
  return CATALOGUE.reduce((sum, product) => sum + run.stock[product.id] * product.cost, 0);
}

export function overallResult(run) { ensureOperationsState(run);const performance=ensurePerformanceState(run);return run.cash + inventoryValue(run) - run.operations.payrollDue - performance.operatingDue - INITIAL_CASH; }
export function formatEuro(cents) { return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(cents / 100); }

export function upgradeVenue(run, storeId, now = new Date().toISOString()) {
  if (!STORES.some(store => store.id === storeId)) throw new Error("Unknown venue.");
  const level = run.venues?.[storeId] ?? 0;
  if(level===0)throw new Error("Open this venue before upgrading it.");
  if (level >= 3) throw new Error("This venue is already at the maximum level.");
  if(activeVenueProject(run,storeId))throw new Error("Finish the active construction project before upgrading again.");
  const cost = level === 1 ? 1500 : 2500;
  if (run.cash < cost) throw new Error(`You need ${formatEuro(cost)} to upgrade this venue.`);
  const next = structuredClone(run);
  if (!next.venues) next.venues = { cafe: 1, snack: 1, merch: 1 };
  next.cash -= cost;
  next.venues[storeId] = level + 1;
  startVenueProject(next,storeId,`upgrade${level+1}`,level,level+1,level===1?VENUE_PROJECT_DURATIONS.upgrade2:VENUE_PROJECT_DURATIONS.upgrade3,now);
  if (!Array.isArray(next.upgrades)) next.upgrades = [];
  next.upgrades.push({ at: now, day: run.currentDay, storeId, fromLevel: level, toLevel: level + 1, cost });
  return next;
}
