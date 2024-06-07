async function getEmailFromORCiD(orcid) {
    const apiUrl = `https://pub.orcid.org/v3.0/${orcid}/email`;
    try {
        const response = await fetch(apiUrl, {
            headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.email && data.email.length > 0 ? data.email[0].email : null;
    } catch (error) {
        console.error('Error fetching email from ORCiD:', error);
        return null;
    }
}

function extractEmails() {
    const text = document.getElementById('inputText').value;
    const orcidPattern = /\b\d{4}-\d{4}-\d{4}-\d{3}[0-9Xx]\b/g;
    const orcids = [...text.matchAll(orcidPattern)].map(match => match[0]);
    document.getElementById('emailList').innerHTML = '';

    orcids.forEach(async (orcid) => {
        const email = await getEmailFromORCiD(orcid);
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        if (email) {
            listItem.textContent = email;
            listItem.classList.add('list-group-item-success');
            document.getElementById('emailList').prepend(listItem); // Prepend to show success at top
        } else {
            listItem.textContent = `No public email exists for ORCiD ${orcid}`;
            listItem.classList.add('list-group-item-danger');
            document.getElementById('emailList').appendChild(listItem); // Append to show errors at bottom
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
