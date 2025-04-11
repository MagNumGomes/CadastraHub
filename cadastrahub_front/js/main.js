document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/api/test')
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  });
  