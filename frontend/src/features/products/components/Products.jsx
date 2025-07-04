import { useProducts } from "@/hooks/products/useProducts";
import ProductsFilter from "./ProductsFilter";
import Spinner from "@/components/Spinner";
import { useNavigate } from "react-router-dom";
import { StarRating } from "@/components/StarRating";

const Products = ({ filters, setFilters }) => {
  const { data, isPending, error } = useProducts(filters);
  const navigate = useNavigate();

  const handleSelectProduct = (productSlug) => {
    navigate(`/products/${productSlug}`);
  };

  if (isPending) return <Spinner />;

  if (error) {
    return (
      <div className="mt-10 text-center text-red-500">
        Failed to load products. Please try again later.
      </div>
    );
  }

  const products = data?.data?.products || [];
  const pagination = data?.pagination || {};

  const goToPage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div>
      <h2 className="my-6 flex flex-col justify-between text-2xl font-semibold md:flex-row">
        <div>
          <span className="text-gray-500">Our </span>
          <span className="font-bold">Products</span>
          <hr className="mt-1 w-20 border-t-2 border-black sm:w-24" />
        </div>
        <div className="mt-6 md:mt-0">
          <ProductsFilter filters={filters} setFilters={setFilters} />
        </div>
      </h2>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, idx) => {
          let parsedSizes = [];
          try {
            if (Array.isArray(product.sizes) && product.sizes.length > 0) {
              parsedSizes = JSON.parse(product.sizes[0]);
            }
          } catch {
            parsedSizes = [];
          }

          return (
            <div
              key={product._id || idx}
              className="cursor-pointer overflow-hidden border"
              onClick={() => handleSelectProduct(product.slug)}
            >
              <div className="group relative overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full bg-white object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold">{product.name}</h3>

                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {product.description}
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm">
                  <StarRating rating={product.ratings} />
                  <span className="text-gray-400">
                    ({product.numReviews} review
                    {product.numReviews !== 1 ? "s" : ""})
                  </span>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  Sizes: {parsedSizes.join(", ")}
                </div>

                {product.discount > 0 && (
                  <div className="mt-2 text-sm text-red-500">
                    Discount: {product.discount}%
                  </div>
                )}

                <p className="mt-3 text-2xl font-bold text-gray-800">
                  Rs. {product.price}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          className="w-24 rounded border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
          disabled={!pagination.hasPrevPage}
          onClick={() => goToPage(pagination.currentPage - 1)}
        >
          Previous
        </button>

        <span className="flex items-center px-2">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>

        <button
          className="w-24 rounded border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
          disabled={!pagination.hasNextPage}
          onClick={() => goToPage(pagination.currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
