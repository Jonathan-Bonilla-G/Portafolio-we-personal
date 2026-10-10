/* ========================================
   NAVIGATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------
    // 1. ELEMENTOS DOM
    // --------------------------------------------------

    const header = document.querySelector('.site-header');

    const menuToggle = document.querySelector(
        '.site-header__menu-toggle'
    );

    const navigation = document.querySelector(
        '#site-navigation'
    );

    const closeButton = document.querySelector(
        '.site-header__close'
    );

    // --------------------------------------------------
    // MEGA MENÚ — SERVICIOS
    // --------------------------------------------------

    const servicesItem = navigation?.querySelector(
        '.site-navigation__item--mega-menu'
    );

    const servicesTrigger = servicesItem?.querySelector(
        '.site-navigation__mega-trigger'
    );

    const servicesMegaMenu = servicesItem?.querySelector(
        '.site-navigation__mega-menu'
    );

    const projectsItem = navigation?.querySelector(
        '.site-navigation__item--projects-menu'
    );

    const projectsTrigger = projectsItem?.querySelector(
        '.site-navigation__mega-trigger'
    );

    const projectsMegaMenu = projectsItem?.querySelector(
        '.site-navigation__mega-menu'
    );


    // --------------------------------------------------
    // GUARD
    // --------------------------------------------------

    if (
        !header ||
        !menuToggle ||
        !navigation ||
        !closeButton
    ) {
        return;
    }


    // --------------------------------------------------
    // 2. MEDIA QUERY
    // --------------------------------------------------

    const desktopMediaQuery = window.matchMedia(
        '(min-width: 768px)'
    );


    // --------------------------------------------------
    // 3. ELEMENTOS FOCUSABLES
    // --------------------------------------------------

    const getFocusableElements = () => {

        return Array.from(
            navigation.querySelectorAll(
                [
                    'a[href]',
                    'button:not([disabled])',
                    'input:not([disabled])',
                    'select:not([disabled])',
                    'textarea:not([disabled])',
                    '[tabindex]:not([tabindex="-1"])'
                ].join(',')
            )
        ).filter((element) => {

            return (
                !element.hasAttribute('hidden') &&
                !element.closest('[inert]')
            );

        });

    };


    // --------------------------------------------------
    // 4. ACCESSIBILITY — MENÚ PRINCIPAL
    // --------------------------------------------------

    const syncAccessibilityState = (isOpen) => {

        if (desktopMediaQuery.matches) {

            navigation.setAttribute(
                'aria-hidden',
                'false'
            );

            navigation.inert = false;

            return;
        }


        navigation.setAttribute(
            'aria-hidden',
            String(!isOpen)
        );

        navigation.inert = !isOpen;

    };


    // --------------------------------------------------
    // 5. HEADER STATE
    // --------------------------------------------------

    const syncHeaderMenuState = () => {

        const mobileMenuOpen =
            navigation.classList.contains(
                'is-open'
            );

        const megaMenuOpen =
            desktopMediaQuery.matches &&
            (servicesItem?.classList.contains('is-open') ||
                projectsItem?.classList.contains('is-open'));


        header.classList.toggle(
            'is-menu-open',
            mobileMenuOpen || megaMenuOpen
        );

    };


    // --------------------------------------------------
    // 6. MEGA MENÚ — SERVICIOS
    // --------------------------------------------------

    const setServicesMegaMenuState = (isOpen) => {

        if (
            !servicesItem ||
            !servicesTrigger ||
            !servicesMegaMenu
        ) {
            return;
        }


        const shouldOpen = Boolean(isOpen);


        // ----------------------------------------------
        // ESTADO VISUAL
        // ----------------------------------------------

        servicesItem.classList.toggle(
            'is-open',
            shouldOpen
        );


        // ----------------------------------------------
        // ARIA
        // ----------------------------------------------

        servicesTrigger.setAttribute(
            'aria-expanded',
            String(shouldOpen)
        );


        servicesMegaMenu.setAttribute(
            'aria-hidden',
            String(!shouldOpen)
        );


        // ----------------------------------------------
        // INERT
        // ----------------------------------------------

        servicesMegaMenu.inert = !shouldOpen;


        // ----------------------------------------------
        // HEADER
        // ----------------------------------------------

        syncHeaderMenuState();

    };

    const setProjectsMegaMenuState = (isOpen) => {
        if (!projectsItem || !projectsTrigger || !projectsMegaMenu) return;
        const shouldOpen = Boolean(isOpen);
        projectsItem.classList.toggle('is-open', shouldOpen);
        projectsTrigger.setAttribute('aria-expanded', String(shouldOpen));
        projectsMegaMenu.setAttribute('aria-hidden', String(!shouldOpen));
        projectsMegaMenu.inert = !shouldOpen;
        syncHeaderMenuState();
    };

    const closeMegaMenus = () => {
        setServicesMegaMenuState(false);
        setProjectsMegaMenuState(false);
    };


    // --------------------------------------------------
    // 7. MENÚ PRINCIPAL
    // --------------------------------------------------

    const setMenuState = (forceState) => {

        const currentState =
            navigation.classList.contains(
                'is-open'
            );


        const shouldOpen =
            typeof forceState === 'boolean'
                ? forceState
                : !currentState;


        // ----------------------------------------------
        // DESKTOP
        // ----------------------------------------------

        if (desktopMediaQuery.matches) {

            navigation.classList.remove(
                'is-open'
            );

            menuToggle.setAttribute(
                'aria-expanded',
                'false'
            );

            menuToggle.setAttribute(
                'aria-label',
                'Abrir menú de navegación'
            );

            syncAccessibilityState(false);

            document.body.style.overflow = '';

            syncHeaderMenuState();

            return;
        }


        // ----------------------------------------------
        // MOBILE — ESTADO VISUAL
        // ----------------------------------------------

        navigation.classList.toggle(
            'is-open',
            shouldOpen
        );


        // ----------------------------------------------
        // MOBILE — ARIA
        // ----------------------------------------------

        menuToggle.setAttribute(
            'aria-expanded',
            String(shouldOpen)
        );

        menuToggle.setAttribute(
            'aria-label',
            shouldOpen
                ? 'Cerrar menú de navegación'
                : 'Abrir menú de navegación'
        );


        // ----------------------------------------------
        // ACCESSIBILITY
        // ----------------------------------------------

        syncAccessibilityState(
            shouldOpen
        );


        // ----------------------------------------------
        // MEGA MENÚ
        // ----------------------------------------------

        if (!shouldOpen) {

            closeMegaMenus();

        }


        // ----------------------------------------------
        // BODY SCROLL
        // ----------------------------------------------

        document.body.style.overflow =
            shouldOpen
                ? 'hidden'
                : '';


        // ----------------------------------------------
        // HEADER
        // ----------------------------------------------

        syncHeaderMenuState();


        // ----------------------------------------------
        // FOCUS
        // ----------------------------------------------

        requestAnimationFrame(() => {

            if (shouldOpen) {

                closeButton.focus();

            } else {

                menuToggle.focus();

            }

        });

    };


    // --------------------------------------------------
    // 8. HEADER SCROLL
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
    // 9. BOTÓN HAMBURGUESA
    // --------------------------------------------------

    menuToggle.addEventListener(
        'click',
        () => {

            setMenuState();

        }
    );


    // --------------------------------------------------
    // 10. BOTÓN CERRAR
    // --------------------------------------------------

    closeButton.addEventListener(
        'click',
        () => {

            setMenuState(false);

        }
    );


    // --------------------------------------------------
    // 11. TRIGGER — SERVICIOS
    // --------------------------------------------------

    if (servicesTrigger) {

        servicesTrigger.addEventListener(
            'click',
            () => {

                setProjectsMegaMenuState(false);

                const isOpen =
                    servicesItem.classList.contains(
                        'is-open'
                    );


                setServicesMegaMenuState(
                    !isOpen
                );

            }
        );

    }

    if (projectsTrigger) {
        projectsTrigger.addEventListener('click', () => {
            const isOpen = projectsItem.classList.contains('is-open');
            setServicesMegaMenuState(false);
            setProjectsMegaMenuState(!isOpen);
        });
    }


    // --------------------------------------------------
    // 12. ENLACES PRINCIPALES
    // --------------------------------------------------

    const navigationLinks =
        navigation.querySelectorAll(
            'a.site-navigation__link'
        );


    navigationLinks.forEach((link) => {

        link.addEventListener(
            'click',
            () => {

                if (
                    !desktopMediaQuery.matches
                ) {

                    setMenuState(false);

                }

            }
        );

    });


    // --------------------------------------------------
    // 13. ENLACES DEL MEGA MENÚ
    // --------------------------------------------------

    const megaMenuLinks = navigation.querySelectorAll(
        '.site-navigation__mega-menu a'
    );


    megaMenuLinks.forEach((link) => {

        link.addEventListener(
            'click',
            () => {

                if (
                    !desktopMediaQuery.matches
                ) {

                    setMenuState(false);

                }

            }
        );

    });


    // --------------------------------------------------
    // 14. CLICK FUERA
    // --------------------------------------------------

    document.addEventListener(
        'click',
        (event) => {

            const target = event.target;


            // ------------------------------------------
            // DESKTOP — MEGA MENÚ
            // ------------------------------------------

            if (
                desktopMediaQuery.matches &&
                servicesItem?.classList.contains(
                    'is-open'
                ) &&
                !servicesItem.contains(target)
            ) {

                setServicesMegaMenuState(false);

            }

            if (
                desktopMediaQuery.matches &&
                projectsItem?.classList.contains('is-open') &&
                !projectsItem.contains(target)
            ) {
                setProjectsMegaMenuState(false);
            }


            // ------------------------------------------
            // MOBILE — MENÚ PRINCIPAL
            // ------------------------------------------

            if (
                !desktopMediaQuery.matches &&
                navigation.classList.contains(
                    'is-open'
                ) &&
                !navigation.contains(target) &&
                !menuToggle.contains(target)
            ) {

                setMenuState(false);

            }

        }
    );


    // --------------------------------------------------
    // 15. ESCAPE
    // --------------------------------------------------

    document.addEventListener(
        'keydown',
        (event) => {

            if (
                event.key !== 'Escape'
            ) {
                return;
            }


            // ------------------------------------------
            // PRIMERO — MEGA MENÚ
            // ------------------------------------------

            if (
                servicesItem?.classList.contains(
                    'is-open'
                )
            ) {

                event.preventDefault();

                setServicesMegaMenuState(
                    false
                );

                servicesTrigger?.focus();

                return;

            }

            if (projectsItem?.classList.contains('is-open')) {
                event.preventDefault();
                setProjectsMegaMenuState(false);
                projectsTrigger?.focus();
                return;
            }


            // ------------------------------------------
            // SEGUNDO — MENÚ MOBILE
            // ------------------------------------------

            if (
                navigation.classList.contains(
                    'is-open'
                ) &&
                !desktopMediaQuery.matches
            ) {

                event.preventDefault();

                setMenuState(false);

            }

        }
    );


    // --------------------------------------------------
    // 16. FOCUS TRAP — MOBILE
    // --------------------------------------------------

    navigation.addEventListener(
        'keydown',
        (event) => {

            if (
                event.key !== 'Tab' ||
                desktopMediaQuery.matches ||
                !navigation.classList.contains(
                    'is-open'
                )
            ) {
                return;
            }


            const menuFocusables =
                getFocusableElements();


            if (
                !menuFocusables.length
            ) {
                return;
            }


            const firstFocusable =
                menuFocusables[0];

            const lastFocusable =
                menuFocusables[
                    menuFocusables.length - 1
                ];


            // ------------------------------------------
            // TAB
            // Último → Primero
            // ------------------------------------------

            if (
                !event.shiftKey &&
                document.activeElement ===
                    lastFocusable
            ) {

                event.preventDefault();

                firstFocusable.focus();

                return;

            }


            // ------------------------------------------
            // SHIFT + TAB
            // Primero → Último
            // ------------------------------------------

            if (
                event.shiftKey &&
                document.activeElement ===
                    firstFocusable
            ) {

                event.preventDefault();

                lastFocusable.focus();

            }

        }
    );


    // --------------------------------------------------
    // 17. CAMBIO MOBILE ↔ DESKTOP
    // --------------------------------------------------

    const handleMediaQueryChange = () => {

        // ------------------------------------------
        // CERRAR MENÚ PRINCIPAL
        // ------------------------------------------

        navigation.classList.remove(
            'is-open'
        );


        // ------------------------------------------
        // CERRAR MEGA MENÚ
        // ------------------------------------------

        closeMegaMenus();


        // ------------------------------------------
        // HAMBURGUESA
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
        // ACCESSIBILITY
        // ------------------------------------------

        syncAccessibilityState(false);


        // ------------------------------------------
        // BODY
        // ------------------------------------------

        document.body.style.overflow = '';


        // ------------------------------------------
        // HEADER
        // ------------------------------------------

        syncHeaderMenuState();

    };


    if (typeof desktopMediaQuery.addEventListener === 'function') {
        desktopMediaQuery.addEventListener(
            'change',
            handleMediaQueryChange
        );
    } else {
        desktopMediaQuery.addListener(
            handleMediaQueryChange
        );
    }


    // --------------------------------------------------
    // 18. ESTADO INICIAL
    // --------------------------------------------------

    navigation.classList.remove(
        'is-open'
    );


    menuToggle.setAttribute(
        'aria-expanded',
        'false'
    );


    menuToggle.setAttribute(
        'aria-label',
        'Abrir menú de navegación'
    );


    closeMegaMenus();


    syncAccessibilityState(false);

    syncHeaderMenuState();

    handleScroll();


    // --------------------------------------------------
    // 19. SCROLL
    // --------------------------------------------------

    window.addEventListener(
        'scroll',
        handleScroll,
        {
            passive: true
        }
    );

});