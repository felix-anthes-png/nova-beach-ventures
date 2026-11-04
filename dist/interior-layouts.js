export const INTERIOR_LAYOUTS=Object.freeze({
  academy:{
    name:"Academic Wing",
    zones:[
      {id:"service",label:"Atlantic Café",x:5.65,y:2.15,w:4.3,h:.85,color:"#ff7b5b"},
      {id:"study",label:"Study Commons",x:1.7,y:5.25,w:4.4,h:3.9,color:"#d2a66c"},
      {id:"quiet",label:"Quiet Tables",x:9.25,y:3.7,w:3.75,h:3.1,color:"#64cbc8"}
    ],
    colliders:[
      {id:"cafe-counter",x:5.65,y:2.15,w:4.3,h:.85,label:"Atlantic Café counter",kind:"counter"},
      {id:"pastry-display",x:5.8,y:3.05,w:1.15,h:.65,label:"Pastry display",kind:"counter"},
      {id:"academy-table-west",x:2.1,y:5.65,w:3.5,h:.75,label:"Communal table",kind:"furniture"},
      {id:"academy-table-east",x:9.9,y:4.2,w:3,h:.75,label:"Quiet study table",kind:"furniture"},
      {id:"academy-lounge",x:2.2,y:7.25,w:2.5,h:1.85,label:"Study lounge",kind:"furniture"},
      {id:"academy-plant",type:"circle",x:11.8,y:7.2,r:.38,label:"Planter",kind:"prop"}
    ],
    route:[{x:7.5,y:8.8},{x:7.5,y:7.25},{x:7.2,y:5.7},{x:7.25,y:4.15}],
    activities:[
      {x:7.25,y:3.6,pose:"service",role:"service",facing:{x:0,y:-1},label:"Serving coffee"},
      {x:7.2,y:4.25,pose:"phone",facing:{x:0,y:-1},label:"Ordering"},
      {x:6.75,y:4.72,pose:"idle",facing:{x:.4,y:-1},label:"Queueing"},
      {x:4.7,y:6.55,pose:"sit",facing:{x:1,y:-.2},label:"Eating"},
      {x:10.65,y:5.25,pose:"sit",facing:{x:-1,y:.2},label:"Studying"},
      {x:4.9,y:7.65,pose:"chat",facing:{x:-1,y:0},label:"Group study"}
    ]
  },
  mercado:{
    name:"Mercado Supply Hall",
    zones:[
      {id:"stock",label:"Dry Stock",x:1.65,y:1.8,w:4.9,h:5.8,color:"#f5c95e"},
      {id:"dispatch",label:"Order & Dispatch",x:5.9,y:3.45,w:3.3,h:2.2,color:"#ff8060"},
      {id:"cold",label:"Cold Storage",x:9.35,y:1.7,w:3.85,h:3.2,color:"#64cbc8"}
    ],
    colliders:[
      {id:"shelf-north",x:2.05,y:2.45,w:4,h:.62,label:"Market shelving",kind:"furniture"},
      {id:"shelf-west",x:2.1,y:6.55,w:3.6,h:.62,label:"Market shelving",kind:"furniture"},
      {id:"cold-room",x:9.7,y:2.05,w:3.15,h:2.25,label:"Cold store",kind:"room"},
      {id:"shelf-east",x:10.1,y:6.1,w:2.8,h:.62,label:"Market shelving",kind:"furniture"},
      {id:"supply-counter",x:6.4,y:3.78,w:2.2,h:.82,label:"Supply desk",kind:"counter"},
      {id:"mercado-plant",type:"circle",x:7.6,y:7.7,r:.35,label:"Planter",kind:"prop"}
    ],
    route:[{x:7.5,y:8.8},{x:8.45,y:8.25},{x:8.45,y:6.4},{x:7.55,y:5.45},{x:7.5,y:5.02}],
    activities:[
      {x:7.45,y:3.5,pose:"service",role:"service",facing:{x:0,y:1},label:"Preparing order"},
      {x:7.5,y:4.9,pose:"phone",facing:{x:0,y:-1},label:"Confirming order"},
      {x:6.95,y:5.35,pose:"idle",facing:{x:.3,y:-1},label:"Waiting for dispatch"},
      {x:4.75,y:3.55,pose:"browse",facing:{x:-1,y:-.3},label:"Checking stock"},
      {x:10.3,y:5.35,pose:"browse",facing:{x:.5,y:-1},label:"Restocking"},
      {x:4.9,y:7.55,pose:"repair",role:"technician",facing:{x:-1,y:-.2},label:"Moving crates"}
    ]
  },
  hub:{
    name:"Student Hub",
    zones:[
      {id:"retail",label:"Nova Merch Lab",x:1.65,y:1.7,w:5.1,h:4.3,color:"#64cbc8"},
      {id:"venture",label:"Venture Studio",x:8.45,y:2.4,w:4.6,h:3.5,color:"#bce65f"},
      {id:"social",label:"Student Lounge",x:1.65,y:6.15,w:11.4,h:3.15,color:"#9a7bc1"}
    ],
    colliders:[
      {id:"merch-display",x:2.05,y:2.15,w:3.5,h:.65,label:"Merch display",kind:"furniture"},
      {id:"merch-counter",x:4.35,y:3.55,w:1.9,h:1.25,label:"Merch Lab counter",kind:"counter"},
      {id:"venture-desk",x:9.55,y:4.78,w:1.9,h:.82,label:"Venture desk",kind:"counter"},
      {id:"hub-lounge-west",x:2.15,y:7,w:2.5,h:1.85,label:"Student lounge",kind:"furniture"},
      {id:"hub-lounge-east",x:9.8,y:6.1,w:2.5,h:1.85,label:"Student lounge",kind:"furniture"},
      {id:"hub-plant",type:"circle",x:7.8,y:6.9,r:.38,label:"Planter",kind:"prop"}
    ],
    route:[{x:7.5,y:8.8},{x:6.8,y:8.25},{x:6.55,y:6.7},{x:6.65,y:5.65}],
    activities:[
      {x:5.25,y:3.25,pose:"service",role:"service",facing:{x:0,y:1},label:"Serving at Merch Lab"},
      {x:5.25,y:5.05,pose:"browse",facing:{x:0,y:-1},label:"Choosing merchandise"},
      {x:4.75,y:5.45,pose:"phone",facing:{x:.4,y:-1},label:"Queueing"},
      {x:10.45,y:4.45,pose:"phone",facing:{x:0,y:1},label:"Reviewing finances"},
      {x:4.8,y:7.7,pose:"sit",facing:{x:-1,y:0},label:"Student club meeting"},
      {x:9.25,y:8.35,pose:"chat",facing:{x:1,y:-.2},label:"Networking"}
    ]
  }
});

export function interiorLayout(zoneId){return INTERIOR_LAYOUTS[zoneId]||null;}

export function pointInsideInteriorFixture(point,fixture,padding=0){
  if(fixture.type==="circle")return Math.hypot(point.x-fixture.x,point.y-fixture.y)<=fixture.r+padding;
  return point.x>=fixture.x-padding&&point.x<=fixture.x+fixture.w+padding&&point.y>=fixture.y-padding&&point.y<=fixture.y+fixture.h+padding;
}
