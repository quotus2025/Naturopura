export const logout = () => {
  // Clear localStorage
  localStorage.removeItem('user');
  
  // Redirect to logout route which will handle cookie clearing
  window.location.href = '/logout';
}; 