document.addEventListener('DOMContentLoaded', function () {
    const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
    const cancellationRadios = document.querySelectorAll('input[name="cancellation"]');
    const offlineCaseCheckbox = document.getElementById('offlineCaseCheckbox');
    const cancellationCheckboxes = document.getElementById('cancellationCheckboxes');
    const cancellationTextboxes = document.getElementById('cancellationTextboxes');
    const createTemplate = document.getElementById('createTemplate');
    const resetForm = document.getElementById('resetForm');

    function toggleElements() {
        const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
        const cancellation = document.querySelector('input[name="cancellation"]:checked').value;

        if (serviceType === 'offlineCase') {
            offlineCaseCheckbox.style.display = 'block';
        } else {
            offlineCaseCheckbox.style.display = 'none';
        }

        if (cancellation === 'yes') {
            cancellationCheckboxes.style.display = 'block';
            cancellationTextboxes.style.display = 'block';
        } else {
            cancellationCheckboxes.style.display = 'none';
            cancellationTextboxes.style.display = 'none';
        }
    }

    serviceTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleElements);
    });

    cancellationRadios.forEach(radio => {
        radio.addEventListener('change', toggleElements);
    });

    createTemplate.addEventListener('click', function () {
        let template = '';
        const formGroups = document.querySelectorAll('.form-group');

        formGroups.forEach(group => {
            const label = group.querySelector('label');
            const inputs = group.querySelectorAll('input, textarea, select');

            inputs.forEach(input => {
                if (input && input.offsetParent !== null) { // Check if the input is visible
                    if (input.type === 'checkbox') {
                        template += `${label.textContent}: ${input.checked ? '✓' : 'x'}\n`;
                    } else if (input.tagName.toLowerCase() === 'select') {
                        template += `${label.textContent}: ${input.options[input.selectedIndex].text}\n`;
                    } else {
                        template += `${label.textContent}: ${input.value}\n`;
                    }
                }
            });
        });

        // Add vertical spaces after specific fields
        template = template.replace(/(Phone Number: .+\n)/, '$1\n');
        template = template.replace(/(Issue or Request: .+\n)/, '$1\n');
        template = template.replace(/(Steps Taken: .+\n)/, '$1\n');

        navigator.clipboard.writeText(template).then(() => {
            alert('Template copied to clipboard!');
        });
    });

    resetForm.addEventListener('click', function () {
        if (confirm('Are you sure you want to reset the form?')) {
            document.querySelectorAll('.form-control').forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
        }
    });

    // Auto-resize textareas
    document.querySelectorAll('.auto-resize').forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    toggleElements(); // Initial call to set the correct visibility
});
