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

/* story: a website assembles itself as you scroll (CSS 3D, no WebGL: light on phones) */
(()=>{const S=$('#story');if(!S||!G||rm)return;
 ScrollTrigger.config({ignoreMobileResize:true});S.classList.add('anim');
 const parts=$$('.pc'),W=innerWidth,H=innerHeight,R=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
 const tl=gsap.timeline({defaults:{ease:'power2.out'},scrollTrigger:{trigger:S,start:'top top',end:'+='+Math.round(H*(W<760?3.2:4)),pin:true,scrub:.6,anticipatePin:1,refreshPriority:1,invalidateOnRefresh:true}});
 tl.fromTo('.mock',{rotationX:22,rotationY:-22},{rotationX:4,rotationY:-5,ease:'none',duration:1},0);
 parts.forEach((p,i)=>tl.from(p,{x:(R(i)-.5)*W*1.1,y:(R(i+9)-.5)*H*1.1,z:(R(i+19)-.3)*600,rotationX:(R(i+3)-.5)*140,rotationY:(R(i+5)-.5)*140,rotation:(R(i+7)-.5)*90,scale:.5+R(i+11)*.9,opacity:.4,duration:.42},.04+i*.03));
 tl.fromTo(parts,{'--f':0},{'--f':1,stagger:.03,duration:.16,ease:'none'},.5)
   .fromTo('.hd',{'--t':0},{'--t':1,duration:.14,ease:'none'},.72)
   .to('.copy',{opacity:0,y:-40,duration:.07},.05).set('.copy',{pointerEvents:'none'},.12);
 $$('.cap p').forEach((c,i)=>{const t=.13+i*.18;tl.fromTo(c,{opacity:0,y:24},{opacity:1,y:0,duration:.05},t).to(c,{opacity:0,y:-24,duration:.05},t+.13)});
 tl.fromTo('.fin',{opacity:0,y:24},{opacity:1,y:0,duration:.08},.88).set('.fin',{pointerEvents:'auto'},.9);
 if(fine){const t=$('.tilt'),qx=gsap.quickTo(t,'rotationY',{duration:.8}),qy=gsap.quickTo(t,'rotationX',{duration:.8});addEventListener('pointermove',e=>{qx((e.clientX/innerWidth-.5)*10);qy(-(e.clientY/innerHeight-.5)*8)},{passive:true})}
})();
})();
