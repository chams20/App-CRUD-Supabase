// script.js
import { supabase } from "./importSupabase.js";


// INSCRIPTION
const signupForm = document.getElementById("signup-form");
const signupMessage = document.getElementById("signup-message");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  signupMessage.textContent = "Création du compte en cours...";
  signupMessage.className = "text-info";

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    // Les messages d'erreurs
    signupMessage.textContent = error.message;
    signupMessage.className = "text-danger";
  } else {
    signupMessage.textContent = "Compte créé ! Vérifie ta boîte mail pour confirmer ton inscription.";
    signupMessage.className = "text-success";
    // Si tout est bien créé on réinitialise le formulaire
    signupForm.reset();
  }
});


// CONNEXION
const signinForm = document.getElementById("signin-form");
const signinMessage = document.getElementById("signin-message");

signinForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;

  signinMessage.textContent = "Connexion en cours...";
  signinMessage.className = "text-info";

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("Je suis connecté : ", data)

  if (error) {
    signinMessage.textContent = error.message;
    signinMessage.className = "text-danger";
  } else {
    signinMessage.textContent = "Connecté avec succès !";
    signinMessage.className = "text-success";
    signinForm.reset();
    console.log("Session : ", data.session); // utile pour debug

    
    // Recharge la page après connexion
    setTimeout(() => {
      window.location.reload();
    }, 1000); // petit délai pour laisser le message s'afficher
  }
});


// BOÎTE UTILISATEUR
const userBox = document.getElementById("user-box");
const userEmailSpan = document.getElementById("user-email");
const updateForm = document.getElementById("update-form");
const logoutBtn = document.getElementById("logout-btn");
const userMessage = document.getElementById("user-message");

// Fonction pour afficher la boîte si connecté
async function showUserBoxIfConnected() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    userBox.classList.remove("d-none");
    userEmailSpan.textContent = user.email;
  } else {
    userBox.classList.add("d-none");
  }
}


/**
 * Appeler la fonction au chargement de la page
 */
window.addEventListener("DOMContentLoaded", () => {
    showUserBoxIfConnected();
});

// MODIFICATION DE L'EMAIL
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newEmail = document.getElementById("new-email").value;

  userMessage.textContent = "Mise à jour en cours...";
  userMessage.className = "text-info";

  const { data, error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    userMessage.textContent = error.message;
    userMessage.className = "text-danger";
  } else {
    userMessage.textContent = "Email mis à jour ! Vérifie ta boîte mail.";
    userMessage.className = "text-success";
    userEmailSpan.textContent = newEmail;
    updateForm.reset();
  }
});


// DÉCONNEXION
logoutBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    userMessage.textContent = error.message;
    userMessage.className = "text-danger";
  } else {
    userMessage.textContent = "Déconnecté avec succès.";
    userMessage.className = "text-success";
    userBox.classList.add("d-none");
  }
});