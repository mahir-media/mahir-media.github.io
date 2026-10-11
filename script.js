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

/* hero: the brand mark as a 3D object (twin-heart infinity, gold gradient, ember rim light) */
function hero3d(){
 const cv=$('#gl'),T=window.THREE,fail=()=>$('#hero').classList.add('nogl');
 if(!T)return fail();
 const low=innerWidth<700||(navigator.hardwareConcurrency||4)<4;let R;
 try{R=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:!low})}catch(e){return fail()}
 R.setPixelRatio(Math.min(devicePixelRatio,low?1.5:2));
 const S=new T.Scene(),C=new T.PerspectiveCamera(38,1,.1,60),Gp=new T.Group(),P=[];S.add(Gp);
 for(let i=0;i<240;i++){const t=i/240*6.2832,d=1+Math.sin(t)**2;let x=2.6*Math.cos(t)/d,y=2.6*Math.sin(t)*Math.cos(t)/d;x*=1-.24*Math.exp(-y*y/.16)*Math.pow(Math.abs(x)/2.6,4);P.push(new T.Vector3(x,y*1.6,Math.sin(t*2)*.2))}
 const g=new T.TubeGeometry(new T.CatmullRomCurve3(P,true),400,.17,14,true),p=g.attributes.position,k=[],a=new T.Color('#bb8e4c'),b=new T.Color('#f5e99b'),c=new T.Color();
 for(let i=0;i<p.count;i++){c.copy(a).lerp(b,(p.getX(i)+2.6)/5.2);k.push(c.r,c.g,c.b)}
 g.setAttribute('color',new T.Float32BufferAttribute(k,3));
 Gp.add(new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,metalness:.6,roughness:.32})));
 const amb=new T.AmbientLight(0xffffff,.7),key=new T.DirectionalLight(0xfff1d6,1.2),rim=new T.PointLight(0xff5b1f,2.4,14);
 key.position.set(3,4,6);rim.position.set(-5,-2,2.5);S.add(amb,key,rim);
 const N=low?260:620,q=new Float32Array(N*3);
 for(let i=0;i<N;i++){const s=Math.random()*6.283,r=4.3+Math.random()*.9;q.set([Math.cos(s)*r,(Math.random()-.5)*.7,Math.sin(s)*r],i*3)}
 const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(q,3));
 const dust=new T.Points(pg,new T.PointsMaterial({color:0xd8bb73,size:.045,transparent:true,opacity:.85,depthWrite:false}));dust.rotation.x=.5;S.add(dust);
 const theme=()=>{const l=root.dataset.theme==='light';amb.intensity=l?1:.7;dust.material.color.set(l?0x7a5c12:0xd8bb73)};theme();addEventListener('mm-theme',theme);
 const fit=()=>{const w=cv.clientWidth,h=cv.clientHeight,r=w/h;R.setSize(w,h,false);C.aspect=r;C.position.set(0,r<1?1.2:.4,r<1?15:10.5);C.lookAt(0,.4,0);C.updateProjectionMatrix()};fit();addEventListener('resize',fit);
 let mx=0,my=0,vis=true;const t0=performance.now();
 addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
 new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(cv);
 const draw=()=>{const t=(performance.now()-t0)/1e3,s=st.s;Gp.rotation.y+=((Math.sin(t*.5)*.35+mx*.5+s*6.283)-Gp.rotation.y)*.08;Gp.rotation.x+=(my*.3-Gp.rotation.x)*.08;Gp.scale.setScalar(1-s*.4);dust.rotation.y=t*.06;R.render(S,C)};
 if(rm){draw();addEventListener('resize',draw);return}
 (function loop(){requestAnimationFrame(loop);if(vis)draw()})();
}
hero3d();

/* scroll story */
if(G&&!rm){
 ScrollTrigger.create({trigger:'#hero',start:'top top',end:'+=90%',pin:true,onUpdate:s=>st.s=s.progress});
 gsap.to('.hero-copy',{opacity:0,y:-50,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'+=55%',scrub:true}});
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
 const ep=f.dataset.ep,d=new FormData(f),b=$('button[type=submit]',f);
 if(!ep){location.href=`mailto:mahirmedia.ai@gmail.com?subject=${encodeURIComponent('Project enquiry')}&body=${encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nPhone: ${d.get('phone')||'-'}`)}`;return}
 b.disabled=true;msg.textContent='Sending...';
 try{await fetch(ep,{method:'POST',mode:'no-cors',body:new URLSearchParams(d)});f.reset();msg.textContent='Thank you. Your details are in and we will be in touch.';tick(760)}
 catch(err){msg.textContent='Could not send. Please email mahirmedia.ai@gmail.com directly.'}
 b.disabled=false});
})();
