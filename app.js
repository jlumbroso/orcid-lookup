async function getEmailFromORCiD(orcid) {
    const apiUrl = `https://pub.orcid.org/v3.0/${orcid}/email`;
  
    try {
      const response = await fetch(apiUrl, {
        headers: {
          Accept: 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.email && data.email.length > 0) {
        return data.email[0].email;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching email from ORCiD:', error);
      return null;
    }
  }

function extractEmails() {
    const text = document.getElementById('inputText').value;
    console.log('Text:', text); // Debug: Log the input text

    const orcidPattern = /\b\d{4}-\d{4}-\d{4}-\d{3}[0-9Xx]\b/g;
    const orcids = [...text.matchAll(orcidPattern)].map(match => match[0]);

    console.log('ORCiDs:', orcids); // Debug: Log extracted ORCiDs

    document.getElementById('emailList').innerHTML = ''; // Clear previous results

    orcids.forEach(async (orcid) => {
        const email = await getEmailFromORCiD(orcid);
        console.log('Email for', orcid, ':', email); // Debug: Log email retrieval
        if (email) {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = email;
            document.getElementById('emailList').appendChild(listItem);
        } else {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `No email found for ORCiD ${orcid}`;
            document.getElementById('emailList').appendChild(listItem);
        }
    });
}

