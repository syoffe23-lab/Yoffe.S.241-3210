
// Получаем элементы страницы
const dialog = document.querySelector('#registration-dialog');
const openButton = document.querySelector('#open-dialog');
const heroButton = document.querySelector('#hero-register');
const closeButton = document.querySelector('#close-dialog');

const form = document.querySelector('#registration-form');
const passwordInput = document.querySelector('#password');
const togglePasswordButton = document.querySelector('#toggle-password');

// Поля формы
const fields = [
    {
        input: document.querySelector('#name'),
        error: document.querySelector('#name-error')
    },
    {
        input: document.querySelector('#email'),
        error: document.querySelector('#email-error')
    },
    {
        input: passwordInput,
        error: document.querySelector('#password-error')
    }
];

// Открытие модального окна
function openDialog() {
    dialog.showModal();
}

openButton.addEventListener('click', openDialog);
heroButton.addEventListener('click', openDialog);

// Закрытие модального окна
closeButton.addEventListener('click', () => {
    dialog.close();
});

// Закрытие при нажатии вне содержимого окна
dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
        dialog.close();
    }
});

// Получение сообщения об ошибке
function getErrorMessage(input) {
    const validity = input.validity;

    if (validity.valueMissing) {
        return 'Это поле обязательно для заполнения.';
    }

    if (validity.typeMismatch) {
        return 'Введите корректный адрес электронной почты.';
    }

    if (validity.tooShort) {
        return `Минимальная длина — ${input.minLength} символов.`;
    }

    if (validity.tooLong) {
        return `Максимальная длина — ${input.maxLength} символов.`;
    }

    if (validity.rangeUnderflow) {
        return `Минимальное значение — ${input.min}.`;
    }

    if (validity.rangeOverflow) {
        return `Максимальное значение — ${input.max}.`;
    }

    if (validity.patternMismatch) {
        return 'Значение не соответствует установленному формату.';
    }

    return 'Проверьте правильность введённых данных.';
}

// Проверка отдельного поля
function validateField(input, errorElement) {
    if (input.validity.valid) {
        input.removeAttribute('aria-invalid');
        errorElement.textContent = '';
        errorElement.hidden = true;

        return true;
    }

    input.setAttribute('aria-invalid', 'true');
    errorElement.textContent = getErrorMessage(input);
    errorElement.hidden = false;

    return false;
}

// Проверка полей после потери фокуса
fields.forEach(({ input, error }) => {
    input.addEventListener('blur', () => {
        validateField(input, error);
    });

    // Повторная проверка после исправления ошибки
    input.addEventListener('input', () => {
        if (input.hasAttribute('aria-invalid')) {
            validateField(input, error);
        }
    });
});

// Обработка отправки формы
form.addEventListener('submit', (event) => {
    // Отменяем стандартную отправку формы
    event.preventDefault();

    let firstInvalidField = null;

    // Проверяем все поля
    fields.forEach(({ input, error }) => {
        const isValid = validateField(input, error);

        if (!isValid && !firstInvalidField) {
            firstInvalidField = input;
        }
    });

    // Если есть ошибка, переводим фокус на первое неверное поле
    if (firstInvalidField) {
        firstInvalidField.focus();
        return;
    }

    // Собираем данные формы
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log('Данные формы:', data);

    // Закрываем окно после успешной проверки
    dialog.close();
    form.reset();

    // Сбрасываем сообщения об ошибках
    fields.forEach(({ input, error }) => {
        input.removeAttribute('aria-invalid');
        error.textContent = '';
        error.hidden = true;
    });
});

// Временный показ пароля
function hidePassword() {
    passwordInput.type = 'password';
    togglePasswordButton.textContent = 'Показать';
    togglePasswordButton.setAttribute('aria-label', 'Показать пароль');
}

togglePasswordButton.addEventListener('pointerdown', (event) => {
    event.preventDefault();

    passwordInput.type = 'text';
    togglePasswordButton.textContent = 'Скрыть';
    togglePasswordButton.setAttribute('aria-label', 'Скрыть пароль');
});

togglePasswordButton.addEventListener('pointerup', hidePassword);
togglePasswordButton.addEventListener('pointerleave', hidePassword);
togglePasswordButton.addEventListener('pointercancel', hidePassword);
togglePasswordButton.addEventListener('lostpointercapture', hidePassword);
