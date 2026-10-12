(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],root=document.documentElement;
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const st={s:0};

/* sound + haptics: piano loop at 8%, soft taps generated in code */
const snd=$('#snd'),au=new Audio('assets/audio/piano.mp3');au.loop=true;au.volume=.08;
let on=ls.get('mm-sound')!=='off',ac;
const paint=()=>{snd.setAttribute('aria-pressed',on);$('span',snd).textContent=on?'Sound on':'Sound off'};
const play=()=>{if(on)au.play().catch(()=>{})};
function tick(f=620){navigator.vibrate&&navigator.vibrate(8);if(!on)return;try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.frequency.value=f;g.gain.setValueAtTime(.025,t);g.gain.exponentialRampToValueAtTime(.0001,t+.14);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+.14)}catch(e){}}
snd.onclick=()=>{on=!on;ls.set('mm-sound',on?'on':'off');paint();on?play():au.pause();tick(700)};
au.onerror=()=>{snd.hidden=true};
['pointerdown','keydown'].forEach(e=>addEventListener(e,play,{once:true}));paint();

/* theme */
$('#thm').onclick=()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;ls.set('mm-theme',t);dispatchEvent(new Event('mm-theme'));tick(480)};

/* intro */
const G=window.gsap&&window.ScrollTrigger,intro=$('#intro');
const end=()=>{intro.classList.add('done');document.body.classList.remove('lock');G&&ScrollTrigger.refresh()};
if(G)gsap.registerPlugin(ScrollTrigger);
if(!G||rm){end()}else{setTimeout(end,4000);gsap.timeline({onComplete:end}).to('#intro .o',{strokeDashoffset:0,duration:1.1,ease:'power2.inOut'}).to('#intro .fill',{opacity:1,duration:.4},.8).to(intro,{yPercent:-100,duration:.7,ease:'power3.inOut'},'+=.1')}


/* scroll story */
if(G&&!rm){
 gsap.from('.card',{y:40,opacity:0,stagger:.14,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'#what',start:'top 72%'}});
 gsap.from('.steps li',{y:30,opacity:0,stagger:.15,scrollTrigger:{trigger:'.steps',start:'top 88%'}});
 gsap.fromTo('.wash',{clipPath:'circle(0% at 50% 35%)'},{clipPath:'circle(150% at 50% 35%)',ease:'none',scrollTrigger:{trigger:'#process',start:'top 90%',end:'top 10%',scrub:true}});
 gsap.matchMedia().add('(min-width:900px)',()=>{const t=$('.track');gsap.to(t,{x:()=>-(t.scrollWidth-innerWidth),ease:'none',scrollTrigger:{trigger:'#work',start:'top top',end:()=>'+='+(t.scrollWidth-innerWidth),pin:true,scrub:1,invalidateOnRefresh:true}})});
 document.fonts&&document.fonts.ready.then(()=>ScrollTrigger.refresh());
}

/* cursor (desktop only) */
const cur=v=>fine&&!rm&&root.classList.toggle('has-cur',v);
if(fine&&!rm){const d=$('#cd'),r=$('#cr');let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;cur(true);
 addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;d.style.transform=`translate(${x}px,${y}px)`},{passive:true});
 (function f(){rx+=(x-rx)*.16;ry+=(y-ry)*.16;r.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(f)})();
 document.addEventListener('pointerover',e=>{r.dataset.s=e.target.closest('a,button,[data-cur]')?'on':''});
 $$('[data-mag]').forEach(b=>{b.addEventListener('pointermove',e=>{const q=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-q.left-q.width/2)*.2}px,${(e.clientY-q.top-q.height/2)*.3}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')})}

/* contact orb + form: posts to a Google Sheet through Apps Script; falls back to email */
const dlg=$('#dlg'),f=$('#f'),msg=$('#msg');
$$('[data-open]').forEach(b=>b.addEventListener('click',()=>{dlg.showModal();cur(false);tick(520);$('#nm').focus()}));
$('.x').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
dlg.addEventListener('close',()=>cur(true));
f.addEventListener('submit',async e=>{e.preventDefault();if(f.website.value)return;
 const ep=(f.dataset.ep||'').trim(),d=new FormData(f),b=$('button[type=submit]',f);
 if(!ep||ep.includes('{{')){location.href=`mailto:hello@mahirmedia.studio?subject=${encodeURIComponent('Project enquiry')}&body=${encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nPhone: ${d.get('phone')||'-'}`)}`;return}
 b.disabled=true;msg.textContent='Sending...';
 try{const r=await fetch(ep,{method:'POST',body:new URLSearchParams(d)});if(!r.ok||(await r.text()).trim()!=='ok')throw 0;f.reset();msg.textContent='Thank you. Your details are in and we will be in touch.';tick(760)}
 catch(err){msg.textContent='Could not send. Please email hello@mahirmedia.studio directly.'}
 b.disabled=false});
/* story: gold particles scatter, then assemble into a website as you scroll (WebGL, GPU-driven) */
(()=>{const S=$('#story'),cv=$('#gl'),T=window.THREE;if(!S||!cv)return;
 if(rm||!G||!T){S.classList.add('static');return}
 let R;try{R=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:false,powerPreference:'high-performance'})}catch(e){S.classList.add('static');return}
 const mob=innerWidth<760,N=mob?3400:7800,sc=new T.Scene(),cam=new T.PerspectiveCamera(40,1,.1,100),grp=new T.Group();sc.add(grp);
 R.setPixelRatio(Math.min(devicePixelRatio,mob?1.5:2));
 /* the website, drawn as shapes: [type,x,y,w,h,layer]  o=outline f=fill l=text line m=twin-heart mark */
 const LS=[['o',0,0,10,.5,0],['o',0,.7,10,.7,0],['m',.35,.78,.9,.5,1],['l',6.2,1.05,.9,0,1],['l',7.3,1.05,.9,0,1],['l',8.4,1.05,.9,0,1],['l',.5,1.9,4.6,0,2],['l',.5,2.4,3.8,0,2],['l',.5,2.9,2.6,0,2],['f',.5,3.6,1.7,.55,3],['o',5.6,1.8,3.9,2.4,1],['m',6.6,2.47,1.9,1.05,2],['o',.5,4.7,2.9,1.2,1],['o',3.55,4.7,2.9,1.2,1],['o',6.6,4.7,2.9,1.2,1],['l',.8,5.1,1.6,0,2],['l',3.85,5.1,1.6,0,2],['l',6.9,5.1,1.6,0,2],['o',0,6.1,10,.3,0]];
 const PS=[['o',0,0,5,.4,0],['o',0,.55,5,.55,0],['m',.25,.62,.7,.39,1],['l',3.4,.82,.45,0,1],['l',3.95,.82,.45,0,1],['l',4.5,.82,.4,0,1],['o',0,1.3,5,2,1],['m',1.5,1.75,2,1.1,2],['l',.3,3.7,4.2,0,2],['l',.3,4.1,3.3,0,2],['f',.3,4.6,1.8,.5,3],['o',0,5.4,1.55,1.4,1],['o',1.72,5.4,1.55,1.4,1],['o',3.45,5.4,1.55,1.4,1],['o',0,7.2,5,.3,0]];
 const L=mob?PS:LS,W=mob?5:10,H=mob?7.6:6.4,wt=s=>s[0]=='o'?2*(s[3]+s[4]):s[0]=='f'?s[3]*s[4]*14:s[0]=='l'?s[3]*2:s[3]*8,tot=L.reduce((a,s)=>a+wt(s),0);
 const mk=[];for(let i=0;i<400;i++){const t=i/400*6.2832,d=1+Math.sin(t)**2;let x=Math.cos(t)/d,y=Math.sin(t)*Math.cos(t)/d;x*=1-.24*Math.exp(-y*y/.06)*Math.pow(Math.abs(x),4);mk.push([x,y*1.6])}
 const pos=new Float32Array(N*3),tg=new Float32Array(N*3),st=new Float32Array(N*4),co=new Float32Array(N*3),r=Math.random;
 for(let i=0;i<N;i++){
  let k=r()*tot,s=L[0];for(const q of L){if((k-=wt(q))<=0){s=q;break}}
  const [ty,x0,y0,w,h,ly]=s;let x,y;
  if(ty=='o'){let u=r()*2*(w+h);if(u<w){x=x0+u;y=y0}else if((u-=w)<h){x=x0+w;y=y0+u}else if((u-=h)<w){x=x0+w-u;y=y0+h}else{u-=w;x=x0;y=y0+h-u}}
  else if(ty=='f'){x=x0+r()*w;y=y0+r()*h}
  else if(ty=='l'){x=x0+r()*w;y=y0+(r()-.5)*.06}
  else{const m=mk[(r()*400)|0];x=x0+(m[0]+1)/2*w+(r()-.5)*.05;y=y0+(.57-m[1])/1.14*h+(r()-.5)*.05}
  tg.set([x-W/2,H/2-y,(r()-.5)*.04],i*3);pos.set([(r()-.5)*24,(r()-.5)*15,(r()-.5)*16-2],i*3);
  st.set([r(),ly,r(),2+r()*2.6],i*4);
  const t=Math.min(1,Math.max(0,x/W)),e=r()<.07;co.set(e?[1,.36,.12]:[.73+.23*t,.56+.35*t,.3+.31*t],i*3)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('aT',new T.BufferAttribute(tg,3));g.setAttribute('aS',new T.BufferAttribute(st,4));g.setAttribute('aC',new T.BufferAttribute(co,3));
 const mat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{uP:{value:0},uF:{value:0},uE:{value:0},uT:{value:0},uPx:{value:R.getPixelRatio()},uTint:{value:new T.Vector3(1,1,1)},uAl:{value:1}},
 vertexShader:`attribute vec3 aT;attribute vec4 aS;attribute vec3 aC;uniform float uP,uF,uE,uT,uPx;varying vec3 vC;varying float vA;
 void main(){float t=smoothstep(aS.x*.55,aS.x*.55+.45,uP);vec3 p=mix(position,aT,t);
 p+=vec3(sin(uT*.4+aS.z*40.),cos(uT*.35+aS.z*23.),sin(uT*.3+aS.z*11.))*(1.-t)*.45;p.z+=aS.y*uE*1.5*t;
 vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=aS.w*uPx*(1.+.9*uF)*(12./-mv.z);
 vA=mix(.38,1.,uF)*mix(.55,1.,t);vC=mix(vec3(.82,.72,.46),aC,uF);}`,
 fragmentShader:`uniform vec3 uTint;uniform float uAl;varying vec3 vC;varying float vA;
 void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vC*uTint,(1.-smoothstep(.05,.5,d))*vA*uAl);}`});
 const pts=new T.Points(g,mat);pts.frustumCulled=false;grp.add(pts);
 const theme=()=>{const l=root.dataset.theme==='light';mat.blending=l?T.NormalBlending:T.AdditiveBlending;mat.uniforms.uTint.value.set(l?.62:1,l?.42:1,l?.1:1);mat.uniforms.uAl.value=l?.95:1;mat.needsUpdate=true};theme();addEventListener('mm-theme',theme);
 const fit=()=>{const w=cv.clientWidth,h=cv.clientHeight,a=w/h,tn=.364;R.setSize(w,h,false);cam.aspect=a;cam.position.set(0,0,Math.max(W/2*1.18/(tn*a),H/2*1.3/tn));grp.position.y=mob?1.1:.55;cam.updateProjectionMatrix()};fit();addEventListener('resize',fit);
 const sm=(x,a,b)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
 const cnt=$('.cnt'),bar=$('.prog i'),caps=$$('.cap p'),copy=$('.copy'),fin=$('.fin'),B=[.08,.28,.5,.7,.88];
 let p=0,ps=0,mx=0,my=0,vis=true;const t0=performance.now();
 ScrollTrigger.config({ignoreMobileResize:true});
 ScrollTrigger.create({trigger:S,start:'top top',end:()=>'+='+Math.round(innerHeight*(mob?4.6:5.6)),pin:true,anticipatePin:1,refreshPriority:1,invalidateOnRefresh:true,onUpdate:s=>p=s.progress});
 if(fine)addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
 new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(cv);
 (function loop(){requestAnimationFrame(loop);if(!vis)return;
  ps+=(p-ps)*.1;const t=(performance.now()-t0)/1e3,u=mat.uniforms,P=sm(ps,.28,.5),F=sm(ps,.5,.7),E=sm(ps,.7,.79)-sm(ps,.79,.88);
  u.uP.value=P;u.uF.value=F;u.uE.value=E;u.uT.value=t;
  grp.rotation.y=-.6*(1-P)+.38*E+mx*.22+Math.sin(t*.4)*.04;grp.rotation.x=.22*(1-P)-.1*E+my*.12;R.render(sc,cam);
  let i=-1;B.forEach((b,k)=>{if(ps>=b)i=k});caps.forEach((c,k)=>c.classList.toggle('on',k===i));
  cnt.textContent='0'+(i+1)+' / 05';bar.style.width=ps*100+'%';
  copy.style.opacity=1-sm(ps,.02,.09);copy.style.visibility=ps>.1?'hidden':'visible';
  fin.style.opacity=sm(ps,.9,.97);fin.style.visibility=ps>.9?'visible':'hidden';fin.style.pointerEvents=ps>.92?'auto':'none'})();
})();
})();
