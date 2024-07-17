document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    const childrenCountInput = document.getElementById('children-count');
    const childrenDetailsContainer = document.getElementById('children-details');
    const successModal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close');
    const rsvpForm = document.getElementById('rsvp-form');

    // Configuração da máscara de telefone/celular
    if (window.Inputmask) {
        Inputmask({"mask": ["(99) 9999-9999", "(99) 99999-9999"]}).mask(phoneInput);
    } else {
        console.error('Inputmask library not loaded.');
    }

    childrenCountInput.addEventListener('input', (event) => {
        const count = parseInt(event.target.value, 10);
        childrenDetailsContainer.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const nameLabel = document.createElement('label');
            nameLabel.textContent = `Nome do Filho ${i + 1}:`;
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.name = `filho_nome_${i + 1}`;
            nameInput.required = true;

            const ageLabel = document.createElement('label');
            ageLabel.textContent = `Idade do Filho ${i + 1}:`;
            const ageInput = document.createElement('input');
            ageInput.type = 'number';
            ageInput.name = `filho_idade_${i + 1}`;
            ageInput.min = 0;
            ageInput.required = true;

            childrenDetailsContainer.appendChild(nameLabel);
            childrenDetailsContainer.appendChild(nameInput);
            childrenDetailsContainer.appendChild(ageLabel);
            childrenDetailsContainer.appendChild(ageInput);
        }
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
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }

    document.getElementById('rsvp-form').addEventListener('submit', handleSubmit);

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
});
