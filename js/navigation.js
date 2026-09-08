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

    // Guardia de seguridad básica
    if (!header || !menuToggle || !navigation) return;

    const navigationLinks = navigation.querySelectorAll(
        '.site-navigation__link'
    );


    // --------------------------------------------------
    // 2. MEDIA QUERY — DESKTOP
    // --------------------------------------------------

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
    // 4. CONTROL DEL ESTADO DEL MENÚ
    // --------------------------------------------------

    const setMenuState = (forceState) => {

        const isOpen =
            typeof forceState === 'boolean'
                ? forceState
                : !navigation.classList.contains('is-open');


        // Estado visual
        navigation.classList.toggle('is-open', isOpen);
        header.classList.toggle('is-menu-open', isOpen);


        // Accesibilidad del botón
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


        // Estado de accesibilidad del menú
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


        // Bloquear / liberar scroll
        document.body.style.overflow = isOpen
            ? 'hidden'
            : '';


        // Gestión del foco
        if (isOpen) {

            const focusableElements =
                getFocusableElements();

            if (focusableElements.length) {

                requestAnimationFrame(() => {
                    focusableElements[0].focus();
                });

            }

        } else if (!desktopMediaQuery.matches) {

            requestAnimationFrame(() => {
                menuToggle.focus();
            });

        }

    };


    // --------------------------------------------------
    // 5. HEADER — ESTADO AL HACER SCROLL
    // --------------------------------------------------

    let isScrollTicking = false;

    const handleScroll = () => {

        if (isScrollTicking) return;

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
    // 6. EVENTOS DE INTERACCIÓN
    // --------------------------------------------------

    // Botón hamburguesa
    menuToggle.addEventListener(
        'click',
        () => setMenuState()
    );


    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', (event) => {

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

    });


    // Cerrar al hacer clic en un enlace
    navigationLinks.forEach((link) => {

        link.addEventListener('click', () => {

            if (!desktopMediaQuery.matches) {
                setMenuState(false);
            }

        });

    });


    // --------------------------------------------------
    // 7. TECLADO — ACCESIBILIDAD Y FOCUS TRAP
    // --------------------------------------------------

    document.addEventListener('keydown', (event) => {

        // ESCAPE — cerrar menú
        if (
            event.key === 'Escape' &&
            navigation.classList.contains('is-open')
        ) {

            event.preventDefault();

            setMenuState(false);

            return;

        }


        // Focus trap
        if (
            event.key !== 'Tab' ||
            !navigation.classList.contains('is-open') ||
            desktopMediaQuery.matches
        ) {
            return;
        }


        const menuFocusables =
            Array.from(getFocusableElements());


        // El botón hamburguesa forma parte
        // del ciclo de foco
        const focusableElements = [
            menuToggle,
            ...menuFocusables
        ];


        if (!focusableElements.length) return;


        const firstFocusable =
            focusableElements[0];

        const lastFocusable =
            focusableElements[
                focusableElements.length - 1
            ];


        // TAB en el último elemento
        // → vuelve al primero
        if (
            !event.shiftKey &&
            document.activeElement === lastFocusable
        ) {

            event.preventDefault();

            firstFocusable.focus();

            return;

        }


        // SHIFT + TAB en el primero
        // → vuelve al último
        if (
            event.shiftKey &&
            document.activeElement === firstFocusable
        ) {

            event.preventDefault();

            lastFocusable.focus();

        }

    });


    // --------------------------------------------------
    // 8. REACCIÓN A CAMBIOS DE PANTALLA
    // --------------------------------------------------

    desktopMediaQuery.addEventListener(
        'change',
        (event) => {

            // ------------------------------------------
            // DESKTOP
            // ------------------------------------------

            if (event.matches) {

                navigation.classList.remove('is-open');
                header.classList.remove('is-menu-open');

                menuToggle.setAttribute(
                    'aria-expanded',
                    'false'
                );

                menuToggle.setAttribute(
                    'aria-label',
                    'Abrir menú de navegación'
                );

                navigation.setAttribute(
                    'aria-hidden',
                    'false'
                );

                navigation.inert = false;

                document.body.style.overflow = '';

                return;
            }


            // ------------------------------------------
            // MOBILE
            // ------------------------------------------

            navigation.classList.remove('is-open');
            header.classList.remove('is-menu-open');

            menuToggle.setAttribute(
                'aria-expanded',
                'false'
            );

            menuToggle.setAttribute(
                'aria-label',
                'Abrir menú de navegación'
            );

            navigation.setAttribute(
                'aria-hidden',
                'true'
            );

            navigation.inert = true;

            document.body.style.overflow = '';

        }
    );


    // --------------------------------------------------
    // 9. LISTENER DE SCROLL
    // --------------------------------------------------

    window.addEventListener(
        'scroll',
        handleScroll,
        { passive: true }
    );


    // --------------------------------------------------
    // 10. ESTADO INICIAL
    // --------------------------------------------------

    menuToggle.setAttribute(
        'aria-expanded',
        'false'
    );

    menuToggle.setAttribute(
        'aria-label',
        'Abrir menú de navegación'
    );


    if (desktopMediaQuery.matches) {

        navigation.setAttribute(
            'aria-hidden',
            'false'
        );

        navigation.inert = false;

    } else {

        navigation.setAttribute(
            'aria-hidden',
            'true'
        );

        navigation.inert = true;

    }


    // Estado inicial del header
    handleScroll();

});