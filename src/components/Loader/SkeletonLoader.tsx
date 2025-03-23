function Loader() {
  return (
    <>
      {
      // Skeleton loading placeholders
      [...Array(6)].map((_, index) => (
        <div className="locationItem" key={index}>
          <div className="imageWrapper skeleton">
            <div className="skeleton-image"></div>
          </div>
          <div className="locationItemDesc">
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Loader;
