// Configuration
const MAX_PROMPT_LENGTH = 4000;

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Smooth scroll to section
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.remove('active');
    }
}

// Get form values
function getFormValues() {
    return {
        role: document.getElementById('role').value,
        context: document.getElementById('context').value,
        task: document.getElementById('task').value,
        tone: document.getElementById('tone').value,
        format: document.getElementById('format').value,
        length: document.getElementById('length').value,
        examples: document.getElementById('examples').value,
        constraints: document.getElementById('constraints').value,
        reasoning: document.getElementById('reasoning').checked,
        iteration: document.getElementById('iteration').checked
    };
}

// Build prompt sections
function buildPromptSections(formData) {
    let prompt = '';

    // Role and Context section
    if (formData.role || formData.context) {
        if (formData.role) {
            prompt += `## RÔLE\nTu es ${formData.role}.\n\n`;
        }
        if (formData.context) {
            prompt += `## CONTEXTE\n${formData.context}\n\n`;
        }
    }

    // Objective section
    if (formData.task) {
        prompt += `## OBJECTIF\n${formData.task}\n\n`;
    }

    // Constraints section
    const constraintsList = buildConstraintsList(formData);
    if (constraintsList.length > 0) {
        prompt += `## CONTRAINTES\n${constraintsList.map(c => `- ${c}`).join('\n')}\n\n`;
    }

    // Examples section
    if (formData.examples) {
        prompt += `## EXEMPLES\n${formData.examples}\n\n`;
    }

    // Instructions section
    const instructions = buildInstructionsList(formData);
    if (instructions.length > 0) {
        prompt += `## INSTRUCTIONS\n${instructions.map(i => `- ${i}`).join('\n')}\n`;
    }

    return prompt.trim();
}

// Build constraints list
function buildConstraintsList(formData) {
    const constraints = [];

    if (formData.tone && formData.tone !== 'professionnel') {
        constraints.push(`Ton: ${formData.tone}`);
    }

    if (formData.length) {
        constraints.push(`Longueur: ${formData.length}`);
    }

    if (formData.format && formData.format !== 'paragraphe') {
        constraints.push(`Format: ${formData.format}`);
    }

    if (formData.constraints) {
        constraints.push(formData.constraints);
    }

    return constraints;
}

// Build instructions list
function buildInstructionsList(formData) {
    const instructions = [];

    if (formData.reasoning) {
        instructions.push('Explique ton raisonnement étape par étape avant de donner la réponse finale');
    }

    if (formData.iteration) {
        instructions.push('Propose 2-3 variations ou approches différentes');
    }

    return instructions;
}

// Update character count display
function updateCharCount(count) {
    const charCountEl = document.getElementById('charCount');
    const warningEl = document.getElementById('warningMessage');
    
    charCountEl.textContent = `${count} / ${MAX_PROMPT_LENGTH}`;
    
    if (count > MAX_PROMPT_LENGTH) {
        charCountEl.classList.add('warning');
        warningEl.style.display = 'block';
    } else {
        charCountEl.classList.remove('warning');
        warningEl.style.display = 'none';
    }
}

// Generate prompt
function generatePrompt() {
    const formData = getFormValues();
    const prompt = buildPromptSections(formData);
    
    // Display the generated prompt
    const promptTextarea = document.getElementById('generatedPrompt');
    promptTextarea.value = prompt;
    
    // Update character count
    updateCharCount(prompt.length);
    
    // Show copy button if prompt is not empty
    const copyBtn = document.getElementById('copyBtn');
    if (prompt) {
        copyBtn.style.display = 'flex';
    } else {
        copyBtn.style.display = 'none';
    }
}

// Copy to clipboard
function copyToClipboard() {
    const promptText = document.getElementById('generatedPrompt').value;
    const copyText = document.getElementById('copyText');
    
    navigator.clipboard.writeText(promptText)
        .then(() => {
            // Show success message
            copyText.textContent = 'Copié!';
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyText.textContent = 'Copier';
            }, 2000);
        })
        .catch(err => {
            console.error('Erreur lors de la copie:', err);
            alert('Erreur lors de la copie dans le presse-papiers');
        });
}

// Reset form
function resetForm() {
    // Clear all input fields
    document.getElementById('role').value = '';
    document.getElementById('context').value = '';
    document.getElementById('task').value = '';
    document.getElementById('tone').value = 'professionnel';
    document.getElementById('format').value = 'paragraphe';
    document.getElementById('length').value = '';
    document.getElementById('examples').value = '';
    document.getElementById('constraints').value = '';
    document.getElementById('reasoning').checked = false;
    document.getElementById('iteration').checked = false;
    
    // Clear output
    document.getElementById('generatedPrompt').value = '';
    
    // Reset character count
    updateCharCount(0);
    
    // Hide copy button
    document.getElementById('copyBtn').style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('PromptMaster initialisé avec succès!');
});