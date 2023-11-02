import { useEffect, useState } from 'react';
import { Search } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Notify } from 'notiflix';
import { PixabayApi } from './helpers/pixabay-api';
import { LoadMoreBtn } from './LodaMoreBtn/LoadMoreBtn';
import { Loader } from './Loader/Loader';

export const App = () => {
  const [photos, setPhotos] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (searchQ || page !== 1) getPhotos();
  }, [searchQ, page]);

  const handleSearch = searchQ => {
    setPhotos([]);
    setSearchQ(searchQ);
    setPage(1);
  };

  const getPhotos = async () => {
    setIsLoading(true);

    const pixabayApi = new PixabayApi(12);

    pixabayApi.q = searchQ;
    pixabayApi.page = page;

    if (!searchQ) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    try {
      const { totalHits, hits } = await pixabayApi.getContent();

      if (totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notify.success(`Hooray! We found ${totalHits} images.`);
      setPhotos(prevState => [...prevState, ...hits]);
      setTotalPages(Math.ceil(totalHits / 12));
    } catch (error) {
      Notify.failure(`${error}`);
    } finally {
      setIsLoading(false);
      setLoadMore(true);
    }
  };

  const loadMorePhotos = () => {
    setPage(prevState => prevState + 1);
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  return (
    <>
      <Search handleSearch={handleSearch} />
      {isLoading && <Loader />}
      {searchQ !== null && <ImageGallery photos={photos} searchQ={searchQ} />}
      {loadMore && page !== totalPages && (
        <LoadMoreBtn loadMore={loadMorePhotos} />
      )}
    </>
  );
};
