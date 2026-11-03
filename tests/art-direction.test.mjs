import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root=new URL("../",import.meta.url);

test("the restrained tycoon presentation loads after all feature styles",async()=>{
  const html=await readFile(new URL("dist/index.html",root),"utf8");
  assert.match(html,/specializations\.css[\s\S]*art-direction\.css/);
  assert.match(html,/app\.js\?v=30-designed-campus-spaces/);
});

test("world labels and guest intent are contextual",async()=>{
  const app=await readFile(new URL("dist/app.js",root),"utf8");
  assert.match(app,/Math\.hypot\(run\.player\.x-x,run\.player\.y-y\)>5\.4/);
  assert.match(app,/Math\.hypot\(run\.player\.x-guest\.x,run\.player\.y-guest\.y\)<5\.5/);
});

test("crowd movement uses a four-frame tycoon cycle",async()=>{
  const app=await readFile(new URL("dist/app.js",root),"utf8");
  assert.match(app,/Math\.floor\(\(t\+phase\*120\)\/145\)%4/);
  assert.match(app,/steps=\[0,2,0,-2\]/);
});
