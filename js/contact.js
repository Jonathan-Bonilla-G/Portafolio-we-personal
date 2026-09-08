/* =========================================================
   CONTACT FORM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form");

    if (!form) {
        return;
    }

    const nameInput = document.querySelector("#contact-name");
    const emailInput = document.querySelector("#contact-email");
    const projectTypeInput = document.querySelector("#contact-project-type");
    const messageInput = document.querySelector("#contact-message");

    const nameError = document.querySelector("#contact-name-error");
    const emailError = document.querySelector("#contact-email-error");
    const messageError = document.querySelector("#contact-message-error");

    const statusMessage = form.querySelector(".contact-form__status");
    const submitButton = form.querySelector(".contact-form__submit");

    /*
     * ---------------------------------------------------------
     * VALIDATION
     * ---------------------------------------------------------
     */

    function validateName() {
        const value = nameInput.value.trim();

        if (!value) {
            showError(
                nameInput,
                nameError,
                "Introduce tu nombre."
            );

            return false;
        }

        if (value.length < 2) {
            showError(
                nameInput,
                nameError,
                "Introduce un nombre válido."
            );

            return false;
        }

        clearError(nameInput, nameError);

        return true;
    }


    function validateEmail() {
        const value = emailInput.value.trim();

        if (!value) {
            showError(
                emailInput,
                emailError,
                "Introduce tu correo electrónico."
            );

            return false;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
            showError(
                emailInput,
                emailError,
                "Introduce un correo electrónico válido."
            );

            return false;
        }

        clearError(emailInput, emailError);

        return true;
    }


    function validateMessage() {
        const value = messageInput.value.trim();

        if (!value) {
            showError(
                messageInput,
                messageError,
                "Cuéntame brevemente sobre tu proyecto."
            );

            return false;
        }

        if (value.length < 20) {
            showError(
                messageInput,
                messageError,
                "Escribe al menos 20 caracteres para conocer mejor tu proyecto."
            );

            return false;
        }

        clearError(messageInput, messageError);

        return true;
    }


    /*
     * ---------------------------------------------------------
     * ERROR STATE
     * ---------------------------------------------------------
     */

    function showError(input, errorElement, message) {
        const field = input.closest(".contact-form__field");

        if (!field) {
            return;
        }

        field.classList.add("is-error");

        input.setAttribute("aria-invalid", "true");

        errorElement.textContent = message;
        errorElement.hidden = false;
    }


    function clearError(input, errorElement) {
        const field = input.closest(".contact-form__field");

        if (!field) {
            return;
        }

        field.classList.remove("is-error");

        input.setAttribute("aria-invalid", "false");

        errorElement.textContent = "";
        errorElement.hidden = true;
    }


    /*
     * ---------------------------------------------------------
     * STATUS MESSAGE
     * ---------------------------------------------------------
     */

    function showStatus(message, type = "") {
        if (!statusMessage) {
            return;
        }

        statusMessage.textContent = message;

        statusMessage.classList.remove(
            "is-success"
        );

        if (type) {
            statusMessage.classList.add(type);
        }

        statusMessage.hidden = false;
    }


    function clearStatus() {
        if (!statusMessage) {
            return;
        }

        statusMessage.textContent = "";

        statusMessage.classList.remove(
            "is-success"
        );

        statusMessage.hidden = true;
    }


    /*
     * ---------------------------------------------------------
     * LOADING STATE
     * ---------------------------------------------------------
     */

    function setLoadingState(isLoading) {
        if (isLoading) {
            form.classList.add("is-loading");

            submitButton.disabled = true;

            submitButton.setAttribute(
                "aria-busy",
                "true"
            );

            submitButton.dataset.originalText =
                submitButton.textContent;

            submitButton.textContent =
                "Enviando...";
        } else {
            form.classList.remove("is-loading");

            submitButton.disabled = false;

            submitButton.setAttribute(
                "aria-busy",
                "false"
            );

            submitButton.textContent =
                submitButton.dataset.originalText ||
                "Enviar solicitud";
        }
    }


    /*
     * ---------------------------------------------------------
     * FORM SUBMIT
     * ---------------------------------------------------------
     */

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        clearStatus();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        if (
            !isNameValid ||
            !isEmailValid ||
            !isMessageValid
        ) {
            return;
        }

        setLoadingState(true);

        /*
         * -----------------------------------------------------
         * FRONTEND DEMO
         *
         * Actualmente no existe backend.
         * Este timeout solamente permite visualizar
         * correctamente el estado Loading → Success.
         *
         * Posteriormente será sustituido por la petición real.
         * -----------------------------------------------------
         */

        window.setTimeout(() => {
            setLoadingState(false);

            showStatus(
                "Gracias. Recibí tu solicitud y me pondré en contacto contigo pronto.",
                "is-success"
            );

            form.reset();

            nameInput.setAttribute(
                "aria-invalid",
                "false"
            );

            emailInput.setAttribute(
                "aria-invalid",
                "false"
            );

            messageInput.setAttribute(
                "aria-invalid",
                "false"
            );
        }, 1200);
    });


    /*
     * ---------------------------------------------------------
     * REAL-TIME ERROR CLEANUP
     * ---------------------------------------------------------
     */

    nameInput.addEventListener("input", () => {
        if (
            nameInput.closest(".contact-form__field")
                ?.classList.contains("is-error")
        ) {
            validateName();
        }
    });


    emailInput.addEventListener("input", () => {
        if (
            emailInput.closest(".contact-form__field")
                ?.classList.contains("is-error")
        ) {
            validateEmail();
        }
    });


    messageInput.addEventListener("input", () => {
        if (
            messageInput.closest(".contact-form__field")
                ?.classList.contains("is-error")
        ) {
            validateMessage();
        }
    });


    /*
     * ---------------------------------------------------------
     * CLEAR SUCCESS MESSAGE WHEN USER STARTS AGAIN
     * ---------------------------------------------------------
     */

    form.addEventListener("input", () => {
        if (
            statusMessage &&
            !statusMessage.hidden
        ) {
            clearStatus();
        }
    });


    /*
     * ---------------------------------------------------------
     * INITIAL ACCESSIBILITY STATE
     * ---------------------------------------------------------
     */

    nameInput.setAttribute(
        "aria-invalid",
        "false"
    );

    emailInput.setAttribute(
        "aria-invalid",
        "false"
    );

    messageInput.setAttribute(
        "aria-invalid",
        "false"
    );

    submitButton.setAttribute(
        "aria-busy",
        "false"
    );
});