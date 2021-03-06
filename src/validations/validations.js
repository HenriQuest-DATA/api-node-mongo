let errors = [];

function validationContract(){
    errors = [];
}

validationContract.prototype.isRequired = (value, message) => {
    if(!value || value.length <= 0)
        errors.push({ message: message });
}

validationContract.prototype.hasMinLen = (value, min, message) => {
    if(!value || value.length < min)
        errors.push({ message: message });
}

validationContract.prototype.hasMaxLen = (value, max, message) => {
    if(!value || value.length > max)
        errors.push({ message: message });
}

validationContract.prototype.isFixedLen = (value, len, message) => {
    if(!value || value.length != len)
        errors.push({ message: message });
}

validationContract.prototype.isMail = (value, message) => {
    var reg = new RegExp(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i);
    if(!reg.test(value))
        errors.push({ message: message });
}

validationContract.prototype.isSenha = (value, message) => {
    var reg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#/-])[0-9a-zA-Z$*&@#/-]{8,}$/i);
    if(!reg.test(value))
        errors.push({ message: message });
}

validationContract.prototype.errors = () => {
    return errors;
}

validationContract.prototype.clear = () => {
    errors = [];
}

validationContract.prototype.isValid = () => {
    return errors.length == 0;
}

module.exports = validationContract;