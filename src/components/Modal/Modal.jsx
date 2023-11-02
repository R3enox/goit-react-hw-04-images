import { useEffect } from 'react';
import css from './Modal.module.css';

export const Modal = ({ photos, id, closeModal }) => {
  useEffect(() => {
    const handlePressESC = evt => {
      evt.preventDefault();
      if (evt.code === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handlePressESC);

    return () => {
      window.removeEventListener('keydown', handlePressESC);
    };
  }, [closeModal]);

  return (
    <div className={css.overlay}>
      <div className={css.modal}>
        <img src={photos[id].largeImageURL} alt="" />
        <button className={css.btnClose} onClick={closeModal}>
          ❌
        </button>
      </div>
    </div>
  );
};
