// src/utils/auth.js
const STORAGE_KEY = "demo_users";
const SESSION_KEY = "session_user";

// Hash a string using SHA-256 and return hex
async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getAllUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAllUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Seed default admin if missing
async function seedAdmin() {
  const users = getAllUsers();
  const adminEmail = "plainsmotorinnn@gmail.com";
  if (!users.find((u) => u.email === adminEmail)) {
    const passwordHash = await hashString("plainsmotorinnn123");
    const answerHash = await hashString("adminanswer");
    users.push({
      email: adminEmail,
      passwordHash,
      securityQuestion: "Admin fallback question?",
      securityAnswerHash: answerHash,
      role: "admin",
    });
    saveAllUsers(users);
    console.log(
      "Seeded default admin:",
      adminEmail,
      "/ plainsmotorinnn123"
    );
  }
}

// Public API

export async function initAuthDemo() {
  await seedAdmin();
}

export async function signup({
  email,
  password,
  securityQuestion,
  securityAnswer,
  role = "user",
}) {
  const users = getAllUsers();
  const normalized = email.trim().toLowerCase();
  if (users.find((u) => u.email === normalized)) {
    throw new Error("User already exists");
  }
  const passwordHash = await hashString(password);
  const answerHash = await hashString(securityAnswer.trim().toLowerCase());
  users.push({
    email: normalized,
    passwordHash,
    securityQuestion,
    securityAnswerHash: answerHash,
    role,
  });
  saveAllUsers(users);
  return true;
}

export async function login({ email, password }) {
  const users = getAllUsers();
  const normalized = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normalized);
  if (!user) throw new Error("User not found");
  const passwordHash = await hashString(password);
  if (passwordHash !== user.passwordHash) throw new Error("Incorrect password");
  localStorage.setItem(SESSION_KEY, normalized);
  return { email: normalized, role: user.role };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  const users = getAllUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  return { email: user.email, role: user.role };
}

// Reset via security answer
export async function resetPassword({
  email,
  securityAnswer,
  newPassword,
}) {
  const users = getAllUsers();
  const normalized = email.trim().toLowerCase();
  const idx = users.findIndex((u) => u.email === normalized);
  if (idx === -1) throw new Error("User not found");
  const user = users[idx];
  const answerHash = await hashString(securityAnswer.trim().toLowerCase());
  if (answerHash !== user.securityAnswerHash)
    throw new Error("Security answer incorrect");
  const newPassHash = await hashString(newPassword);
  users[idx].passwordHash = newPassHash;
  saveAllUsers(users);
  return true;
}

// Change password by providing current password
export async function changePassword({
  email,
  currentPassword,
  newPassword,
}) {
  const users = getAllUsers();
  const normalized = email.trim().toLowerCase();
  const idx = users.findIndex((u) => u.email === normalized);
  if (idx === -1) throw new Error("User not found");
  const user = users[idx];
  const currentHash = await hashString(currentPassword);
  if (currentHash !== user.passwordHash)
    throw new Error("Current password incorrect");
  const newHash = await hashString(newPassword);
  users[idx].passwordHash = newHash;
  saveAllUsers(users);
  return true;
}
