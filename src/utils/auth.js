// src/utils/auth.js
const STORAGE_KEY = "demo_users";
const SESSION_KEY = "session_user";

/**
 * Safe normalization for emails.
 */
const normalizeEmail = (email = "") => email.trim().toLowerCase();

/**
 * Hash a string using SHA-256 and return hex.
 * Falls back with a clear error if crypto.subtle is unavailable.
 */
async function hashString(str) {
  if (
    !window.crypto ||
    !window.crypto.subtle ||
    typeof window.crypto.subtle.digest !== "function"
  ) {
    throw new Error("Crypto API not available. Cannot hash securely.");
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getAllUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      console.warn("Unexpected users store, resetting to empty array.");
      saveAllUsers([]);
      return [];
    }
    return parsed;
  } catch (e) {
    console.warn("Failed to parse users from localStorage, resetting.", e);
    saveAllUsers([]);
    return [];
  }
}

function saveAllUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users to localStorage:", e);
  }
}

// Seed default admin if missing
async function seedAdmin() {
  const users = getAllUsers();
  const adminEmail = normalizeEmail("plainsmotorinnn@gmail.com");
  if (!users.find((u) => normalizeEmail(u.email) === adminEmail)) {
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
    console.log("Seeded default admin:", adminEmail, "/ plainsmotorinnn123");
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
  const normalized = normalizeEmail(email);
  const users = getAllUsers();
  if (users.find((u) => normalizeEmail(u.email) === normalized)) {
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
  const normalized = normalizeEmail(email);
  const users = getAllUsers();
  const user = users.find((u) => normalizeEmail(u.email) === normalized);
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
  const user = users.find((u) => normalizeEmail(u.email) === normalizeEmail(email));
  if (!user) return null;
  return { email: user.email, role: user.role };
}

// Reset via security answer
export async function resetPassword({
  email,
  securityAnswer,
  newPassword,
}) {
  const normalized = normalizeEmail(email);
  const users = getAllUsers();
  const idx = users.findIndex(
    (u) => normalizeEmail(u.email) === normalized
  );
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
  const normalized = normalizeEmail(email);
  const users = getAllUsers();
  const idx = users.findIndex(
    (u) => normalizeEmail(u.email) === normalized
  );
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
