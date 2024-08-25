document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    const childrenCountInput = document.getElementById('children-count');
    const childrenDetailsContainer = document.getElementById('children-details');
    const successModal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close');
    const rsvpForm = document.getElementById('rsvp-form');
    const submitButton = rsvpForm.querySelector('button[type="submit"]');
    const hasChildrenSelect = document.getElementById('has-children');
    const childrenSection = document.getElementById('children-section');

    // Inicialmente, o botão de submit está desabilitado
    submitButton.disabled = true;

    // Configuração da máscara de telefone/celular
    if (window.Inputmask) {
        Inputmask({"mask": ["(99) 9999-9999", "(99) 99999-9999"]}).mask(phoneInput);
    } else {
        console.error('Inputmask library not loaded.');
    }

    // Função para verificar se os campos obrigatórios estão preenchidos
    const checkFormValidity = () => {
        const nameInput = document.getElementById('name').value.trim();
        const phoneInput = document.getElementById('phone').value.trim();
        const attendanceInput = document.getElementById('attendance').value.trim();
        const childrenCount = parseInt(childrenCountInput.value, 10);

        let allChildrenNamesFilled = true;
        
        // Se houver acompanhantes, verificar se todos os nomes foram preenchidos
        if (childrenCount > 0) {
            for (let i = 0; i < childrenCount; i++) {
                const childNameInput = document.querySelector(`input[name="acompanhante_nome_${i + 1}"]`);
                if (!childNameInput || !childNameInput.value.trim()) {
                    allChildrenNamesFilled = false;
                    break;
                }
            }
        }

        const isValid = nameInput && phoneInput && attendanceInput && (childrenCount === 0 || allChildrenNamesFilled);

        submitButton.disabled = !isValid;
    };

    // Função para mostrar ou esconder o campo de quantidade de filhos
    const toggleChildrenSection = () => {
        if (hasChildrenSelect.value === 'Sim') {
            childrenSection.style.display = 'block';  // Mostra a seção de filhos
        } else {
            childrenSection.style.display = 'none';  // Esconde a seção de filhos
            childrenCountInput.value = '';  // Limpa o valor do input de quantidade de filhos
            childrenDetailsContainer.innerHTML = ''; // Limpa os detalhes dos filhos se escondido
        }
        checkFormValidity(); // Verificar a validade do formulário após ocultar/mostrar a seção
    };

    // Adiciona um event listener para mudanças na seleção de "Você possui filhos?"
    hasChildrenSelect.addEventListener('change', toggleChildrenSection);

    // Adiciona event listeners para os campos do formulário
    const formElements = rsvpForm.querySelectorAll('input, select');
    formElements.forEach(element => {
        element.addEventListener('input', checkFormValidity);
    });

    childrenCountInput.addEventListener('input', (event) => {
        const count = parseInt(event.target.value, 10);
        childrenDetailsContainer.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const nameLabel = document.createElement('label');
            nameLabel.textContent = `Nome do acompanhante ${i + 1}:`;
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.name = `acompanhante_nome_${i + 1}`;
            nameInput.required = true;

            childrenDetailsContainer.appendChild(nameLabel);
            childrenDetailsContainer.appendChild(nameInput);

            // Adiciona listener para os novos campos de nome de acompanhante
            nameInput.addEventListener('input', checkFormValidity);
        }

        // Verificar a validade do formulário novamente após adicionar novos campos
        checkFormValidity();
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('https://api.sheetmonkey.io/form/29ooQHCn7VpNYebL2diQfE', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();  // Lê a resposta como texto
        })
        .then(data => {
            // Exibe o modal de sucesso
            successModal.style.display = 'block';
            // Limpa os campos do formulário
            rsvpForm.reset();
            submitButton.disabled = true;  // Desabilitar o botão após o reset
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }

    rsvpForm.addEventListener('submit', handleSubmit);

    // Fechar o modal quando o usuário clicar no "X"
    closeModal.addEventListener('click', () => {
        successModal.style.display = 'none';
    });

    // Fechar o modal quando o usuário clicar fora do conteúdo do modal
    window.addEventListener('click', (event) => {
        if (event.target == successModal) {
            successModal.style.display = 'none';
        }
    });

    // Verificar a visibilidade da seção de filhos ao carregar a página
    toggleChildrenSection();
});