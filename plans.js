document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll("#button").forEach(t=>{t.addEventListener("contextmenu",t=>t.preventDefault()),t.addEventListener("touchstart",t=>{t.touches.length>1&&t.preventDefault()}),gsap.set(t.querySelectorAll(".button_text_in .button_block.is--in"),{y:0,opacity:1}),gsap.set(t.querySelectorAll(".button_text_out .button_block.is--out"),{y:20,opacity:0}),t.addEventListener("mouseenter",()=>{gsap.isTweening(t)||(gsap.to(t.querySelectorAll(".button_text_in .button_block.is--in"),{y:-20,opacity:0,stagger:.05,duration:.2,ease:"power4.out"}),gsap.to(t.querySelectorAll(".button_text_out .button_block.is--out"),{y:0,opacity:1,stagger:.05,duration:.2,ease:"power4.out"}),gsap.to(t,{backgroundColor:"#7742ff",duration:.4,ease:"power2.out"}))}),t.addEventListener("mouseleave",()=>{gsap.isTweening(t)||(gsap.to(t.querySelectorAll(".button_text_in .button_block.is--in"),{y:0,opacity:1,stagger:.05,duration:.2,ease:"power4.out"}),gsap.to(t.querySelectorAll(".button_text_out .button_block.is--out"),{y:20,opacity:0,stagger:.05,duration:.2,ease:"power4.out"}),gsap.to(t,{backgroundColor:"#2f2f2f",duration:.4,ease:"power2.out"}))})}),gsap.matchMedia().add("(max-width: 767px)",()=>{let t=335,e=t+20,o=e+5;gsap.timeline({scrollTrigger:{trigger:"[cards-mobile]",start:"top top",end:"bottom bottom",scrub:!0}}).fromTo(".card.is--left",{opacity:1,display:"block"},{opacity:1,ease:"none"},"300%").to(".card.is--left",{opacity:0,ease:"none",onComplete:()=>$(".card.is--left").css("display","none"),onReverseComplete:()=>$(".card.is--left").css("display","block")},"325%").fromTo(".card.is--center",{opacity:0,display:"none"},{opacity:1,ease:"none",onStart:()=>$(".card.is--center").css("display","block")},"330%").to(".card.is--center",{opacity:1,ease:"none"},`${t}%`).to(".card.is--center",{opacity:0,ease:"none",onComplete:()=>$(".card.is--center").css("display","none"),onReverseComplete:()=>$(".card.is--center").css("display","block")},`${e}%`).fromTo(".card.is--right",{opacity:0,display:"none"},{opacity:1,ease:"none",onStart:()=>$(".card.is--right").css("display","block")},`${o}%`).to(".card.is--right",{opacity:1,ease:"none"},`${o+5}%`)})});
