const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin2024";

const ADMIN_USER_KEY = "euroCalcAdminUser";
const ADMIN_PWD_KEY = "euroCalcAdminPwd";

const USERS_KEY = "euroCalcUsers";
const AUTH_KEY = "euroCalcAuth";
const AUTH_EXPIRY_DAYS = 7;


function getAdminUsername() {
  return localStorage.getItem(ADMIN_USER_KEY) || DEFAULT_ADMIN_USERNAME;
}

function getAdminPassword() {
  return localStorage.getItem(ADMIN_PWD_KEY) || DEFAULT_ADMIN_PASSWORD;
}

function setAdminCredentials(username, password) {
  if (username) localStorage.setItem(ADMIN_USER_KEY, username);
  if (password) localStorage.setItem(ADMIN_PWD_KEY, password);
}


function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function addUser(username, password) {
  username = username.trim();
  password = password.trim();

  if (!username || !password) return {
    ok: false,
    error: "Username এবং Password দুটোই দিন"
  }

  ;

  if (username.length < 3) return {
    ok: false,
    error: "Username কমপক্ষে ৩ অক্ষরের হতে হবে"
  }

  ;

  if (password.length < 4) return {
    ok: false,
    error: "Password কমপক্ষে ৪ অক্ষরের হতে হবে"
  }

  ;

  if (username.toLowerCase() === getAdminUsername().toLowerCase()) return {
    ok: false,
    error: "এই Username ব্যবহার করা যাবে না"
  }

  ;

  const users = getUsers();

  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) return {
    ok: false,
    error: "এই Username আগেই আছে"
  }

  ;

  users.push({
    username,
    password,
    createdAt: Date.now()
  });
  saveUsers(users);

  return {
    ok: true
  }

  ;
}

function deleteUser(username) {
  saveUsers(getUsers().filter(u => u.username !== username));
}


function changeUserCredentials(oldUsername, newUsername, newPassword) {
  newUsername = (newUsername || "").trim();
  newPassword = (newPassword || "").trim();

  if (!newUsername && !newPassword) return {
    ok: false,
    error: "কিছু পরিবর্তন করতে হবে"
  }

  ;

  if (newUsername && newUsername.length < 3) return {
    ok: false,
    error: "Username কমপক্ষে ৩ অক্ষর"
  }

  ;

  if (newPassword && newPassword.length < 4) return {
    ok: false,
    error: "Password কমপক্ষে ৪ অক্ষর"
  }

  ;

  const users = getUsers();
  const idx = users.findIndex(u => u.username === oldUsername);

  if (idx === -1) return {
    ok: false,
    error: "User পাওয়া যায়নি"
  }

  ;

  if (newUsername && newUsername.toLowerCase() === getAdminUsername().toLowerCase()) return {
    ok: false,
    error: "এই Username ব্যবহার করা যাবে না"
  }

  ;

  if (newUsername && newUsername.toLowerCase() !== oldUsername.toLowerCase() && users.some((u, i) => i !== idx && u.username.toLowerCase() === newUsername.toLowerCase())) return {
    ok: false,
    error: "এই Username আগেই আছে"
  }

  ;

  if (newUsername) users[idx].username = newUsername;
  if (newPassword) users[idx].password = newPassword;
  saveUsers(users);

  return {
    ok: true
  }

  ;
}


function changeOwnCredentials(oldPwd, newUsername, newPassword) {
  const user = getCurrentUser();

  if (!user) return {
    ok: false,
    error: "Login করুন"
  }

  ;

  oldPwd = (oldPwd || "").trim();
  newUsername = (newUsername || "").trim();
  newPassword = (newPassword || "").trim();

  if (!oldPwd) return {
    ok: false,
    error: "পুরোনো Password দিন"
  }

  ;

  if (!newUsername && !newPassword) return {
    ok: false,
    error: "নতুন কিছু লিখুন"
  }

  ;

  if (newUsername && newUsername.length < 3) return {
    ok: false,
    error: "Username কমপক্ষে ৩ অক্ষর"
  }

  ;

  if (newPassword && newPassword.length < 4) return {
    ok: false,
    error: "Password কমপক্ষে ৪ অক্ষর"
  }

  ;

  const finalUsername = newUsername || user.username;

  if (user.isAdmin) {
    if (oldPwd !== getAdminPassword()) return {
      ok: false,
      error: "পুরোনো Password ভুল"
    }

    ;

    const users = getUsers();

    if (newUsername && newUsername.toLowerCase() !== user.username.toLowerCase() && users.some(u => u.username.toLowerCase() === newUsername.toLowerCase())) return {
      ok: false,
      error: "এই Username আগেই আছে"
    }

    ;

    setAdminCredentials(finalUsername, newPassword || getAdminPassword());

    localStorage.setItem(AUTH_KEY, JSON.stringify({
      username: finalUsername,
      isAdmin: true,
      time: Date.now()
    }));

    return {
      ok: true,
      message: "Admin তথ্য সফলভাবে পরিবর্তন হয়েছে"
    }

    ;
  }

  const users = getUsers();
  const idx = users.findIndex(u => u.username === user.username);

  if (idx === -1) return {
    ok: false,
    error: "User পাওয়া যায়নি"
  }

  ;

  if (oldPwd !== users[idx].password) return {
    ok: false,
    error: "পুরোনো Password ভুল"
  }

  ;

  if (newUsername && newUsername.toLowerCase() === getAdminUsername().toLowerCase()) return {
    ok: false,
    error: "এই Username ব্যবহার করা যাবে না"
  }

  ;

  if (newUsername && newUsername.toLowerCase() !== user.username.toLowerCase() && users.some((u, i) => i !== idx && u.username.toLowerCase() === newUsername.toLowerCase())) return {
    ok: false,
    error: "এই Username আগেই আছে"
  }

  ;

  users[idx].username = finalUsername;
  if (newPassword) users[idx].password = newPassword;
  saveUsers(users);

  localStorage.setItem(AUTH_KEY, JSON.stringify({
    username: finalUsername,
    isAdmin: false,
    time: Date.now()
  }));

  return {
    ok: true,
    message: "তথ্য সফলভাবে পরিবর্তন হয়েছে"
  }

  ;
}


function isAuthed() {
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return false;

  try {
    const {
      time
    }

    = JSON.parse(data);
    return (Date.now() - time) / (1000 * 60 * 60 * 24) < AUTH_EXPIRY_DAYS;
  } catch {
    return false;
  }
}

function getCurrentUser() {
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function isAdmin() {
  const user = getCurrentUser();
  if (!user) return false;
  return user.isAdmin === true && user.username === getAdminUsername();
}


function login(username, password) {
  username = username.trim();
  password = password.trim();

  if (username === getAdminUsername() && password === getAdminPassword()) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      username: getAdminUsername(),
      isAdmin: true,
      time: Date.now()
    }));

    return {
      ok: true,
      isAdmin: true
    }

    ;
  }

  const found = getUsers().find(u => u.username === username && u.password === password);

  if (found) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      username: found.username,
      isAdmin: false,
      time: Date.now()
    }));

    return {
      ok: true,
      isAdmin: false
    }

    ;
  }

  return {
    ok: false,
    error: "ভুল Username বা Password"
  }

  ;
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "login.html";
}

function checkAuth() {
  if (!isAuthed()) window.location.href = "login.html";
}

function checkAdmin() {
  if (!isAuthed()) {
    window.location.href = "login.html";
    return;
  }

  if (!isAdmin()) window.location.href = "index.html";
}







/* =========================================================
   AUTO PASSWORD EYE TOGGLE
   — সব input[type="password"]-এর ডানে চোখ বসায়
========================================================= */
(function() {

  let scheduled = false;

  function addEyeToggles() {

    scheduled = false;

    document.querySelectorAll('input[type="password"]').forEach(function(input) {

      const parent = input.parentElement;
      if (!parent) return;

      /* login.html-এ আগেই toggle আছে — সেটা skip */
      if (parent.querySelector('.toggle-pwd, .pwd-eye-btn')) return;

      /* আগেই যোগ করা হয়েছে? */
      if (input.dataset.eyeAdded === "1") return;
      input.dataset.eyeAdded = "1";

      /* button বানাও */
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pwd-eye-btn";
      btn.setAttribute("aria-label", "Show password");
      btn.innerHTML = '<i class="bi bi-eye"></i>';

      btn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        const isPwd = input.type === "password";
        input.type = isPwd ? "text" : "password";

        btn.innerHTML = isPwd ?
          '<i class="bi bi-eye-slash"></i>' :
          '<i class="bi bi-eye"></i>';

        input.focus();
      });

      parent.appendChild(btn);
    });
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(addEyeToggles, 30);
  }

  /* page ready হলে চালাও */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addEyeToggles);
  } else {
    addEyeToggles();
  }

  /* নতুন password field যোগ হলে (admin edit)ও ধরবে */
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(schedule).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  /* বাইরে থেকেও কল করা যায় */
  window.__addEyeToggles = addEyeToggles;

})();
