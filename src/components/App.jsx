import { useEffect, useState } from 'react';
import { Search } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Notify } from 'notiflix';
import { PixabayApi } from './helpers/pixabay-api';
import { LoadMoreBtn } from './LodaMoreBtn/LoadMoreBtn';
import { Loader } from './Loader/Loader';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const App = () => {
  const [photos, setPhotos] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [page, setPage] = useState(1);
  // const [isLoading, setIsLoading] = useState(false);
  // const [loadMore, setLoadMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState(STATUS.IDLE);

  const { PENDING, RESOLVED, REJECTED } = STATUS;

  useEffect(() => {
    if (searchQ || page !== 1) {
      const getPhotos = async () => {
        setStatus(PENDING);
        const pixabayApi = new PixabayApi(12);

        pixabayApi.q = searchQ;
        pixabayApi.page = page;
        try {
          const { totalHits, hits } = await pixabayApi.getContent();

          if (totalHits === 0) {
            Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
          }
          setStatus(RESOLVED);
          Notify.success(`Hooray! We found ${totalHits} images.`);
          setPhotos(prevState => [...prevState, ...hits]);
          setTotalPages(Math.ceil(totalHits / 12));
        } catch (error) {
          Notify.failure(`${error}`);
          setStatus(REJECTED);
        }
      };
      getPhotos();
    }
  }, [searchQ, page, PENDING, RESOLVED, REJECTED]);

  const handleSearch = searchQ => {
    setPhotos([]);
    setSearchQ(searchQ);
    setPage(1);
  };

  const loadMorePhotos = () => {
    setPage(prevState => prevState + 1);
  };

  // useEffect(() => {
  //   if (searchQ || page !== 1) {
  //     const getPhotos = async () => {
  //       setIsLoading(true);

  //       const pixabayApi = new PixabayApi(12);

  //       pixabayApi.q = searchQ;
  //       pixabayApi.page = page;

  //       if (!searchQ) {
  //         return Notify.failure(
  //           'Sorry, there are no images matching your search query. Please try again.'
  //         );
  //       }

  //       try {
  //         const { totalHits, hits } = await pixabayApi.getContent();

  //         if (totalHits === 0) {
  //           return Notify.failure(
  //             'Sorry, there are no images matching your search query. Please try again.'
  //           );
  //         }
  //         Notify.success(`Hooray! We found ${totalHits} images.`);
  //         setPhotos(prevState => [...prevState, ...hits]);
  //         setTotalPages(Math.ceil(totalHits / 12));
  //       } catch (error) {
  //         Notify.failure(`${error}`);
  //       } finally {
  //         setIsLoading(false);
  //         setLoadMore(true);
  //       }
  //     };
  //     getPhotos();
  //   }
  // }, [searchQ, page]);

  // const handleSearch = searchQ => {
  //   setPhotos([]);
  //   setSearchQ(searchQ);
  //   setPage(1);
  // };

  // const loadMorePhotos = () => {
  //   setPage(prevState => prevState + 1);
  // };

  // return (
  //   <>
  //     <Search handleSearch={handleSearch} />
  //     {isLoading && <Loader />}
  //     {searchQ !== null && <ImageGallery photos={photos} searchQ={searchQ} />}
  //     {loadMore && page !== totalPages && (
  //       <LoadMoreBtn loadMore={loadMorePhotos} />
  //     )}
  //   </>
  // );
  if (!searchQ) return <Search handleSearch={handleSearch} />;

  if (status === PENDING) {
    return (
      <>
        <Search handleSearch={handleSearch} />
        <Loader />
      </>
    );
  } else if (status === RESOLVED) {
    return (
      <>
        <Search handleSearch={handleSearch} />;
        <ImageGallery photos={photos} searchQ={searchQ} />
        {page !== totalPages && <LoadMoreBtn loadMore={loadMorePhotos} />}
      </>
    );
  } else if (status === REJECTED) {
    return <Search handleSearch={handleSearch} />;
  }
};
