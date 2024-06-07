async function getORCiDData(orcid) {
    const apiUrl = `https://pub.orcid.org/v3.0/${orcid}/person`;
    try {
        const response = await fetch(apiUrl, {
            headers: { Accept: 'application/vnd.orcid+json' },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data from ORCiD:", data);
        const fullName = data['name']['given-names']['value'] + ' ' + data['name']['family-name']['value'];
        const email = data['emails']['email'] && data['emails']['email'].length > 0 ? data['emails']['email'][0].email : null;
        return { fullName, email };
    } catch (error) {
        console.error('Error fetching data from ORCiD:', error);
        return { fullName: null, email: null };
    }
}

function extractEmails() {
    const text = document.getElementById('inputText').value;
    const orcidPattern = /\b\d{4}-\d{4}-\d{4}-\d{3}[0-9Xx]\b/g;
    const orcids = [...text.matchAll(orcidPattern)].map(match => match[0]);

    document.querySelectorAll('.list-group-item-danger').forEach(e => e.remove());

    orcids.forEach(async (orcid) => {
        const { fullName, email } = await getORCiDData(orcid);
        if (email && !document.querySelector(`[data-email="${email}"]`)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${fullName} <${email}>`;
            listItem.dataset.email = email;
            listItem.classList.add('list-group-item', 'list-group-item-success');
            document.getElementById('emailList').prepend(listItem);
        } else if (!email) {
            const errorItem = document.createElement('li');
            errorItem.textContent = `${fullName ? fullName + ' ' : ''}(${orcid}) - No public email exists`;
            errorItem.classList.add('list-group-item', 'list-group-item-danger');
            document.getElementById('emailList').appendChild(errorItem);
        }
    });
}

function copyEmails() {
    const emails = Array.from(document.querySelectorAll('.list-group-item-success')).map(item => item.textContent).join('; ');
    navigator.clipboard.writeText(emails).then(() => alert('Emails copied to clipboard!'));
}

function eraseErrors() {
    document.querySelectorAll('.list-group-item-danger').forEach(item => item.remove());
}

function eraseAll() {
    document.getElementById('emailList').innerHTML = '';
}
