gsap.registerPlugin(SplitText,ScrollTrigger);

const images = gsap.utils.toArray(".animate-img");

gsap.from(images[0],{
    scale:0.5,
    duration:1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: images[0],
        start: "top 80%",
        end: "top 40%",
        scrub:1,
        markers:true,
        toggleActions:"play none none none"
    }
});

gsap.from(images[1],{
    opacity:0,
    rotate:10,
    duration:1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: images[1],
        start: "top 80%",
        end: "top 40%",
        scrub:1,
        toggleActions:"restart none restart none"
    }
});

gsap.from(images[2],{
    opacity:0,
    x:-100,
    duration:1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: images[2],
        start: "top 80%",
        end: "top 40%",
        scrub:1,
        toggleActions:"restart none restart none"
    }
});

const texts = gsap.utils.toArray(".animate-text");

gsap.from(texts[0],{
    opacity:0,
    y:50,
    duration:1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: texts[0],
        start: "top 80%",
        end: "top 40%",
        scrub:1,
        toggleActions:"restart none restart none"
    }
});

texts[0].addEventListener("mouseenter",()=>{
    gsap.to(texts[0],{scale:1.1, color: "red", duration: 0.3});
});
texts[0].addEventListener("mouseleave",()=>{
    gsap.to(texts[0],{scale:1, color: "black", duration: 0.3});
});

images[2].addEventListener("mouseenter",()=>{
    gsap.to(images[2],{rotation:10, filter:"brightness(120%)", duration: 0.3});
});
images[2].addEventListener("mouseleave",()=>{
    gsap.to(images[2],{rotation:0, filter:"brightness(100%)", duration: 0.3});
});

const split = new SplitText(".split-text", {type: "chars"});

gsap.from(split.chars,{
    opacity:0,
    y:50,
    duration:3,
    ease: "power2.out",
    stagger:0.1,
    scrollTrigger: {
        trigger:".split-text",
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none reverse none"
    }
});




























