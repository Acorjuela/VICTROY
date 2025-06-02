// Validar campos y activar botón
function checkFormCompletion() {
    const requiredFields = document.querySelectorAll("input[required], select[required], textarea[required]");
    const fileInput = document.getElementById("adjuntar");

    // Verificar que todos los campos requeridos estén llenos
    const allFilled = [...requiredFields].every(field => {
        if (field.type === "checkbox" || field.type === "radio") {
            // Para checkbox/radio, verificar que al menos uno esté seleccionado del grupo
            const group = document.querySelectorAll(`input[name="${field.name}"]:checked`);
            return group.length > 0;
        }
        return field.value.trim() !== "";
    }) && fileInput.files.length > 0;

    document.getElementById("submitButton").disabled = !allFilled;
}

// Vista previa de la imagen
function previewImage() {
    const fileInput = document.getElementById("adjuntar");
    const preview = document.getElementById("imagePreview");

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
            document.getElementById("fileContent").value = e.target.result;
            document.getElementById("filename").value = fileInput.files[0].name;
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        preview.style.display = "none";
        document.getElementById("fileContent").value = "";
        document.getElementById("filename").value = "";
    }

    checkFormCompletion();
}

// Estilo visual de checkbox
function toggleAmenity(checkbox) {
    const label = checkbox.closest('.option');
    if (checkbox.checked) {
        label.classList.add("selected");
    } else {
        label.classList.remove("selected");
    }
    checkFormCompletion();
}

// Cerrar modal
function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

// Enviar formulario
async function UploadFile() {
    const form = document.getElementById("uploadForm");

    // Obtener datos del formulario para mostrar en confirmación
    const nombre = document.getElementById("nombre").value.trim();
    const marco= document.getElementById("Marco").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const pais = document.getElementById("pais").value.trim();
    const responsable = document.getElementById("personal_responsable").value;
    const pagarUSD = document.querySelector('input[name="pagarUSD"]:checked')?.value || '';
    const binance = document.getElementById("binance_de_Pay").value.trim();

    const now = new Date();
    const fecha = now.toLocaleDateString("es-CO");
    const hora = now.toLocaleTimeString("es-CO");

    const confirmacion = await Swal.fire({
        icon: 'question',
        title: '¿Confirmar envío?',
        html: `
            <p><b>Names:</b> ${nombre}</p>
            <p><b>Marco:</b> ${Marco}</p>
            <p><b>Usuario:</b> ${usuario}</p>
            <p><b>País:</b> ${pais}</p>
            <p><b>Responsável:</b> ${responsable}</p>
            <p><b>Pagar:</b> ${pagarUSD}</p>
            <p><b>Binance de Pay:</b> ${binance}</p>
            <p><b>Fecha:</b> ${fecha}</p>
            <p><b>Hora:</b> ${hora}</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) return;

    const datosForm = new FormData(form);
    datosForm.append('fecha', fecha);
    datosForm.append('hora', hora);

    function showLoader() {
        document.querySelector(".loader").style.display = "flex";
    }

    function hideLoader() {
        document.querySelector(".loader").style.display = "none";
    }

    showLoader(); // ✅ MOSTRAR LOADER ANTES DE ENVIAR

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: datosForm,
        });

        if (response.ok) {
            confetti();
            document.getElementById("myModal").style.display = "block";
            modalMessage.innerHTML = `
                <div style="text-align:center; font-family: Arial, sans-serif; color:rgb(3, 3, 3);">
                    <h2>Formulario enviado con éxito</h2>
                    <div style="text-align:center; margin: 0 auto; max-width: 350px;">
                        <p><strong>Names:</strong> ${nombre}</p>
                        <p><strong>Marco:</strong> ${Marco}</p>
                        <p><strong>Usuario:</strong> ${usuario}</p>
                        <p><strong>País:</strong> ${pais}</p>
                        <p><strong>Responsable:</strong> ${responsable}</p>
                        <p><strong>Método de pago:</strong> ${pagarUSD}</p>
                        <p><strong>Binance de Pay:</strong> ${binance || 'No proporcionado'}</p>
                        <p><strong>Fecha:</strong> ${fecha}</p>
                        <p><strong>Hora:</strong> ${hora}</p>
                    </div>
                </div>
            `;
            form.reset();
            document.getElementById("imagePreview").style.display = "none";
            document.getElementById("submitButton").disabled = true;
            document.querySelectorAll('.option.selected').forEach(option => {
                option.classList.remove('selected');
            });

        } else {
            throw new Error("Error en la respuesta del servidor");
        }
    } catch (error) {
        Swal.fire("Error", "No se pudo enviar el formulario. Intenta de nuevo.", "error");
        console.error(error);
    } finally {
        hideLoader(); // ✅ OCULTAR LOADER SIEMPRE (éxito o error)
    }
}
