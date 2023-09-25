import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { SYSTEM_CONFIG } from "@/apollo/queries/config";

const SearchListing = () => {
  const router = useRouter();
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAttribute, setSortAttribute] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const { data: configData } = useQuery(SYSTEM_CONFIG);

  useEffect(() => {
    const productDetailsParam = router.query.productDetails;
    if (productDetailsParam) {
      try {
        const parsedProductDetails = JSON.parse(
          productDetailsParam as string
        );
        setProductDetails(parsedProductDetails);
      } catch (error) {
        console.error("Error parsing product details:", error);
      }
    }
  }, [router.query.productDetails]);

  const filteredProducts = productDetails.filter((item) =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.product_name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push({
      pathname: router.pathname,
      query: { ...router.query, search: searchQuery },
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (attribute: string) => {
    if (attribute === sortAttribute) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortAttribute(attribute);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    const sortedProducts = filteredProducts.slice().sort((a, b) => {
      if (sortAttribute && sortOrder) {
        const valueA = a[sortAttribute];
        const valueB = b[sortAttribute];
        if (valueA !== undefined && valueB !== undefined) {
          if (sortOrder === "asc") {
            return valueA.localeCompare(valueB);
          } else {
            return valueB.localeCompare(valueA);
          }
        }
      }
      return 0;
    });
    setDisplayedProducts(sortedProducts);
  }, [sortAttribute, sortOrder, filteredProducts]);
  
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);

  const sortOptions = configData?.typeseSenseSystemConfig.search_result.sort_option || [];

  const filter =  configData?.typeseSenseSystemConfig.search_result.search_filters || [];
  console.log("filter",filter);

  return (
    <div>
      <h1>Search Listing Page</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search Products"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </form>
      <div>
        <label>Sort by:</label>
        <select
          onChange={(e) => handleSortChange(e.target.value)}
          value={sortAttribute}
        >
          <option value="">-- Select --</option>
          {sortOptions.map((option:any) => (
            <option key={option.attribute} value={option.attribute}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {displayedProducts.map((item, index) => (
          <div className="card" key={index}>
            <img src={item.image_url} alt="Denim Jeans" />
            <h1>{item.product_name}</h1>
            <p className="price">{item.price}</p>
            <p>
          {item.sku}
            </p>
          </div>
        ))}
      </ul>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchListing;
