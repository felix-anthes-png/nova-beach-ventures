import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";

test("the terminal development server creates an editable local URL",async t=>{
  const child=spawn("python3",["scripts/dev_server.py","--port","0","--host","127.0.0.1","--no-open"],{cwd:new URL("../",import.meta.url),stdio:["ignore","pipe","pipe"]});
  t.after(()=>{if(child.exitCode===null)child.kill("SIGTERM");});
  let output="";const url=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(`Development server did not start. ${output}`)),5000);child.stdout.on("data",chunk=>{output+=chunk;const match=output.match(/Local:\s+(http:\/\/localhost:\d+)/);if(match){clearTimeout(timer);resolve(match[1]);}});child.stderr.on("data",chunk=>{output+=chunk;});child.once("exit",code=>{if(code)reject(new Error(`Development server exited with ${code}. ${output}`));});});
  const response=await fetch(url),html=await response.text();assert.equal(response.status,200);assert.match(html,/data-nova-dev-reload/);assert.match(html,/fetch\('\/__dev_stamp'/);
  const script=await fetch(`${url}/app.js`);assert.equal(script.status,200);assert.match(script.headers.get("content-type"),/javascript/);assert.equal(script.headers.get("cache-control"),"no-store");
  child.kill("SIGTERM");await once(child,"exit");
});
