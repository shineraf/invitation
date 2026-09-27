(function(){
"use strict";
document.addEventListener("DOMContentLoaded", function(){
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const first=s=>String(s||"").trim().split(/\s+/)[0];

  const config={
    couple:{bride:"Sophia Martinez",groom:"Alexander Cruz"},
    weddingDate:"November 15, 2026 16:00:00",
    dateDisplay:"15 NOVEMBER 2026",
    venue:{
      ceremony:{name:"St. Example Church",address:"123 Example Street, Quezon City",mapUrl:""},
      reception:{name:"The Garden Estate",address:"456 Example Avenue, Quezon City",mapUrl:""}
    },
    music:{enabled:true,file:"assets/music/wedding-song.mp3"},
    rsvp:{endpoint:""},
    quote:{text:"Whatever our souls are made of, his and mine are the same."},
    gallery:[
      "assets/images/couple-cover.svg","assets/images/couple-01.svg","assets/images/couple-02.svg",
      "assets/images/couple-03.svg","assets/images/couple-04.svg","assets/images/couple-05.svg",
      "assets/images/couple-06.svg","assets/images/couple-07.svg"
    ]
  };

  /* Critical interaction: bind the invitation button before optional features. */
  const opening=$("#opening");
  const openButton=$("#openInvitation");
  const openInvitation=()=>{
    if(opening){
      opening.classList.add("closed");
      document.body.classList.add("invitation-open");
      window.setTimeout(()=>{opening.setAttribute("aria-hidden","true")},950);
    }
  };
  if(openButton) openButton.addEventListener("click",openInvitation);
  if(opening) opening.addEventListener("click",e=>{
    if(e.target===opening) openInvitation();
  });

  /* Populate editable content. */
  const set=(id,value)=>{const el=$("#"+id);if(el)el.textContent=value};
  set("openBride",first(config.couple.bride).toUpperCase());
  set("brandBride",first(config.couple.bride).toUpperCase());
  set("heroBride",first(config.couple.bride));
  set("openGroom",first(config.couple.groom).toUpperCase());
  set("brandGroom",first(config.couple.groom).toUpperCase());
  set("heroGroom",first(config.couple.groom));
  set("openDate",config.dateDisplay); set("heroDate",config.dateDisplay); set("footerDate",config.dateDisplay);
  set("brideName",config.couple.bride); set("groomName",config.couple.groom);
  set("ceremonyName",config.venue.ceremony.name); set("ceremonyAddress",config.venue.ceremony.address);
  set("receptionName",config.venue.reception.name); set("receptionAddress",config.venue.reception.address);
  set("footerNames",(first(config.couple.groom)+" & "+first(config.couple.bride)).toUpperCase());
  set("quoteText",config.quote.text);

  /* Navigation */
  const menu=$("#menuToggle"),nav=$("#nav");
  if(menu&&nav) menu.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    menu.setAttribute("aria-expanded",String(open));
  });
  $$("#nav a").forEach(a=>a.addEventListener("click",()=>nav&&nav.classList.remove("open")));

  /* Maps: only make links clickable when configured. */
  ["ceremony","reception"].forEach(type=>{
    const el=$("#"+type+"Map"),url=config.venue[type].mapUrl;
    if(!el)return;
    if(url){el.href=url;el.target="_blank";el.rel="noopener noreferrer";}
    else el.addEventListener("click",e=>e.preventDefault());
  });
  const directions=$("#directions");
  if(directions){
    const url=config.venue.reception.mapUrl||config.venue.ceremony.mapUrl;
    if(url){directions.href=url;directions.target="_blank";directions.rel="noopener noreferrer";}
    else directions.addEventListener("click",e=>e.preventDefault());
  }

  /* Countdown */
  const target=new Date(config.weddingDate).getTime();
  const tick=()=>{
    if(!Number.isFinite(target))return;
    let d=target-Date.now();
    if(d<=0){
      const done=$("#countdownDone"),timer=$(".timer");
      if(done)done.classList.remove("hidden"); if(timer)timer.classList.add("hidden"); return;
    }
    const vals={days:Math.floor(d/864e5)};
    d%=864e5; vals.hours=Math.floor(d/36e5); d%=36e5; vals.minutes=Math.floor(d/6e4); vals.seconds=Math.floor(d%6e4/1e3);
    Object.keys(vals).forEach(k=>set(k,String(vals[k]).padStart(2,"0")));
  };
  tick(); window.setInterval(tick,1000);

  /* Gallery */
  const gallery=$("#galleryGrid");
  let current=0;
  const lightbox=$("#lightbox"),lightboxImage=$("#lightboxImage");
  const updateLightbox=()=>{if(lightboxImage) {lightboxImage.src=config.gallery[current];lightboxImage.alt="Wedding gallery photo "+(current+1);}};
  const closeLightbox=()=>{if(lightbox)lightbox.classList.remove("open");document.body.style.overflow="";if(lightbox)lightbox.setAttribute("aria-hidden","true")};
  const openLightbox=i=>{current=i;updateLightbox();if(lightbox){lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}};
  if(gallery){
    config.gallery.forEach((src,i)=>{
      const button=document.createElement("button");button.type="button";button.className="gallery-item reveal";button.setAttribute("aria-label","Open wedding photo "+(i+1));
      const img=document.createElement("img");img.src=src;img.loading="lazy";img.decoding="async";img.alt="Wedding gallery photo "+(i+1);
      button.appendChild(img);button.addEventListener("click",()=>openLightbox(i));gallery.appendChild(button);
    });
  }
  const lbClose=$("#lightbox .lightbox-close"),lbPrev=$("#lightbox .lightbox-prev"),lbNext=$("#lightbox .lightbox-next");
  if(lbClose)lbClose.addEventListener("click",closeLightbox);
  if(lbPrev)lbPrev.addEventListener("click",()=>{current=(current-1+config.gallery.length)%config.gallery.length;updateLightbox()});
  if(lbNext)lbNext.addEventListener("click",()=>{current=(current+1)%config.gallery.length;updateLightbox()});
  if(lightbox)lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox()});
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape")closeLightbox();
    if(!lightbox||!lightbox.classList.contains("open"))return;
    if(e.key==="ArrowLeft"&&lbPrev)lbPrev.click();
    if(e.key==="ArrowRight"&&lbNext)lbNext.click();
  });

  /* Reveal animation with a safe fallback. */
  const reveals=$$(".reveal");
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
    }),{threshold:.12});
    reveals.forEach(el=>observer.observe(el));
  }else reveals.forEach(el=>el.classList.add("visible"));

  /* FAQ */
  $$(".accordion details").forEach(detail=>detail.addEventListener("toggle",()=>{
    if(detail.open) $$(".accordion details").forEach(other=>{if(other!==detail)other.open=false});
  }));

  /* Gift modals */
  const modal=$("#modal");
  $$("[data-modal]").forEach(button=>button.addEventListener("click",()=>{
    const bank=button.dataset.modal==="bank";
    set("modalLabel",bank?"GIFT / BANK":"GIFT REGISTRY");
    set("modalTitle",bank?"Bank details":"Gift registry");
    set("modalBody",bank?"Add your payment details here before publishing. Do not commit sensitive information you do not want public.":"Add your registry URL or instructions here.");
    if(modal){modal.classList.add("open");modal.setAttribute("aria-hidden","false");}
  }));
  const modalClose=$(".modal-close");
  if(modalClose)modalClose.addEventListener("click",()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true")});
  if(modal)modal.addEventListener("click",e=>{if(e.target===modal){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}});

  /* Music is optional: a missing MP3 must never break the page. */
  const audio=$("#music"),musicButton=$("#musicControl");
  if(audio&&musicButton){
    if(config.music.enabled){
      audio.src=config.music.file;
      audio.addEventListener("error",()=>{musicButton.innerHTML="♪ <span>ADD YOUR SONG FILE</span>"});
      musicButton.addEventListener("click",async()=>{
        if(audio.paused){
          try{await audio.play();musicButton.innerHTML="❚❚ <span>PAUSE OUR SONG</span>"}catch{musicButton.innerHTML="♪ <span>ADD YOUR SONG FILE</span>"}
        }else{audio.pause();musicButton.innerHTML="♪ <span>PLAY OUR SONG</span>"}
      });
    }else musicButton.style.display="none";
  }

  /* RSVP: static Pages needs an external endpoint. */
  const form=$("#rsvpForm");
  if(form)form.addEventListener("submit",async e=>{
    e.preventDefault();const status=$("#rsvpStatus");
    if(!config.rsvp.endpoint){if(status)status.textContent="RSVP is ready, but an RSVP endpoint has not been configured yet.";return;}
    try{
      const response=await fetch(config.rsvp.endpoint,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});
      if(!response.ok)throw new Error("RSVP request failed");
      if(status)status.textContent="Thank you — your RSVP has been sent.";
      form.reset();
    }catch(error){if(status)status.textContent="We couldn't send your RSVP. Please check the configured endpoint.";}
  });
});
})();