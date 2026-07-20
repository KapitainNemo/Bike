/* =====================================================
   MtnCargo
   Main JavaScript
===================================================== */


/*
   Language detection & translation

   Defaults to English for every browser language
   except German (de, de-DE, de-AT, de-CH, ...),
   which gets the German version.
*/


const translations = {

    en: {
        page_title: "Carry More. Go Further.",
        meta_description: "What we are building is an adventure cargo bike built for gravel roads, bikepacking, off-road exploration and nights outside.",
        og_title: "MtnCargo — Carry More. Go Further.",
        og_description: "An adventure cargo bike built for gravel roads, wild places and nights outside.",

        hero_title: "Carry More.<br>Go Further.",
        hero_text: "We are building an adventure cargo bike built for gravel roads, wild places and nights outside.",
        hero_button: "Join the first riders",

        section1_title: "Not another cargo bike.",
        section1_text1: "There are bikes built for cities. And there are bikes built for adventure.",
        section1_text2: "MtnCargo was created for the space between them. For gravel tracks, forest roads, forgotten paths and weekends that turn into stories.",

        section2_title: "Built for detours.",
        section2_text1: "The best routes rarely appear on a map.",
        section2_text2: "Carry your gear. Follow the trail. Take the longer way home.",

        quote_text: "\u201cSome rides require less. Some require more.\u201d",
        quote_list: "More water. More food. More camera gear. More sleeping bags. More memories.",

        section3_title: "One night.<br>Two wheels.<br>Endless routes.",
        section3_text1: "Inspired by gravel culture and bikepacking, MtnCargo is made for spontaneous escapes.",
        section3_text2: "Leave after work. Sleep somewhere new. Wake up somewhere better.",

        section4_title: "More than cargo.<br>More to come.",
        section4_text: "This is just the beginning. Stay tuned for what's next.",

        form_title: "Be among the first riders.",
        form_text: "The MtnCargo journey is just beginning. Join the list and follow the adventure.",
        form_email_label: "Email",
        form_button: "JOIN THE RIDE",
        form_consent: "By joining, you agree to receive information about the launch. You can unsubscribe anytime.",
        form_error: "We couldn't save your signup. Please try again.",
        form_success: "Welcome to MtnCargo. Please confirm your email address.",
        form_locale: "en",
        captcha_lang: "en",

        footer_text: "Built for gravel. Designed for detours. Made to carry more than cargo.",
        footer_privacy: "Privacy",
        footer_imprint: "Imprint"
    },

    de: {
        page_title: "Mehr tragen. Weiter kommen.",
        meta_description: "Wir entwickeln ein Abenteuer-Cargobike f\u00fcr Schotterwege, Bikepacking, Offroad-Touren und N\u00e4chte im Freien.",
        og_title: "MtnCargo — Mehr tragen. Weiter kommen.",
        og_description: "Ein Abenteuer-Cargobike f\u00fcr Schotterwege, wilde Orte und N\u00e4chte im Freien.",

        hero_title: "Mehr tragen.<br>Weiter kommen.",
        hero_text: "Wir bauen ein Abenteuer-Cargobike f\u00fcr Schotterwege, wilde Orte und N\u00e4chte im Freien.",
        hero_button: "Werde First Rider",

        section1_title: "Kein gew\u00f6hnliches Cargobike.",
        section1_text1: "Es gibt Bikes f\u00fcr die Stadt. Und es gibt Bikes f\u00fcr Abenteuer.",
        section1_text2: "MtnCargo wurde f\u00fcr den Raum dazwischen gebaut. F\u00fcr Schotterpisten, Waldwege, vergessene Pfade und Wochenenden, die zu Geschichten werden.",

        section2_title: "Gebaut f\u00fcr Umwege.",
        section2_text1: "Die besten Routen stehen selten auf der Karte.",
        section2_text2: "Pack deine Ausr\u00fcstung. Folge dem Pfad. Nimm den l\u00e4ngeren Weg nach Hause.",

        quote_text: "\u201eManche Touren brauchen weniger. Manche brauchen mehr.\u201c",
        quote_list: "Mehr Wasser. Mehr Proviant. Mehr Kameraequipment. Mehr Schlafs\u00e4cke. Mehr Erinnerungen.",

        section3_title: "Eine Nacht.<br>Zwei R\u00e4der.<br>Endlose Routen.",
        section3_text1: "Inspiriert von Gravel-Kultur und Bikepacking ist MtnCargo f\u00fcr spontane Ausfl\u00fcge gemacht.",
        section3_text2: "Fahr los nach der Arbeit. Schlaf woanders. Wach irgendwo Besserem auf.",

        section4_title: "Mehr als Cargo.<br>Es kommt noch mehr.",
        section4_text: "Das ist erst der Anfang. Bleib gespannt, was als N\u00e4chstes kommt.",

        form_title: "Sei einer der ersten Fahrer.",
        form_text: "Die MtnCargo-Reise beginnt gerade erst. Trag dich ein und verfolge das Abenteuer.",
        form_email_label: "E-Mail",
        form_button: "JETZT ANMELDEN",
        form_consent: "Mit deiner Anmeldung stimmst du dem Erhalt von Informationen zum Launch zu. Du kannst dich jederzeit abmelden.",
        form_error: "Deine Anmeldung konnte nicht gespeichert werden. Bitte versuche es erneut.",
        form_success: "Willkommen bei MtnCargo. Bitte best\u00e4tige deine E-Mail-Adresse.",
        form_locale: "de",
        captcha_lang: "de",

        footer_text: "Gebaut f\u00fcr Gravel. Gemacht f\u00fcr Umwege. Entwickelt, um mehr als nur Cargo zu tragen.",
        footer_privacy: "Datenschutz",
        footer_imprint: "Impressum"
    }

};


function detectLanguage() {

    const browserLang =
        (navigator.language || navigator.userLanguage || "en")
        .toLowerCase();

    return browserLang.startsWith("de") ? "de" : "en";

}


function applyTranslations(lang) {

    const dict = translations[lang] || translations.en;

    document.documentElement.setAttribute("lang", lang);

    if (dict.page_title) {
        document.title = dict.page_title;
    }

    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.getAttribute("data-i18n");

        if (dict[key] !== undefined) {
            element.innerHTML = dict[key];
        }

    });

    document.querySelectorAll("[data-i18n-attr]").forEach(element => {

        const [attrName, key] =
            element.getAttribute("data-i18n-attr").split(":");

        if (dict[key] !== undefined) {
            element.setAttribute(attrName, dict[key]);
        }

    });

    document.querySelectorAll("[data-i18n-value]").forEach(element => {

        const key = element.getAttribute("data-i18n-value");

        if (dict[key] !== undefined) {
            element.value = dict[key];
        }

    });

}


// applyTranslations(detectLanguage());




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
