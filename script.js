/* =====================================================
   MtnCargo
   Main JavaScript
===================================================== */


/*
   Scroll reveal animation
*/


const revealElements = document.querySelectorAll(".reveal");


const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);



revealElements.forEach(element => {

    revealObserver.observe(element);

});





/*
   Hero subtle parallax effect

   Disabled for:
   - mobile
   - users with reduced motion enabled
*/


const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


const isMobile = window.innerWidth < 700;



if (!prefersReducedMotion && !isMobile) {


    const heroImage = document.querySelector(".hero img");


    if (heroImage) {


        window.addEventListener(
            "scroll",
            () => {


                const offset = window.scrollY * 0.15;


                heroImage.style.transform =
                    `translateY(${offset}px) scale(1.05)`;


            },
            {
                passive:true
            }
        );


    }


}






/*
   Smooth anchor handling

   Keeps browser native scrolling
   but closes future extension point.
*/


document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {


    anchor.addEventListener(
        "click",
        function(event) {


            const target =
                document.querySelector(
                    this.getAttribute("href")
                );


            if(target) {

                event.preventDefault();


                target.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });

            }


        }
    );


});