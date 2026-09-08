/* ========================================
   PROJECTS FILTER
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const filterButtons = document.querySelectorAll(
        ".projects-filter__button"
    );

    const projectCards = document.querySelectorAll(
        ".project-card"
    );


    /* ====================================
       VALIDACIÓN
       ==================================== */

    if (!filterButtons.length || !projectCards.length) {
        return;
    }


    /* ====================================
       FILTRAR PROYECTOS
       ==================================== */

    const filterProjects = (selectedFilter) => {

        projectCards.forEach((projectCard) => {

            const projectCategory =
                projectCard.dataset.category;

            const shouldShow =
                selectedFilter === "all" ||
                projectCategory === selectedFilter;


            projectCard.hidden = !shouldShow;

        });

    };


    /* ====================================
       ACTUALIZAR ESTADO DE BOTONES
       ==================================== */

    const updateActiveButton = (activeButton) => {

        filterButtons.forEach((button) => {

            const isActive =
                button === activeButton;

            button.classList.toggle(
                "is-active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

    };


    /* ====================================
       EVENTOS
       ==================================== */

    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const selectedFilter =
                button.dataset.filter;

            updateActiveButton(button);

            filterProjects(selectedFilter);

        });

    });


    /* ====================================
       ESTADO INICIAL
       ==================================== */

    const initialButton =
        document.querySelector(
            ".projects-filter__button.is-active"
        );

    if (initialButton) {

        filterProjects(
            initialButton.dataset.filter
        );

    }

});