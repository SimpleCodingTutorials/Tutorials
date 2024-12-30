import React, {useState,useEffect} from "react";
import "./App.css";

function LoadMorePaginationWithPictures() {
    const [items,setItems] = useState([]);
    const [page,setPage] = useState(1);
    const [loading,setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const accessKey = "66MIt4Ovo5lzD6QF2wsr4m04U1fBT8ILaSry4q9EeHs";

    useEffect(()=>{
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

        setItems((prevItems)=>{
          const newItems = data.filter(item=> !prevItems.some(prevItem=>prevItem.id === item.id));
          return [...prevItems, ...newItems];
        });
        if(data.length<9) {
          setHasMore(false);
        }
      } catch(error) {
        console.error("Fetch error:",error.message);
      }finally{
        setLoading(false);
      }
    };

    const loadMore = () => {
      if(hasMore) {
        setPage((prevPage)=>prevPage+1);
      }
    };

    return (
      <div>
        <div className="grid-container">
          {items.map((item)=>(
            <div key={item.id} className="grid-item">
              <img
                src={item.urls.small}
                alt={item.alt_description}
                className="image"
              />
              <p className="image-title">
                {item.alt_description || "untitled"}
              </p>
            </div>
          ))}
        </div>
        {loading && <p className="loading-text">Loading...</p>}
        {hasMore && !loading && (
          <button onClick={loadMore} className="load-more-button">
              Load More
          </button>
        )
        }
        {!hasMore && <p className="end-text">No more items</p>}
      </div>
    );
}

export default LoadMorePaginationWithPictures;
























