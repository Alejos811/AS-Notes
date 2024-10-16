document.addEventListener('DOMContentLoaded', function () {
    const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
    const cancellationRadios = document.querySelectorAll('input[name="cancellation"]');
    const offlineCaseCheckbox = document.getElementById('offlineCaseCheckbox');
    const cancellationCheckboxes = document.getElementById('cancellationCheckboxes');
    const cancellationTextboxes = document.getElementById('cancellationTextboxes');
    const movingWithCompetitor = document.getElementById('movingWithCompetitor');
    const competitorsNameGroup = document.getElementById('competitorsNameGroup');
    const createTemplate = document.getElementById('createTemplate');
    const resetForm = document.getElementById('resetForm');
    const checkAllCheckbox = document.getElementById('checkAll');
    const usFormatButton = document.getElementById('usFormat');

    function toggleElements() {
        const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
        const cancellation = document.querySelector('input[name="cancellation"]:checked').value;
        const movingWithCompetitorValue = movingWithCompetitor.value;

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

        if (movingWithCompetitorValue === 'no') {
            competitorsNameGroup.style.display = 'none';
        } else {
            competitorsNameGroup.style.display = 'block';
        }
    }

    serviceTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleElements);
    });

    cancellationRadios.forEach(radio => {
        radio.addEventListener('change', toggleElements);
    });

    movingWithCompetitor.addEventListener('change', toggleElements);

    createTemplate.addEventListener('click', function () {
        let template = '';
        const formGroups = document.querySelectorAll('.form-group');
        let cdCheckListAdded = false;
        let requestFromMAHAdded = false;

        // Include Service Type and Cancellation radio button values
        const serviceType = document.querySelector('input[name="serviceType"]:checked').nextElementSibling.textContent;
        const cancellation = document.querySelector('input[name="cancellation"]:checked').nextElementSibling.textContent;
        template += `Service Type: ${serviceType}\n`;
        template += `Cancellation: ${cancellation}\n\n`;

        formGroups.forEach(group => {
            const label = group.querySelector('label');
            const inputs = group.querySelectorAll('input, textarea, select');

            inputs.forEach(input => {
                if (input && input.offsetParent !== null && !input.classList.contains('exclude-from-template')) { // Check if the input is visible and not excluded
                    if (input.type === 'checkbox') {
                        if (label.textContent === 'CD Check List' && !cdCheckListAdded) {
                            template += `${label.textContent}:\n\n`;
                            cdCheckListAdded = true;
                        }
                        if (input.id === 'requestFromMAH' && requestFromMAHAdded) {
                            return; // Skip if "Request coming from MAH" has already been added
                        }
                        template += `${input.nextElementSibling.textContent}: ${input.checked ? '✓' : 'x'}\n`;
                        if (input.id === 'requestFromMAH') {
                            requestFromMAHAdded = true;
                        }
                    } else if (input.tagName.toLowerCase() === 'select') {
                        template += `${label.textContent}: ${input.options[input.selectedIndex].text}\n`;
                    } else if (input.tagName.toLowerCase() === 'textarea') {
                        template += `${label.textContent}:\n${input.value}\n\n`;
                    } else {
                        template += `${label.textContent}: ${input.value}\n`;
                    }
                }
            });
        });

        // Add vertical spaces after specific fields
        template = template.replace(/(Phone Number: .+\n)/, '$1\n');
        template = template.replace(/(Issue or Request:\n.+\n\n)/, '$1\n');
        template = template.replace(/(Steps Taken:\n.+\n\n)/, '$1\n');
        template = template.replace(/(Outcome: .+\n)\n/, '\n$1\n\n');
        template = template.replace(/(CD Check List:\n\n.+\n)/, '\n$1\n\n');

        // Remove extra vertical spaces after the first checkbox
        template = template.replace(/(Request coming from MAH: .+\n)\n/, '$1');
        template = template.replace(/(Verified Pin: .+\n)\n/, '$1');

        // Correct the label for the "Competitor's Name" field
        template = template.replace(/(Moving with Competitor \(Y\/N\): .+\n)Moving with Competitor \(Y\/N\):/, '$1Competitor\'s Name:');

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

        // Set the service type radio button to "Live Call"
        document.getElementById('liveCall').checked = true;

        // Set the cancellation radio button to "No"
        document.getElementById('cancellationNo').checked = true;

        // Reapply visibility settings
        toggleElements();
            
        }
    });

    // Auto-resize textareas
    document.querySelectorAll('.auto-resize').forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    // US format button functionality
    usFormatButton.addEventListener('click', function () {
        const phoneNumberInput = document.getElementById('phoneNumber');
        let phoneNumber = phoneNumberInput.value;

        // Split the input by spaces, commas, dots, or dashes
        let phoneNumbers = phoneNumber.split(/[\s,.-]+/);

        // Filter out any non-10-digit numbers
        phoneNumbers = phoneNumbers.filter(num => num.length === 10);

        // Format each 10-digit number to US format (e.g., (123) 456-7890)
        phoneNumbers = phoneNumbers.map(num => {
            num = num.replace(/\D/g, ''); // Remove non-numeric characters
            if (num.length === 10) {
                return `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`;
            }
            return num;
        });

        // Join the formatted numbers with " / "
        phoneNumberInput.value = phoneNumbers.join(' / ');
    });

     // Check all functionality
    checkAllCheckbox.addEventListener('change', function () {
        const checkboxes = document.querySelectorAll('#requestFromMAH, #verifiedPin, #verifiedCC, #verifiedBillingAddress, #survey, #highlightFeatures, #rebuttals, #comebackStatement');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checkAllCheckbox.checked;
        });
    });

    toggleElements(); // Initial call to set the correct visibility
});
