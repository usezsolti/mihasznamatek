/** Google belépés: mindig fiókválasztó, ne az utolsó Gmail-t nyomja rá. */

export function createGoogleAuthProvider(firebase: { auth: { GoogleAuthProvider: new () => any } }) {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });
    return provider;
}

export async function signInWithGooglePopup(firebase: any) {
    const provider = createGoogleAuthProvider(firebase);
    return firebase.auth().signInWithPopup(provider);
}
