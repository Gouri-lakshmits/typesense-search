import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { SYSTEM_CONFIG } from "@/apollo/queries/config";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import searchListStyle from "./styles/search_listing.module.scss"

const SearchListing = () => {
  const router = useRouter();
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAttribute, setSortAttribute] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const { data: configData } = useQuery(SYSTEM_CONFIG);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceFilters, setSelectedPriceFilters] = useState<string[]>(
    []
  );
  const [selectedSizeFilters, setselectedSizeFilters] = useState<string[]>([]);
  const [selectedCategoryFilters, setselectedCategoryFilters] = useState<
    string[]
  >([]);
  const [selectedNewnessFilters, setselectedNewnessFilters] = useState<
    string[]
  >([]);
  const [searchResults, setSearchResults] = useState<any[]>([]); // Store search results

  useEffect(() => {
    const productDetailsParam = router.query.productDetails;
    if (productDetailsParam) {
      try {
        const parsedProductDetails = JSON.parse(productDetailsParam as string);
        setProductDetails(parsedProductDetails);
        setSearchResults(parsedProductDetails);
      } catch (error) {
        console.error("Error parsing product details:", error);
      }
    }
  }, [router.query.productDetails]);

  const categoryCounts: Record<string, number> = {};

  searchResults.forEach((product) => {
    const category = product.category;
    if (category) {
      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    }
  });
  const sizeCounts: Record<string, number> = {};

  searchResults.forEach((product) => {
    const size = product.size;
    if (size) {
      if (sizeCounts[size]) {
        sizeCounts[size]++;
      } else {
        sizeCounts[size] = 1;
      }
    }
  });

  const handleSizeFilterChange = (size: string) => {
    if (selectedSizeFilters.includes(size)) {
      setselectedSizeFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== size)
      );
    } else {
      setselectedSizeFilters((prevFilters) => [...prevFilters, size]);
    }
  };

  const colorCounts: Record<string, number> = {};

  searchResults.forEach((product) => {
    const color = product.color;
    if (color) {
      if (colorCounts[color]) {
        colorCounts[color]++;
      } else {
        colorCounts[color] = 1;
      }
    }
  });
  const priceCounts: Record<string, number> = {};

  searchResults.forEach((product) => {
    const price = product.price;
    if (price) {
      if (priceCounts[price]) {
        priceCounts[price]++;
      } else {
        priceCounts[price] = 1;
      }
    }
  });
  const newnessCounts: Record<string, number> = {};
  searchResults.forEach((product) => {
    const newness = product.newness;
    if (newness) {
      if (newnessCounts[newness]) {
        newnessCounts[newness]++;
      } else {
        newnessCounts[newness] = 1;
      }
    }
  });

  const handleNewnessFilterChange = (newness: string) => {
    if (selectedNewnessFilters.includes(newness)) {
      setselectedNewnessFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== newness)
      );
    } else {
      setselectedNewnessFilters((prevFilters) => [...prevFilters, newness]);
    }
  };


  const handleColorFilterChange = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors((prevFilters) => prevFilters.filter((filter) =>  filter !== color));
    } else {
      setSelectedColors((prevFilters) => [...prevFilters, color]);
    }
  };
  const uniquePriceValues = Array.from(
    new Set(searchResults.map((product) => product.price))
  );

  const uniquecategoryValues = Array.from(
    new Set(searchResults.map((product) => product.category))
  );

  const uniquecolorsValues = Array.from(
    new Set(searchResults.map((product) => product.color))
  );

  const uniquesizeValues = Array.from(
    new Set(searchResults.map((product) => product.size))
  );

  const uniqueNewValues = Array.from(
    new Set(searchResults.map((product) => product.new))
  );

  const totalPages = Math.ceil(searchResults.length / productsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredProducts = productDetails.filter(
      (item) =>
        item.product_name.toLowerCase().includes(query) ||
        item.product_name.toLowerCase().startsWith(query)
    );

    setSearchResults(filteredProducts);
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

  const handlePriceFilterChange = (priceValue: string) => {
    if (selectedPriceFilters.includes(priceValue)) {
      setSelectedPriceFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== priceValue)
      );
    } else {
      setSelectedPriceFilters((prevFilters) => [...prevFilters, priceValue]);
    }
  };

  const handleCategoryFilterChange = (category: string) => {
    if (selectedCategoryFilters.includes(category)) {
      setselectedCategoryFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== category)
      );
      console.log("category in if ", category);
    } else {
      setselectedCategoryFilters((prevFilters) => [...prevFilters, category]);
      console.log("category in else ", category);
    }
  };

  const filteredProducts = searchResults.filter((item) => {
    const passesCategoryFilter =
    selectedCategoryFilters.length === 0 ||
    selectedCategoryFilters.includes(item?.category);
    const passesColorFilter =
      selectedColors.length === 0 || selectedColors.includes(item?.color);
    const passesSizeFilter =
      selectedSizeFilters.length === 0 ||
      selectedSizeFilters.includes(item?.size);
    const passesNewnessFilter =
      selectedNewnessFilters.length === 0 ||
      selectedNewnessFilters.includes(item?.newness);
    const hasPriceFilter = selectedPriceFilters.length > 0;
    const passesPriceFilter =
      !hasPriceFilter || selectedPriceFilters.includes(item?.price);

    return (
      passesCategoryFilter &&
      passesColorFilter &&
      passesSizeFilter &&
      passesNewnessFilter &&
      passesPriceFilter
    );
  });
  console.log("filteredProducts", filteredProducts);
  console.log("Category Counts:", categoryCounts);
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
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <div className={searchListStyle.search_list_main}>
      <h1>Search Listing Page</h1>
      <div className="search_area_wrapper">

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

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sortAttribute}
          onChange={(e) => handleSortChange(e.target.value)}
        >
        
          {configData?.typeseSenseSystemConfig.search_result.sort_option.map(
            (option: any) => (

              <MenuItem key={option.attribute} value={option.attribute}>            
                {option.label}
              </MenuItem>
            )
          )}
        </Select>
      </div>
      </div>

      <div>
        <div>
          <label>Price:</label>
          {uniquePriceValues.map((priceValue: string) => (
            <label key={priceValue}>
              <input
                type="checkbox"
                value={priceValue}
                checked={selectedPriceFilters.includes(priceValue)}
                onChange={() => handlePriceFilterChange(priceValue)}
              />
              {`${priceValue} (${priceCounts[priceValue] || 0})`}{" "}
       
            </label>
          ))}
        </div>
        <div>
          <label>Category:</label>
          {uniquecategoryValues.map((category: string) => (
            <label key={category}>
              <input
                type="checkbox"
                value={category}
                checked={selectedCategoryFilters.includes(category)}
                onChange={() => handleCategoryFilterChange(category)}
              />
                 {`${category} (${categoryCounts[category] || 0})`} 
           
            </label>
          ))}
        </div>
        <div>
          <label>Color:</label>
          {uniquecolorsValues.map((color: string) => (
            <label key={color}>
              <input
                type="checkbox"
                value={color}
                checked={selectedColors.includes(color)}
                onChange={() => handleColorFilterChange(color)}
              />
              {`${color} (${colorCounts[color] || 0})`}
            </label>
          ))}
        </div>

        <div>
          <label>Size:</label>
          {uniquesizeValues.map((size: string) => (
            <label key={size}>
              <input
                type="checkbox"
                value={size}
                checked={selectedSizeFilters.includes(size)}
                onChange={() => handleSizeFilterChange(size)}
              />
              {`${size} (${colorCounts[size] || 0})`}
            </label>
          ))}
        </div>

        <div>
          <label>New:</label>
          {uniqueNewValues.map((newness: string) => (
            <label key={newness}>
              <input
                type="checkbox"
                value={newness}
                checked={selectedNewnessFilters.includes(newness)}
                onChange={() => handleNewnessFilterChange(newness)}
              />
              {`${newness} (${newnessCounts[newness] || 0})`}
            </label>
          ))}
        </div>
      </div>
      <ul className="search_list_item_wrapper">
        {displayedProducts.map((item, index) => (
          <div className="card" key={index}>
            <img src={item.image_url} alt="Denim Jeans" />
            <h1>{item.product_name}</h1>
            <p className="price">{item.price}</p>
            <p>{item.sku}</p>
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
