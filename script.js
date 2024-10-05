document.addEventListener('DOMContentLoaded', function () {
    const serviceType = document.getElementById('serviceType');
    const cancellation = document.getElementById('cancellation');
    const offlineCaseCheckbox = document.getElementById('offlineCaseCheckbox');
    const cancellationCheckboxes = document.getElementById('cancellationCheckboxes');
    const cancellationTextboxes = document.getElementById('cancellationTextboxes');
    const createTemplate = document.getElementById('createTemplate');
    const resetForm = document.getElementById('resetForm');

    function toggleElements() {
        if (serviceType.value === 'offlineCase') {
            offlineCaseCheckbox.style.display = 'block';
        } else {
            offlineCaseCheckbox.style.display = 'none';
        }

        if (cancellation.value === 'yes') {
            cancellationCheckboxes.style.display = 'block';
            cancellationTextboxes.style.display = 'block';
        } else {
            cancellationCheckboxes.style.display = 'none';
            cancellationTextboxes.style.display = 'none';
        }
    }

    serviceType.addEventListener('change', toggleElements);
    cancellation.addEventListener('change', toggleElements);

    createTemplate.addEventListener('click', function () {
        let template = '';
        document.querySelectorAll('.form-group label').forEach(label => {
            const input = label.nextElementSibling;
            if (input && (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA')) {
                template += `${label.textContent}: ${input.value}\n`;
            }
        });
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

    toggleElements(); // Initial call to set the correct visibility
});
