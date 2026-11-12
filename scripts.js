const BASE_URL = 'https://typicode.com';
1.
function sortPostsByTitleLengthDesc(posts) {
  return [...posts].sort((a, b) => b.title.length - a.title.length);
}

function sortCommentsByAuthorName(comments) {
  return [...comments].sort((a, b) => a.name.localeCompare(b.name));
}

function pickUserFields(users) {
  return users.map(({ id, name, username, email, phone }) => ({
    id,
    name,
    username,
    email,
    phone,
  }));
}

function filterIncompleteTodos(todos) {
  return todos.filter((todo) => !todo.completed);
}
2.1 коллэбеков
function fetchWithCallback(endpoint, callback) {
  fetch(`${BASE_URL}${endpoint}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => callback(null, data))
    .catch((error) => callback(error, null));
}

function getSortedPostsCallback(callback) {
  fetchWithCallback('/posts', (error, posts) => {
    if (error) return callback(error, null);
    const sorted = sortPostsByTitleLengthDesc(posts);
    callback(null, sorted);
  });
}

function getSortedCommentsCallback(callback) {
  fetchWithCallback('/comments', (error, comments) => {
    if (error) return callback(error, null);
    const sorted = sortCommentsByAuthorName(comments);
    callback(null, sorted);
  });
}
getSortedPostsCallback((err, data) => {
  if (err) console.error('Callback /posts error:', err);
  else console.log('A.i. Posts (callback):', data);
});

getSortedCommentsCallback((err, data) => {
  if (err) console.error('Callback /comments error:', err);
  else console.log('A.ii. Comments (callback):', data);
});
2.2 промис
function fetchWithPromise(endpoint) {
  return fetch(`${BASE_URL}${endpoint}`).then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
  });
}

function getFilteredUsersPromise() {
  return fetchWithPromise('/users').then(pickUserFields);
}

function getIncompleteTodosPromise() {
  return fetchWithPromise('/todos').then(filterIncompleteTodos);
}
getFilteredUsersPromise()
  .then((data) => console.log('B.i. Users (promise):', data))
  .catch((err) => console.error('Promise /users error:', err));

getIncompleteTodosPromise()
  .then((data) => console.log('B.ii. Todos (promise):', data))
  .catch((err) => console.error('Promise /todos error:', err));
4. 
async function fetchAsync(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Ошибка HTTP: ${response.status}`);
  }
  return response.json();
}

async function getSortedPostsAsync() {
  const posts = await fetchAsync('/posts');
  return sortPostsByTitleLengthDesc(posts);
}

async function getSortedCommentsAsync() {
  const comments = await fetchAsync('/comments');
  return sortCommentsByAuthorName(comments);
}

async function getFilteredUsersAsync() {
  const users = await fetchAsync('/users');
  return pickUserFields(users);
}

async function getIncompleteTodosAsync() {
  const todos = await fetchAsync('/todos');
  return filterIncompleteTodos(todos);
}

async function runAllAsyncTasks() {
  try {
    const [posts, comments, users, todos] = await Promise.all([
      getSortedPostsAsync(),
      getSortedCommentsAsync(),
      getFilteredUsersAsync(),
      getIncompleteTodosAsync(),
    ]);

    console.log('C.a.i. Posts (async/await):', posts);
    console.log('C.a.ii. Comments (async/await):', comments);
    console.log('C.b.i. Users (async/await):', users);
    console.log('C.b.ii. Todos (async/await):', todos);
  } catch (error) {
    console.error('Async/await error:', error);
  }
}

runAllAsyncTasks();
