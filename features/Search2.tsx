import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Typesense from "typesense";
import { SEARCH_QUERY } from "@/apollo/queries/search";
import searchStyles from "./styles/search.module.scss";
import { SYSTEM_CONFIG } from "../apollo/queries/config";
import Link from "next/link";
import { useRouter } from "next/router";
import index from "./dynamic_url/pages";

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

  const router = useRouter();
  const {
    data: configData,
    loading: configLoading,
    error: configError,
  } = useQuery(SYSTEM_CONFIG);
  const typesenseClient = new Typesense.Client({
    nodes: [
      {
        host: configData?.typeseSenseSystemConfig.general.node,
        port: configData?.typeseSenseSystemConfig.general.port,
        protocol: configData?.typeseSenseSystemConfig.general.protocol,
      },
    ],
    apiKey: "izunSdbDxLEhLDtETOKnG3n8kTAXx2JF",
    connectionTimeoutSeconds: 2,
  });
  console.log(
    "API Key:",
    configData?.typeseSenseSystemConfig.general.admin_api_key
  );
  // useEffect(() => {
  //   if (searchQuery.trim() !== '') {
  //     handleSearch();
  //   }
  // }, [searchQuery, sortField, sortOrder]);

  const handleSearch = async () => {
    try {
      const searchParameters = {
        q: searchQuery,
        query_by: "product_name",
        // filter_by : "price:=[$45.00]"
      };
      const searchResults = await typesenseClient
        .collections("magento2server_products")
        .documents()
        .search(searchParameters);
      setSearchResult(searchResults as any);
      console.log("Search results:", searchResults);
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
      setPagesSearch(searchPages as any); // Create a state variable for pages
      console.log("pages", searchPages);
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
      console.log("category_name", SearchCategory);
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

const pageUrl = url?.map((pages)=>pages)
console.log("url",pageUrl);

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
              <p>No pages found</p>
            </div>
            <div>
              <div className="category">
              <h3 className="instant-search-head">Category</h3>
                {categorySearch.hits?.length ? (
                  <>
                    <div>
                    {categorySearch.hits?.map((i) => (
                      <div key={i.document.category_name} className="instant_search_item">
                        {/* <Link href={`/${decodeURIComponent(i.document.path)}.html`}> */}
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
                          // onClick={() => handleCategorySelect(i.document)}
                        >
                          {i.document.category_name}
                        </p>
                        {/* </Link> */}
                      </div>
                    ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="instant-search-head">Category</h3>
                    <p className="instant-search-category-list">No products</p>
                  </>
                )}
              </div>
              <div>
                <h3>Pages</h3>
                {pagesSearch.hits && pagesSearch.hits.length > 0 ? (
                  pagesSearch.hits?.map((pages , index) => (
                    // url?.map((urls,index) => (
                      <Link href={pageUrl?.[index] as any} key={index} >
                      <p key={pages.document.page_id}>{pages.document.page_title}</p>
                      </Link>
                    ))
                  // ))
                ) : (
                  <p>No pages found</p>
                )}
              </div>
            </div>
            <div className="instant-search-product-table">
              <h3>Products</h3>
              {searchResult.hits && searchResult.hits.length > 0 ? (
                <div>
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
                </div>
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
        )}
      </form>
    </div>
  );
};

export default Search;
