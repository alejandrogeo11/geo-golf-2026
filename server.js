const http=require('node:http'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const rooms=new Map(), html=fs.readFileSync(path.join(__dirname,'index.html'));
const token=()=>crypto.randomBytes(24).toString('hex');
const name=v=>String(v||'Jugador').trim().slice(0,20)||'Jugador';
function fail(message){throw Error(message)}
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data))}
const server=http.createServer(async(req,res)=>{try{
const url=new URL(req.url,'http://localhost');if(req.method==='GET'&&url.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(html)}if(req.method==='GET'&&url.pathname==='/health'){return send(res,200,{ok:true})}if(req.method!=='POST'||!url.pathname.startsWith('/api/'))return send(res,404,{error:'No encontrado'});
let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>100000)return send(res,413,{error:'Solicitud demasiado grande'})}const b=JSON.parse(raw||'{}'),a=url.pathname.slice(5);
if(a==='create'){let code;do{code=crypto.randomBytes(3).toString('hex').toUpperCase()}while(rooms.has(code));if(rooms.size>=200)fail('Servidor lleno');const t=token();rooms.set(code,{members:[{token:t,name:name(b.name)}],started:false,epoch:0,state:null,pending:null,last:Date.now()});return send(res,200,{code,token:t,seat:0,host:true})}
const r=rooms.get(b.code);if(!r)fail('Sala no encontrada');r.last=Date.now();if(a==='join'){if(r.started||r.members.length>=4)fail('Sala llena o torneo iniciado');const t=token(),seat=r.members.length;r.members.push({token:t,name:name(b.name)});return send(res,200,{code:b.code,token:t,seat,host:false})}
const seat=r.members.findIndex(m=>m.token===b.token);if(seat<0)fail('Acceso inválido');
if(a==='start'){if(seat!==0||r.started||r.members.length<2)fail('Se necesitan entre 2 y 4 jugadores');r.started=true;r.theme=['Tour automático','Caribbean','Masters','Desert','Night Golf'].includes(b.theme)?b.theme:'Tour automático';r.speed=['9','10.5','12'].includes(b.speed)?b.speed:'10.5';return send(res,200,{ok:true})}
if(a==='shot'){const s=r.state;if(!r.started||!s||!s.playing||s.overlay||s.won||s.shotPending||r.pending||s.player!==seat||b.epoch!==r.epoch)fail('Todavía no es tu turno');if(!Number.isFinite(b.dx)||!Number.isFinite(b.dy)||Math.hypot(b.dx,b.dy)<9||Math.hypot(b.dx,b.dy)>10000)fail('Golpe inválido');r.pending={dx:b.dx,dy:b.dy,delivered:false};return send(res,200,{ok:true})}
if(a==='poll'){let command=null;if(seat===0&&r.started&&b.state){const old=r.state,s=b.state;if(!old||old.player!==s.player||old.idx!==s.idx||old.strokes!==s.strokes||old.shotPending!==s.shotPending)r.epoch++;r.state=s;if(r.pending&&r.pending.delivered&&(s.shotPending||!old||old.strokes!==s.strokes||old.player!==s.player))r.pending=null;if(r.pending&&!r.pending.delivered){command={dx:r.pending.dx,dy:r.pending.dy};r.pending.delivered=true;}}
return send(res,200,{started:r.started,names:r.members.map(m=>m.name),theme:r.theme,speed:r.speed,state:r.state,epoch:r.epoch,pending:!!r.pending,command})}fail('Acción desconocida');
}catch(e){send(res,400,{error:e.message})}});
setInterval(()=>{for(const [k,r] of rooms)if(Date.now()-r.last>3600000)rooms.delete(k)},60000).unref();server.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('GEO Golf online listo'));
