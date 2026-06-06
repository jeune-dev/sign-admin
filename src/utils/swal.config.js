import Swal from 'sweetalert2';

const SwalCustom = Swal.mixin({
  customClass: {
    popup:         'swal-popup',
    title:         'swal-title',
    htmlContainer: 'swal-text',
    confirmButton: 'swal-btn-confirm',
    cancelButton:  'swal-btn-cancel',
    actions:       'swal-actions',
    icon:          'swal-icon',
  },
  buttonsStyling: false,
  showClass: {
    popup: 'swal-anim-in',
  },
  hideClass: {
    popup: 'swal-anim-out',
  },
});

export default SwalCustom;
