// Validaciones de formulario para ingreso de equipo
(function(){
    // Helper toggles
    function setValid(el){
        el.classList.remove('campo-error');
        el.classList.add('campo-ok');
        el.setAttribute('aria-invalid', 'false');
    }
    function setInvalid(el){
        el.classList.remove('campo-ok');
        el.classList.add('campo-error');
        el.setAttribute('aria-invalid', 'true');
    }

    function qs(id){ return document.getElementById(id); }

    const nombre = qs('nombre');
    const dni = qs('dni');
    const email = qs('email');
    const confirmEmail = qs('confirmEmail');
    const telefono = qs('telefono');
    const tipoClienteRadios = document.querySelectorAll('input[name="tipoCliente"]');
    const empresa = qs('empresa');
    const cuit = qs('cuit');
    const provincia = qs('provincia');
    const localidad = qs('localidad');
    const clientForm = qs('clientForm');

    // Regexes
    const nombreRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{5,80}$/;
    const dniRE = /^\d{7,8}$/;
    const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoAllowedRE = /^[0-9+\-\s]+$/;
    const cuitRE = /^(\d{2}-\d{8}-\d{1}|\d{11})$/;

    function validateNombre(){
        const v = nombre.value.trim();
        if (v.length < 5 || v.length > 80 || !nombreRE.test(v)){
            setInvalid(nombre);
            return false;
        }
        setValid(nombre);
        return true;
    }

    function validateDNI(){
        const v = dni.value.trim();
        if (!dniRE.test(v)){
            setInvalid(dni);
            return false;
        }
        setValid(dni);
        return true;
    }

    function validateEmail(){
        const v = email.value.trim();
        if (!emailRE.test(v)){
            setInvalid(email);
            return false;
        }
        setValid(email);
        return true;
    }

    function validateConfirmEmail(){
        const v = confirmEmail.value.trim();
        if (v !== email.value.trim() || !emailRE.test(v)){
            setInvalid(confirmEmail);
            return false;
        }
        setValid(confirmEmail);
        return true;
    }

    function validateTelefono(){
        const v = telefono.value.trim();
        if (!telefonoAllowedRE.test(v)){
            setInvalid(telefono);
            return false;
        }
        const digits = v.replace(/[^0-9]/g, '');
        if (digits.length < 8){
            setInvalid(telefono);
            return false;
        }
        setValid(telefono);
        return true;
    }

    function validateTipoCliente(){
        const checked = document.querySelector('input[name="tipoCliente"]:checked');
        if (!checked) return false;
        if (checked.value === 'empresa'){
            // empresa and cuit must not be empty
            let ok = true;
            if (!empresa.value.trim() || empresa.value.trim().length < 2){
                setInvalid(empresa);
                ok = false;
            } else setValid(empresa);
            if (!cuit.value.trim() || !cuitRE.test(cuit.value.trim())){
                setInvalid(cuit);
                ok = false;
            } else setValid(cuit);
            return ok;
        }
        // particular: ensure any company fields show as valid (or clear)
        if (empresa) empresa.classList.remove('campo-error','campo-ok');
        if (cuit) cuit.classList.remove('campo-error','campo-ok');
        return true;
    }

    function validateProvinciaLocalidad(){
        let ok = true;
        if (!provincia.value || provincia.value === ''){
            setInvalid(provincia);
            ok = false;
        } else {
            setValid(provincia);
        }
        const loc = localidad.value.trim();
        if (loc.length < 2){
            setInvalid(localidad);
            ok = false;
        } else {
            setValid(localidad);
        }
        return ok;
    }

    // Attach events
    if (nombre) nombre.addEventListener('blur', validateNombre);
    if (dni) dni.addEventListener('blur', validateDNI);
    if (email) email.addEventListener('blur', validateEmail);
    if (confirmEmail) confirmEmail.addEventListener('blur', validateConfirmEmail);
    if (telefono) telefono.addEventListener('blur', validateTelefono);
    if (empresa) empresa.addEventListener('blur', validateTipoCliente);
    if (cuit) cuit.addEventListener('blur', validateTipoCliente);
    if (provincia) provincia.addEventListener('change', validateProvinciaLocalidad);
    if (localidad) localidad.addEventListener('blur', validateProvinciaLocalidad);

    tipoClienteRadios.forEach(r => r.addEventListener('change', validateTipoCliente));

    function validateAll(){
        const results = [];
        results.push(validateNombre());
        results.push(validateDNI());
        results.push(validateEmail());
        results.push(validateConfirmEmail());
        results.push(validateTelefono());
        results.push(validateTipoCliente());
        results.push(validateProvinciaLocalidad());
        return results.every(Boolean);
    }

    if (clientForm){
        clientForm.addEventListener('submit', function(e){
            const ok = validateAll();
            if (!ok){
                e.preventDefault();
                // scroll to first invalid
                const first = clientForm.querySelector('.campo-error');
                if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

})();
