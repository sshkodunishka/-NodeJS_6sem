function lockRmvBtn() {
    const full_name = document.getElementsByName('full_name')[0].value;
    const button = document.getElementsByClassName('rmvBtn')[0];
    if (full_name.length > 1) {
        button.disabled = true; 
    }
}

function create() {
    const full_name = document.getElementsByName('full_name')[0].value;
    const phonenumber = document.getElementsByName('phonenumber')[0].value;
    const error = document.getElementsByClassName('error')[0];
    if (!full_name || !phonenumber) {
        error.innerHTML = 'Wrong name or phonenumber ';
        return;
    }
    if (!/^[0-9+]{7,13}$/.test(phonenumber)) {
        error.innerHTML = 'Wrong phonenumber';
        return;
    }

    fetch('/add',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, phonenumber })
        }).then(response => response.json())
        .then(() => window.location.href = '/');
}

function update() {
    const id = document.getElementsByClassName('editContainer')[0].getAttribute('data-key');
    const full_name = document.getElementsByName('full_name')[0].value;
    const phonenumber = document.getElementsByName('phonenumber')[0].value;
    const error = document.getElementsByClassName('error')[0];

    if (!full_name || !phonenumber) {
        error.innerHTML = 'Write some info';
        return;
    }

    if (!/^[0-9+]{7,13}$/.test(phonenumber)) {
        error.innerHTML = 'Wrong phonenumber';
        return;
    }

    fetch('/update',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, full_name, phonenumber })
        }).then(response => response.json())
        .then(() => window.location.href = '/');
}

function remove() {
    const full_name = document.getElementsByName('full_name')[0].value;
    const phonenumber = document.getElementsByName('phonenumber')[0].value;
    const id = document.getElementsByClassName('editContainer')[0].getAttribute('data-key');
    const error = document.getElementsByClassName('error')[0];

    if (!id) return;

    fetch('/delete',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, full_name, phonenumber })
        }).then(response => response.json())
        .then(() => window.location.href = '/');
}
