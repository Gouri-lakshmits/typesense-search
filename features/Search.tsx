import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Typesense from "typesense";
import searchStyles from "./styles/search.module.scss";
import { SYSTEM_CONFIG } from "../apollo/queries/config";
import Link from "next/link";
import { useRouter } from "next/router";
import useTypesenseClient from "./Typesense";

export type ResultType = {
  facet_counts?: [];
  hits?: {
    document: {
      product_name: string;
      image_url: string;
      category?: [];
      id: string;
      price: string;
      sku: string;
      created_at: string;
    };
  }[];
};
type CategoryType = {
  facet_counts?: [];
  hits?: {
    document: {
      category_name: string;
      url: string;
      category_id: string;
      path: string;
    };
  }[];
};

export type ResultPageType = {
  facet_counts?: [];
  hits?: {
    document: {
      page_title: string;
      page_id: string;
      url: string;
    };
  }[];
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("product_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchResult, setSearchResult] = useState<ResultType>({});
  const [visibleResults, setVisibleResults] = useState<number>(4);
  const [categorySearch, setCategorySearch] = useState<CategoryType>({});
  const [pagesSearch, setPagesSearch] = useState<ResultPageType>({});
  const [productSuggestions, setProductSuggestions] = useState<ResultType>({});
  const router = useRouter();
 
  const typesenseClient = useTypesenseClient();

  const handleSearch = async () => {
    try {
      const searchParameters = {
        q: searchQuery,
        query_by: "product_name",
      };
      const searchResults = await typesenseClient
        .collections("magento2server_products")
        .documents()
        .search(searchParameters);
      setSearchResult(searchResults as any);
      setProductSuggestions(searchResults as any);
    } catch (error) {
      console.error("Typesense search error:", error);
    }
  };
  const handlePageSearch = async (searchArg: string) => {
    try {
      const searchParameters = {
        q: searchArg,
        query_by: "page_title",
      };
      const searchPages = await typesenseClient
        .collections("magento2server_pages")
        .documents()
        .search(searchParameters);
      setPagesSearch(searchPages as any); 
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategorySearch = async (searchArg: string) => {
    try {
      const searchParameters = {
        q: searchArg,
        query_by: "category_name",
      };
      const SearchCategory = await typesenseClient
        .collections("magento2server_categories")
        .documents()
        .search(searchParameters);
      setCategorySearch(SearchCategory as any);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      handleSearch();
    } else {
      setSearchResult({ hits: [] });
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      handleCategorySearch(searchQuery);
    } else {
      setCategorySearch({ hits: [] });
    }
  }, [searchQuery]);
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      handlePageSearch(searchQuery);
    } else {
      setPagesSearch({ hits: [] });
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
    const searchResultsQuery = JSON.stringify(
      searchResult.hits?.map((item) => item.document)
    );
    router.push({
      pathname: "/search",
      query: { productDetails: searchResultsQuery },
    });
  };
  const url = pagesSearch?.hits?.map((i) => {
    const pathname = new URL(i.document.url).pathname;
    return pathname;
  });

  const pageUrl = url?.map((pages) => pages);

  return (
    <div className={searchStyles.search}>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="searchInput"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchQuery.trim() !== "" && (
          <div className={"instant-search-result"}>
           <div className="category">
              <h3>Suggestions</h3>
              {productSuggestions.hits && productSuggestions.hits.length > 0 ? (
                <>
                  {productSuggestions.hits?.map((item) => (
                    <p
                      key={item.document.id}
                      onClick={() => {
                        // Replace 'product_name' with the appropriate field name
                        const suggestionQuery =  JSON.stringify(
                          searchResult.hits?.map((item) => item.document));
                        router.push({
                          pathname: "/search", 
                          query: { productDetails: suggestionQuery },
                        });
                      }}
                    >
                      {item.document.product_name}
                    </p>
                  ))}
                </>
              ) : (
                <p>No pages found</p>
              )}
            </div>

            <div className="category">
              <h3 className="instant-search-head">Category</h3>
              {categorySearch.hits?.length ? (
                <>
                  <div>
                    {categorySearch.hits?.map((i) => (
                      <div
                        key={i.document.category_name}
                        className="instant_search_item"
                      >
                        <p
                          className="instant-search-category-list"
                          onClick={() => {
                            const searchResultsQuery = JSON.stringify(
                              searchResult.hits?.map((item) => item.document)
                            );
                            router.push({
                              pathname: "/search",
                              query: { productDetails: searchResultsQuery },
                            });
                          }}
                        >
                          {i.document.category_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="instant-search-category-list">No products</p>
                </>
              )}
              <h3>Pages</h3>
              {pagesSearch.hits && pagesSearch.hits.length > 0 ? (
                pagesSearch.hits?.map((pages, index) => (
                  <Link href={pageUrl?.[index] as any} key={index}>
                    <p key={pages.document.page_id}>
                      {pages.document.page_title}
                    </p>
                  </Link>
                ))
              ) : (
                <p>No pages found</p>
              )}
            </div>
            <div className="category">
              <h3>Products</h3>
              <div className=" category instant-search-product-table">
                {searchResult.hits && searchResult.hits.length > 0 ? (
                  <>
                    {searchResult.hits?.slice(0, visibleResults).map((item) => (
                      <div
                        className="instant-search-product-row"
                        key={item.document.id}
                      >
                        <div className="product-image-container">
                          <img
                            src={item.document.image_url}
                            alt={item.document.product_name}
                            className="instant-search-product-image"
                          />
                          <div>
                            <p className={"instant-search-products"}>
                              {item.document.product_name}
                            </p>
                            {item.document.sku && (
                              <p className="instant-search-product-list">
                                sku: {item.document.sku}
                              </p>
                            )}
                            <p className="instant-search-product-list">
                              {item.document.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>No Products</p>
                )}
                <div className="instant_search_viewMore_wrapper">
                  {searchResult.hits?.length &&
                  searchResult.hits.length > visibleResults ? (
                    <div className="instant-search-viewMore">
                      <button
                        className={"instant-search-viewMoreButton"}
                        onClick={() => {
                          const searchResultsQuery = JSON.stringify(
                            searchResult.hits?.map((item) => item.document)
                          );
                          router.push({
                            pathname: "/search",
                            query: { productDetails: searchResultsQuery },
                          });
                        }}
                      >
                        view all
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;
