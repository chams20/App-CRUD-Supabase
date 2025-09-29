import { supabase } from "./importSupabase.js";

// --- FONCTION DE VALIDATION ---
function validateEmail(email) {
  // Regex simple pour vérifier le format email
  return /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  // Minimum 8 caractères
  return password.length >= 8;
}

function validatePhone(phone) {
  // Vide ou entre 8 et 15 chiffres
  return phone === "" || /^[0-9]{8,15}$/.test(phone);
}

// --- FONCTION POUR CRÉER UN PROFIL SI MANQUANT ---
async function ensureProfile(user) {
  if (!user) return;

  const { data: profile } = await supabase
  .from("profiles")
  .select("id")
  .eq("id", user.id)
  .maybeSingle();

  if (!profile) {
    await supabase.from("profiles").insert({
    id: user.id,
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    updated_at: new Date()
  });
    console.log("Profil créé automatiquement pour :", user.id);
  } else {
    console.log("Profil déjà existant :", user.id);
  }
}

// --- INSCRIPTION ---
const signupForm = document.getElementById("signup-form");
const signupMessage = document.getElementById("signup-message");

signupForm.addEventListener("submit", async (e) => {
e.preventDefault();
const email = document.getElementById("signup-email").value.trim();
const password = document.getElementById("signup-password").value.trim();

// Validation côté client
if (!email || !password) {
  signupMessage.textContent = "Email et mot de passe requis.";
  signupMessage.className = "text-danger";
  return;
}
if (!validateEmail(email)) {
  signupMessage.textContent = "Adresse email invalide.";
  signupMessage.className = "text-danger";
  return;
}
if (!validatePassword(password)) {
  signupMessage.textContent = "Le mot de passe doit contenir au moins 8 caractères.";
  signupMessage.className = "text-danger";
  return;
}

// Bloquer le bouton pendant le traitement
const submitBtn = signupForm.querySelector("button");
submitBtn.disabled = true;

signupMessage.textContent = "Création du compte en cours...";
signupMessage.className = "text-info";

const { data, error } = await supabase.auth.signUp({ email, password });

if (error) {
  signupMessage.textContent = error.message;
  signupMessage.className = "text-danger";
} else {
  signupMessage.textContent = "Compte créé ! Veuillez-vous connecter.";
  signupMessage.className = "text-success";
  signupForm.reset();
  console.log("signUp result:", data);
}

submitBtn.disabled = false;
});

// --- CONNEXION ---
const signinForm = document.getElementById("signin-form");
const signinMessage = document.getElementById("signin-message");

signinForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value.trim();

  if (!email || !password) {
    signinMessage.textContent = "Email et mot de passe requis.";
    signinMessage.className = "text-danger";
    return;
  }

  const submitBtn = signinForm.querySelector("button");
  submitBtn.disabled = true;

  signinMessage.textContent = "Connexion en cours...";
  signinMessage.className = "text-info";

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    signinMessage.textContent = error.message;
    signinMessage.className = "text-danger";
  } else {
    signinMessage.textContent = "Connecté avec succès !";
    signinMessage.className = "text-success";
    signinForm.reset();


    // S'assurer que le profil existe
    if (data.user) {
      await ensureProfile(data.user);
    }
    showUserBoxIfConnected();


  }

  submitBtn.disabled = false;
});

// --- BOÎTE UTILISATEUR ---
const userEmailSpan = document.getElementById("user-email");
const updateForm = document.getElementById("update-email-form");
const logoutBtn = document.getElementById("logout-btn");
const userMessage = document.getElementById("user-message");

const profileBox = document.getElementById("user-profile-box");
const profileForm = document.getElementById("profile-form");
const logForms = document.getElementById("logForms");

// Charger infos utilisateur
async function showUserBoxIfConnected() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    profileBox.classList.remove("d-none");
    logForms.classList.add("d-none");
    userEmailSpan.textContent = user.email;


    // Charger profil (et si absent, on le crée)
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      await ensureProfile(user);
    } else {
      document.getElementById("first-name").value = profile.first_name || "";
      document.getElementById("last-name").value = profile.last_name || "";
      document.getElementById("phone").value = profile.phone || "";
      document.getElementById("address").value = profile.address || "";
    }


  } else {
    profileBox.classList.add("d-none");
    logForms.classList.remove("d-none");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  showUserBoxIfConnected();
});

// --- MODIFICATION DE L'EMAIL ---
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newEmail = document.getElementById("new-email").value.trim();

  if (!newEmail || !validateEmail(newEmail)) {
    userMessage.textContent = "Adresse email invalide.";
    userMessage.className = "text-danger";
    return;
  }

  userMessage.textContent = "Mise à jour en cours...";
  userMessage.className = "text-info";

  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    userMessage.textContent = error.message;
    userMessage.className = "text-danger";
  } else {
    userMessage.textContent = "Email mis à jour ! Vérifie tes boîtes mail.";
    userMessage.className = "text-success";
    userEmailSpan.textContent = newEmail;
    updateForm.reset();
  }
});

// --- ENREGISTRER LE PROFIL ---
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const phone = document.getElementById("phone").value.trim();
  if (!validatePhone(phone)) {
    userMessage.textContent = "Le numéro de téléphone doit contenir entre 8 et 15 chiffres.";
    userMessage.className = "text-danger";
    return;
  }

  const profileData = {
    id: user.id,
    first_name: document.getElementById("first-name").value.trim(),
    last_name: document.getElementById("last-name").value.trim(),
    phone: phone,
    address: document.getElementById("address").value.trim(),
    updated_at: new Date()
  };

  userMessage.textContent = "Enregistrement du profil...";
  userMessage.className = "text-info";

  const { error } = await supabase.from("profiles").upsert(profileData);

  if (error) {
    userMessage.textContent = error.message;
    userMessage.className = "text-danger";
  } else {
    userMessage.textContent = "Profil mis à jour avec succès !";
    userMessage.className = "text-success";
  }
});

// --- DÉCONNEXION ---
logoutBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    userMessage.textContent = error.message;
    userMessage.className = "text-danger";
  } else {
    userMessage.textContent = "Déconnecté avec succès.";
    userMessage.className = "text-success";
    profileBox.classList.add("d-none");
    logForms.classList.remove("d-none");
  }
});
