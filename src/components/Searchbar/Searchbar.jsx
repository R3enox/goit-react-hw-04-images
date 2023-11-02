import { useState } from 'react';
import css from './Searchbar.module.css';

export const Search = ({ handleSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = ({ target: { value } }) => {
    setValue(value);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    handleSearch(value.trim());

    setValue('');
  };

  return (
    <header className={css.searchbar}>
      <form className={css.searchForm} onSubmit={handleSubmit}>
        <input
          className={css.searchInput}
          type="text"
          placeholder="Search images and photos"
          autoComplete="off"
          autoFocus
          onChange={handleChange}
          value={value}
        />
      </form>
    </header>
  );
};
