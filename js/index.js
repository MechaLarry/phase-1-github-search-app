let searchType = 'user'; // Default search type

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('github-form');
  form.addEventListener('submit', handleFormSubmit);
  
  const toggleButton = document.getElementById('toggle-search');
  toggleButton.addEventListener('click', toggleSearchType);
});

function handleFormSubmit(event) {
  event.preventDefault();
  const searchQuery = document.getElementById('search').value;
  
  if (searchType === 'user') {
    searchGitHubUsers(searchQuery);
  } else {
    searchGitHubRepos(searchQuery);
  }
}

function toggleSearchType() {
  searchType = searchType === 'user' ? 'repo' : 'user';
  const searchInput = document.getElementById('search');
  searchInput.placeholder = searchType === 'user' ? 'Search GitHub Users' : 'Search GitHub Repos';
}

function searchGitHubUsers(query) {
  const url = `https://api.github.com/search/users?q=${query}`;
  fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displayUsers(data.items);
    });
}

function searchGitHubRepos(query) {
  const url = `https://api.github.com/search/repositories?q=${query}`;
  fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displayRepos(data.items);
    });
}

function displayUsers(users) {
  const userList = document.getElementById('user-list');
  userList.innerHTML = ''; // Clear previous results
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${user.login}</h3>
      <img src="${user.avatar_url}" width="100" height="100" />
      <a href="${user.html_url}" target="_blank">View Profile</a>
      <button onclick="fetchUserRepos('${user.login}')">View Repos</button>
    `;
    userList.appendChild(li);
  });
}

function fetchUserRepos(username) {
  const url = `https://api.github.com/users/${username}/repos`;
  fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  })
    .then((response) => response.json())
    .then((repos) => {
      displayRepos(repos);
    });
}

function displayRepos(repos) {
  const reposList = document.getElementById('repos-list');
  reposList.innerHTML = ''; // Clear previous results
  repos.forEach((repo) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description}</p>
      <a href="${repo.html_url}" target="_blank">View Repo</a>
    `;
    reposList.appendChild(li);
  });
}
