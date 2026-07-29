/* =====================================================================
   MtnCargo — content loading, mini markdown and language switching

   All visible text lives in /content/*.md so that non-developers can
   edit it on GitHub without touching any code. See CONTENT.md.

   This file is loaded synchronously in <head> because the chosen
   language must be known before the page renders.
   ===================================================================== */

window.MtnI18n = (function () {
    'use strict';

    var LANGS        = ['en', 'de'];
    var DEFAULT_LANG = 'en';
    var STORAGE_KEY  = 'mtncargo-lang';
    var SCROLL_KEY   = 'mtncargo-scroll';

    /* ---------- language resolution ---------- */

    function readStored() {
        try {
            return window.localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;                       // private mode / storage disabled
        }
    }

    function store(lang) {
        try {
            window.localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) { /* ignore */ }
    }

    function resolveLang() {
        var fromUrl = new URLSearchParams(window.location.search).get('lang');

        if (fromUrl && LANGS.indexOf(fromUrl.toLowerCase()) !== -1) {
            return fromUrl.toLowerCase();
        }

        var stored = readStored();

        if (stored && LANGS.indexOf(stored) !== -1) {
            return stored;
        }

        return DEFAULT_LANG;                   // no browser sniffing: EN by default
    }

    var lang = resolveLang();

    document.documentElement.setAttribute('lang', lang);

    /* Avoid a flash of English text while the German file is loading. */
    if (lang !== DEFAULT_LANG) {
        document.documentElement.className += ' i18n-pending';
        window.setTimeout(reveal, 2000);       // safety net if the fetch fails
    }

    function reveal() {
        document.documentElement.className =
            document.documentElement.className.replace(/\bi18n-pending\b/g, '');
    }

    /* ---------- mini markdown ---------- */

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* Only http(s), mailto, anchors and local .html pages are allowed. */
    function safeUrl(url) {
        return /^(https?:\/\/|mailto:|#|\.?\/)/i.test(url) ||
               /^[\w./-]+\.html(#[\w-]*)?$/i.test(url);
    }

    function inline(text) {
        var html = escapeHtml(text);

        html = html.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, function (m, label, url) {
            if (!safeUrl(url)) {
                return label;
            }
            var external = /^https?:/i.test(url);
            return '<a href="' + url + '"' +
                   (external ? ' target="_blank" rel="noopener noreferrer"' : '') +
                   '>' + label + '</a>';
        });

        html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

        return html;
    }

    function stripComments(md) {
        return md.replace(/<!--[\s\S]*?-->/g, '');
    }

    /* "## key" blocks  ->  { key: "raw text" } */
    function parseKeyed(md) {
        var out   = {};
        var lines = stripComments(md).split(/\r?\n/);
        var key   = null;
        var buf   = [];

        function flush() {
            if (key !== null) {
                out[key] = buf.join('\n').trim();
            }
        }

        for (var i = 0; i < lines.length; i++) {
            var match = /^##\s+([A-Za-z0-9_]+)\s*$/.exec(lines[i]);

            if (match) {
                flush();
                key = match[1];
                buf = [];
            } else if (key !== null) {
                buf.push(lines[i]);
            }
        }

        flush();
        return out;
    }

    /* Value of a "## key" block as inline HTML. */
    function valueToHtml(text) {
        return inline(text)
            .replace(/\n{2,}/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    /* Like valueToText, but keeps real line breaks. Used for Brevo's
       validation strings: a newline survives whether Brevo injects the
       message as text or as HTML, because the panels and error labels are
       styled with white-space: pre-line. That makes it a safer way to
       force a break than <br>, which only works in the HTML case. */
    function valueToTextMultiline(text) {
        return text
            .replace(/\[([^\]\n]+)\]\([^)\s]+\)/g, '$1')
            .replace(/\*\*([^*\n]+)\*\*/g, '$1')
            .replace(/\*([^*\n]+)\*/g, '$1')
            .replace(/[ \t]+/g, ' ')
            .replace(/[ \t]*\n[ \t]*/g, '\n')
            .trim();
    }

    /* Value of a "## key" block as plain text (for attributes and <title>). */
    function valueToText(text) {
        return text
            .replace(/\[([^\]\n]+)\]\([^)\s]+\)/g, '$1')
            .replace(/\*\*([^*\n]+)\*\*/g, '$1')
            .replace(/\*([^*\n]+)\*/g, '$1')
            .replace(/\s*\n\s*/g, ' ')
            .trim();
    }

    /* Full markdown document -> HTML (used by the legal pages). */
    function renderDocument(md) {
        var blocks = stripComments(md).trim().split(/\n\s*\n/);
        var html   = '';

        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i].trim();

            if (!block) {
                continue;
            }

            var heading = /^(#{1,4})\s+(.+)$/.exec(block.split('\n')[0]);

            if (heading) {
                var level = heading[1].length;
                html += '<h' + level + '>' + inline(heading[2].trim()) + '</h' + level + '>';

                var rest = block.split('\n').slice(1).join('\n').trim();
                if (rest) {
                    html += renderDocument(rest);
                }
                continue;
            }

            if (/^(-{3,}|\*{3,}|_{3,})$/.test(block)) {
                html += '<hr>';
                continue;
            }

            if (/^[-*]\s+/.test(block)) {
                var items = block.split(/\r?\n/)
                    .filter(function (line) { return line.trim(); })
                    .map(function (line) {
                        return '<li>' + inline(line.replace(/^\s*[-*]\s+/, '')) + '</li>';
                    })
                    .join('');
                html += '<ul>' + items + '</ul>';
                continue;
            }

            html += '<p>' + inline(block).replace(/\n/g, '<br>') + '</p>';
        }

        return html;
    }

    /* ---------- Brevo validation strings ---------- */

    var brevoFallback = {
        en: {
            required: 'This field cannot be left blank.',
            email:    'The information provided is invalid. Please review the field format and try again.',
            generic:  'The information provided is invalid. Please review the field format and try again.'
        },
        de: {
            required: 'Dieses Feld darf nicht leer sein.',
            email:    'Die eingegebenen Informationen sind nicht gültig. Bitte überprüfe das Feldformat und versuche es erneut.',
            generic:  'Die eingegebenen Informationen sind nicht gültig. Bitte überprüfe das Feldformat und versuche es erneut.'
        }
    };

    function applyBrevoGlobals(dict) {
        var fallback = brevoFallback[lang] || brevoFallback.en;

        var required = (dict && dict.form_msg_required)      ? valueToTextMultiline(dict.form_msg_required)      : fallback.required;
        var email    = (dict && dict.form_msg_email_invalid) ? valueToTextMultiline(dict.form_msg_email_invalid) : fallback.email;
        var generic  = (dict && dict.form_msg_generic)       ? valueToTextMultiline(dict.form_msg_generic)       : fallback.generic;

        window.LOCALE                 = lang;
        window.REQUIRED_ERROR_MESSAGE = required;
        window.REQUIRED_CODE_ERROR_MESSAGE = required;
        window.REQUIRED_MULTISELECT_MESSAGE = required;
        window.EMAIL_INVALID_MESSAGE  = email;
        window.SMS_INVALID_MESSAGE    = email;
        window.GENERIC_INVALID_MESSAGE = generic;
        window.INVALID_NUMBER         = generic;
        window.INVALID_DATE           = generic;

        window.translation = {
            common: {
                selectedList:    '{quantity} list selected',
                selectedLists:   '{quantity} lists selected',
                selectedOption:  '{quantity} selected',
                selectedOptions: '{quantity} selected'
            }
        };
    }

    /* Called inline right after the form so Turnstile picks up the language. */
    function prepareForm() {
        var captcha = document.getElementById('sib-captcha');
        if (captcha) {
            captcha.setAttribute('data-language', lang);
        }

        var locale = document.querySelector('[data-i18n-locale]');
        if (locale) {
            locale.value = lang;
        }
    }

    /* ---------- applying content to the page ---------- */

    function applyDict(dict) {
        if (dict.page_title) {
            document.title = valueToText(dict.page_title);
        }

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                el.innerHTML = valueToHtml(dict[key]);
            }
        });

        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
                var parts = pair.split(':');
                var attr  = (parts[0] || '').trim();
                var key   = (parts[1] || '').trim();
                if (attr && dict[key] !== undefined) {
                    el.setAttribute(attr, valueToText(dict[key]));
                }
            });
        });

        applyBrevoGlobals(dict);
    }

    /* ---------- language switch UI ---------- */

    function setLang(next) {
        if (LANGS.indexOf(next) === -1 || next === lang) {
            return;
        }

        store(next);

        try {
            window.sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
        } catch (e) { /* ignore */ }

        /* A full reload keeps the captcha language, meta tags and the
           Brevo locale field consistent — far less fragile than patching
           third-party widgets in place. */
        var url = new URL(window.location.href);
        url.searchParams.delete('lang');
        window.location.replace(url.toString());
    }

    function restoreScroll() {
        try {
            var y = window.sessionStorage.getItem(SCROLL_KEY);
            if (y !== null) {
                window.sessionStorage.removeItem(SCROLL_KEY);
                window.scrollTo(0, parseInt(y, 10) || 0);
            }
        } catch (e) { /* ignore */ }
    }

    function buildSwitch() {
        var host = document.querySelector('[data-lang-switch]');

        if (!host) {
            return;
        }

        host.innerHTML = '';

        LANGS.forEach(function (code, index) {
            if (index > 0) {
                var sep = document.createElement('span');
                sep.className = 'lang-sep';
                sep.setAttribute('aria-hidden', 'true');
                sep.textContent = '/';
                host.appendChild(sep);
            }

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'lang-btn' + (code === lang ? ' is-active' : '');
            btn.textContent = code.toUpperCase();
            btn.setAttribute('lang', code);
            btn.setAttribute('title', code === 'de' ? 'Deutsch' : 'English');
            btn.setAttribute('aria-label', code === 'de' ? 'Deutsch' : 'English');

            if (code === lang) {
                btn.setAttribute('aria-current', 'true');
            }

            btn.addEventListener('click', function () {
                setLang(code);
            });

            host.appendChild(btn);
        });
    }

    /* ---------- loading ---------- */

    function loadText(path) {
        return fetch(path, { cache: 'no-cache' }).then(function (response) {
            if (!response.ok) {
                throw new Error('Could not load ' + path + ' (' + response.status + ')');
            }
            return response.text();
        });
    }

    /* Loads content/<name>.<lang>.md, falling back to English. */
    function load(name) {
        return loadText('content/' + name + '.' + lang + '.md')
            .catch(function (error) {
                if (lang === DEFAULT_LANG) {
                    throw error;
                }
                console.warn(error.message + ' — falling back to English.');
                return loadText('content/' + name + '.' + DEFAULT_LANG + '.md');
            });
    }

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function hideUntilReady() {
        if (!/\bi18n-pending\b/.test(document.documentElement.className)) {
            document.documentElement.className += ' i18n-pending';
        }
        window.setTimeout(reveal, 2000);       // safety net if the fetch fails
    }

    /* Sets up the switcher and loads the one-pager texts. */
    function initPage() {
        var pending = load('site');            // start the request immediately

        onReady(function () {
            buildSwitch();

            pending
                .then(function (md) {
                    applyDict(parseKeyed(md));
                })
                .catch(function (error) {
                    /* The HTML already contains the English text as a
                       fallback, so a failed load is not fatal. */
                    console.error('Content could not be loaded:', error);
                })
                .then(function () {
                    reveal();
                    restoreScroll();
                });
        });
    }

    /* Sets up the switcher and renders a legal page from markdown. */
    function initDocument(name, targetSelector, options) {
        /* options.shared loads content/<name>.md instead of a per-language
           file — used by the confirmation page, which shows both languages
           at once because visitors arrive from an email link and may have
           no stored language preference. */
        var shared = !!(options && options.shared);

        /* Start both requests immediately: the page text itself and the
           shared site texts used for navigation labels. */
        var pendingDoc  = shared
            ? loadText('content/' + name + '.md')
            : load(name);
        var pendingSite = load('site').catch(function () { return null; });

        hideUntilReady();

        onReady(function () {
            buildSwitch();

            var target = document.querySelector(targetSelector);

            Promise.all([pendingDoc, pendingSite])
                .then(function (results) {
                    var siteDict = results[1] ? parseKeyed(results[1]) : {};

                    document.querySelectorAll('[data-i18n]').forEach(function (el) {
                        var key = el.getAttribute('data-i18n');
                        if (siteDict[key] !== undefined) {
                            el.innerHTML = valueToHtml(siteDict[key]);
                        }
                    });

                    if (target) {
                        target.innerHTML = renderDocument(results[0]);
                    }

                    var h1 = target && target.querySelector('h1');
                    if (h1) {
                        document.title = h1.textContent + ' — MtnCargo';
                    }
                })
                .catch(function (error) {
                    console.error('Content could not be loaded:', error);
                    if (target) {
                        target.innerHTML =
                            '<p>This page could not be loaded. Please try again later.</p>';
                    }
                })
                .then(reveal);
        });
    }

    return {
        lang:              lang,
        languages:         LANGS,
        setLang:           setLang,
        prepareForm:       prepareForm,
        applyBrevoGlobals: applyBrevoGlobals,
        renderDocument:    renderDocument,
        parseKeyed:        parseKeyed,
        initPage:          initPage,
        initDocument:      initDocument
    };

})();
