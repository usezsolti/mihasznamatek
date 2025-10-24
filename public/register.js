// Firebase init (ugyanaz mint main.js-ben)
const firebaseConfig = { /* … a te configod … */ };
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Regisztrációs űrlap
const signupForm = document.getElementById('signup-form');
const signupMsg  = document.getElementById('signup-msg');
signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const name  = signupForm['student-name'].value;
  const email = signupForm['signup-email'].value;
  const pw    = signupForm['signup-password'].value;
  const phone = signupForm['signup-phone'].value;
  const grade = signupForm['signup-grade'].value;

  // 1) létrehozunk Firebase-ben egy user-t
  auth.createUserWithEmailAndPassword(email, pw)
    .then(cred => {
      // 2) ideális esetben ide is elmentjük a profiladatait Firestore-ba
      // pl. firebase.firestore().collection('students').doc(cred.user.uid).set({ name, phone, grade });
      signupMsg.textContent = 'Sikeres regisztráció! Be vagy jelentkezve.';
      // pár másodperc múlva átirányíthatod a diákfelületre:
      setTimeout(() => window.location.href = 'dashboard.html', 2000);
    })
    .catch(err => {
      signupMsg.textContent = err.message;
    });
});
