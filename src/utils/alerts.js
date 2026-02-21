import Swal from 'sweetalert2';

export const showLoginSuccess = (message = 'Connexion réussie') => {
  return Swal.fire({
    icon: 'success',
    title: message,
    timer: 1400,
    showConfirmButton: false,
    position: 'center'
  });
};

export const showLogoutConfirm = (opts = {}) => {
  return Swal.fire({
    title: opts.title || 'Voulez-vous vous déconnecter ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: opts.confirmText || 'Se déconnecter',
    cancelButtonText: opts.cancelText || 'Annuler',
    reverseButtons: true
  }).then(result => result.isConfirmed);
};

export default { showLoginSuccess, showLogoutConfirm };
