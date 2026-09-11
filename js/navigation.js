/* ========================================
   MOBILE NAVIGATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------
    // 1. SELECCIÓN DE ELEMENTOS DOM
    // --------------------------------------------------

    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.site-header__menu-toggle');
    const navigation = document.querySelector('#site-navigation');
    const closeButton = document.querySelector('.site-header__close');

    // Guardia de seguridad básica
    if (
        !header ||
        !menuToggle ||
        !navigation ||
        !closeButton
    ) {
        return;
    }

    const navigationLinks = navigation.querySelectorAll(
        '.site-navigation__link'
    );


    // --------------------------------------------------
    // 2. MEDIA QUERY — DESKTOP
    // --------------------------------------------------
    // Debe coincidir con el breakpoint del CSS.
    // Mobile: < 768px
    // Desktop: >= 768px

    const desktopMediaQuery = window.matchMedia(
        '(min-width: 768px)'
    );


    // --------------------------------------------------
    // 3. ELEMENTOS FOCUSABLES DEL MENÚ
    // --------------------------------------------------

    const getFocusableElements = () => {

        return navigation.querySelectorAll(
            'a[href], ' +
            'button:not([disabled]), ' +
            'input:not([disabled]), ' +
            'select:not([disabled]), ' +
            'textarea:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"])'
        );

    };


    // --------------------------------------------------
    // 4. SINCRONIZAR ACCESIBILIDAD
    // --------------------------------------------------

    const syncAccessibilityState = (isOpen) => {

        if (desktopMediaQuery.matches) {

            navigation.setAttribute(
                'aria-hidden',
                'false'
            );

            navigation.inert = false;

        } else {

            navigation.setAttribute(
                'aria-hidden',
                String(!isOpen)
            );

            navigation.inert = !isOpen;

        }

    };


    // --------------------------------------------------
    // 5. CONTROL DEL ESTADO DEL MENÚ
    // --------------------------------------------------

    const setMenuState = (forceState) => {

        const isOpen =
            typeof forceState === 'boolean'
                ? forceState
                : !navigation.classList.contains('is-open');


        // ------------------------------------------
        // ESTADO VISUAL
        // ------------------------------------------

        navigation.classList.toggle(
            'is-open',
            isOpen
        );

        header.classList.toggle(
            'is-menu-open',
            isOpen
        );


        // ------------------------------------------
        // BOTÓN HAMBURGUESA
        // ------------------------------------------

        menuToggle.setAttribute(
            'aria-expanded',
            String(isOpen)
        );

        menuToggle.setAttribute(
            'aria-label',
            isOpen
                ? 'Cerrar menú de navegación'
                : 'Abrir menú de navegación'
        );


        // ------------------------------------------
        // ACCESIBILIDAD
        // ------------------------------------------

        syncAccessibilityState(isOpen);


        // ------------------------------------------
        // BLOQUEO DE SCROLL
        // ------------------------------------------

        document.body.style.overflow =
            isOpen && !desktopMediaQuery.matches
                ? 'hidden'
                : '';


        // ------------------------------------------
        // GESTIÓN DEL FOCO
        // ------------------------------------------

        if (
            isOpen &&
            !desktopMediaQuery.matches
        ) {

            requestAnimationFrame(() => {

                closeButton.focus();

            });

        } else if (
            !isOpen &&
            !desktopMediaQuery.matches
        ) {

            requestAnimationFrame(() => {

                menuToggle.focus();

            });

        }

    };


    // --------------------------------------------------
    // 6. ESTADO DEL HEADER AL HACER SCROLL
    // --------------------------------------------------

    let isScrollTicking = false;

    const handleScroll = () => {

        if (isScrollTicking) {
            return;
        }

        window.requestAnimationFrame(() => {

            header.classList.toggle(
                'header--scrolled',
                window.scrollY > 20
            );

            isScrollTicking = false;

        });

        isScrollTicking = true;

    };


    // --------------------------------------------------
    // 7. ABRIR MENÚ
    // --------------------------------------------------

    menuToggle.addEventListener(
        'click',
        () => {

            setMenuState(true);

        }
    );


    // --------------------------------------------------
    // 8. CERRAR MENÚ
    // --------------------------------------------------

    closeButton.addEventListener(
        'click',
        () => {

            setMenuState(false);

        }
    );


    // --------------------------------------------------
    // 9. CERRAR AL HACER CLICK FUERA
    // --------------------------------------------------

    document.addEventListener(
        'click',
        (event) => {

            if (
                !navigation.classList.contains('is-open') ||
                desktopMediaQuery.matches
            ) {
                return;
            }


            const clickedInsideNavigation =
                navigation.contains(event.target);

            const clickedMenuToggle =
                menuToggle.contains(event.target);


            if (
                !clickedInsideNavigation &&
                !clickedMenuToggle
            ) {

                setMenuState(false);

            }

        }
    );


    // --------------------------------------------------
    // 10. CERRAR AL HACER CLICK EN UN ENLACE
    // --------------------------------------------------

    navigationLinks.forEach((link) => {

        link.addEventListener(
            'click',
            () => {

                if (!desktopMediaQuery.matches) {

                    setMenuState(false);

                }

            }
        );

    });


    // --------------------------------------------------
    // 11. TECLADO — ESCAPE
    // --------------------------------------------------

    document.addEventListener(
        'keydown',
        (event) => {

            if (
                event.key === 'Escape' &&
                navigation.classList.contains('is-open') &&
                !desktopMediaQuery.matches
            ) {

                event.preventDefault();

                setMenuState(false);

            }

        }
    );


    // --------------------------------------------------
    // 12. FOCUS TRAP
    // --------------------------------------------------

    document.addEventListener(
        'keydown',
        (event) => {

            if (
                event.key !== 'Tab' ||
                !navigation.classList.contains('is-open') ||
                desktopMediaQuery.matches
            ) {
                return;
            }


            const menuFocusables =
                Array.from(
                    getFocusableElements()
                );


            if (!menuFocusables.length) {
                return;
            }


            const firstFocusable =
                menuFocusables[0];

            const lastFocusable =
                menuFocusables[
                    menuFocusables.length - 1
                ];


            // --------------------------------------
            // TAB
            // Último → Primero
            // --------------------------------------

            if (
                !event.shiftKey &&
                document.activeElement === lastFocusable
            ) {

                event.preventDefault();

                firstFocusable.focus();

                return;

            }


            // --------------------------------------
            // SHIFT + TAB
            // Primero → Último
            // --------------------------------------

            if (
                event.shiftKey &&
                document.activeElement === firstFocusable
            ) {

                event.preventDefault();

                lastFocusable.focus();

            }

        }
    );


    // --------------------------------------------------
    // 13. CAMBIO MOBILE ↔ DESKTOP
    // --------------------------------------------------

    desktopMediaQuery.addEventListener(
        'change',
        () => {

            // ------------------------------------------
            // REINICIAR ESTADO DEL MENÚ
            // ------------------------------------------

            navigation.classList.remove(
                'is-open'
            );

            header.classList.remove(
                'is-menu-open'
            );


            // ------------------------------------------
            // BOTÓN HAMBURGUESA
            // ------------------------------------------

            menuToggle.setAttribute(
                'aria-expanded',
                'false'
            );

            menuToggle.setAttribute(
                'aria-label',
                'Abrir menú de navegación'
            );


            // ------------------------------------------
            // ACCESIBILIDAD
            // ------------------------------------------

            syncAccessibilityState(false);


            // ------------------------------------------
            // SCROLL
            // ------------------------------------------

            document.body.style.overflow = '';

        }
    );


    // --------------------------------------------------
    // 14. LISTENER DE SCROLL
    // --------------------------------------------------

    window.addEventListener(
        'scroll',
        handleScroll,
        {
            passive: true
        }
    );


    // --------------------------------------------------
    // 15. ESTADO INICIAL
    // --------------------------------------------------

    menuToggle.setAttribute(
        'aria-expanded',
        'false'
    );

    menuToggle.setAttribute(
        'aria-label',
        'Abrir menú de navegación'
    );

    syncAccessibilityState(false);


    // --------------------------------------------------
    // 16. ESTADO INICIAL DEL HEADER
    // --------------------------------------------------

    handleScroll();

});