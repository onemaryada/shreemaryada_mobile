export const getFirebaseErrorMessage = (error: any): string => {
  if (!error || !error.code) return error?.message || 'An unexpected error occurred. Please try again.';

  switch (error.code) {
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'The password provided is too weak. Please use a stronger password.';
    case 'auth/operation-not-allowed':
      return 'This authentication method is currently disabled.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/credential-already-in-use':
      return 'This credential is already linked to another account.';
    case 'auth/invalid-credential':
      return 'The provided credentials are invalid or expired.';
    default:
      return error.message || 'An error occurred during authentication.';
  }
};
