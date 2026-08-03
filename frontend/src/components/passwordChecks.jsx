const passwordChecks = (password) => ({
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+]/.test(password),
});

export default passwordChecks;