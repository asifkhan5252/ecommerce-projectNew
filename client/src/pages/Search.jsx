import Layouts from '../components/Layout/Layouts'
import { useSearch } from '../Context/Search'
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [value] = useSearch()
  const navigate = useNavigate()

  // ✅ Backend URL
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <Layouts>
      <div className="container">
        <div className="text-center">
          <h2 className="mb-3">
            Search Results for:{" "}
            <span className="text-primary">
              {value.lastKeyword || "N/A"}
            </span>
          </h2>
          <h6>
            {value?.result.length < 1 ? 'No product found' : `${value?.result.length} product(s) found`}
          </h6>

          <div className="row">
            {value?.result.map((p) => (
              <div className="col-6 col-sm-6 col-md-4 col-lg-2 mb-4" key={p._id}>
                <div className="card h-100 shadow-sm border-0 hover-card">
                  {p._id && (
                    <img
                      src={`${apiUrl}/api/product/photo-product/${p._id}`}
                      alt={p.name}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-bold text-truncate">{p.name}</h6>
                    <p className="card-text small text-muted">
                      {p.description?.substring(0, 30)}...
                    </p>
                    <div className="mt-auto">
                      <p className="card-text fw-bold mb-1">₹{p.price}</p>
                      <p className="card-text">
                        <small className="text-muted">Qty: {p.quantity}</small>
                      </p>
                      <button className="btn btn-primary mb-2" onClick={() => navigate(`/product-detail/${p.slug}`)}>All Details</button>
                      <button className="btn btn-secondary">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layouts>
  )
}

export default Search
