import React, {useState,useEffect,useRef} from "react";
import "./App.css";

function LazyLoadPaginationWithThrottle() {
    const [items,setItems] = useState([]);
    const [page,setPage] = useState(1);
    const [loading,setLoading] = useState(false);
    const [hasMore,setHasMore] = useState(true);
    const observerRef = useRef(null);
    const accessKey = "66MIt4Ovo5lzD6QF2wsr4m04U1fBT8ILaSry4q9EeHs";

    useEffect(()=> {
      fetchData(page);
    },[page]);

    const fetchData = async (currentPage) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos?page=${currentPage}&per_page=9&client_id=${accessKey}`
        );
        if(!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setItems((prevItems)=> {
          const newItems = data.filter(
            (item) => !prevItems.some((prevItem)=>prevItem.id === item.id)
          );
          return [...prevItems,...newItems];
        });
        if(data.length<9) {
          setHasMore(false);
        }
      } catch(error) {
        console.error("Fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    const lastItemRef = useRef();

    const throttle = (func, limit) => {
      let inThrottle;
      return (...args) => {
        if(!inThrottle) {
          func(...args);
          inThrottle = true;
          setTimeout(()=> (inThrottle = false), limit);
        }
      };
    };
    const loadNextPage = throttle(()=> {
      if(hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    },1000);

    useEffect(()=> {
      if(loading || !hasMore) return;
      if(observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if(entries[0].isIntersecting) {
            loadNextPage();
          }
        },
        {threshold: 1.0}
      );
      if(lastItemRef.current) {
        observerRef.current.observe(lastItemRef.current);
      }
      return () => {
        if(observerRef.current) observerRef.current.disconnect();
      };
    }, [loading,hasMore,loadNextPage]);

    return (
      <div>
        <div className="grid-container">
          {items.map((item,index)=>(
            <div
              key = {item.id}
              className="grid-item"
              ref = {index === items.length-1 ? lastItemRef : null}
            >
              <img
                src= {item.urls.small}
                alt= {item.alt_description}
                className="image"
              />
              <p className="image-title">
                {item.alt_description || "untitled"}
              </p>
            </div>
          ))}
        </div>
        {loading && <p className="loading-text">Loading...</p>}
        {!hasMore && <p className="end-text">No more items</p>}
      </div>
    );
}

export default LazyLoadPaginationWithThrottle;




















