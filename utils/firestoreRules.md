// Example Firestore rules:
match /users/{uid} {
  allow read, write: if request.auth.uid == uid;
}
