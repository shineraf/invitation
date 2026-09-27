# Premium Wedding Invitation Template

Reusable mobile-first editorial wedding e-invitation for GitHub Pages. Built with HTML5, CSS3 and vanilla JavaScript; no build process or backend is required.

## Customize
Edit the weddingConfig object at the top of script.js to change names, date, venues, map URLs, photos, music, RSVP endpoint and quote. Replace the SVG placeholders in assets/images with your own licensed JPG/WebP photos. Add your licensed MP3 at assets/music/wedding-song.mp3.

## GitHub Pages
All asset references are relative, so the template works at repository URLs such as https://USERNAME.github.io/REPOSITORY/. After merging to main, enable Settings > Pages > Deploy from a branch > main > root.

## RSVP
Static GitHub Pages cannot securely store submissions. Set weddingConfig.rsvp.endpoint to a compatible hosted form endpoint. If it is empty, the page explicitly explains that configuration is required.

## Accessibility
Semantic sections, labels, keyboard lightbox controls, lazy images, IntersectionObserver reveals and prefers-reduced-motion support are included.

## Features
Opening screen, responsive navigation, Ken Burns hero, countdown, couple profiles, venue details, timeline, story, editorial gallery/lightbox, quote, dress code, gift modals, configurable RSVP, music control, FAQ and map placeholder.
