import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Typesense from 'typesense';
import { SEARCH_QUERY } from '@/apollo/queries/search';
import searchStyles from './styles/search.module.scss'
import { SYSTEM_CONFIG } from '../apollo/queries/config';

const Search = () => {
  const [sortField, setSortField] = useState('product_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: configData, loading: configLoading, error: configError } = useQuery(
    SYSTEM_CONFIG
  );
  const { data: searchData, loading: searchLoading, error: searchError } = useQuery(
    SEARCH_QUERY,
    {
      variables: { keyword: searchQuery },
      skip: searchQuery.trim() === '',
    }
  );

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      handleSearch();
    }
  }, [searchQuery, sortField, sortOrder]);

  const handleSearch = async () => {
    try {
      if (configData) {
        const typesenseClient = new Typesense.Client({
          nodes: [
            {
              host: configData.typeseSenseSystemConfig.general.node,
              port: configData.typeseSenseSystemConfig.general.port,
              protocol: configData.typeseSenseSystemConfig.general.protocol,
            },
          ],
          apiKey: configData.typeseSenseSystemConfig.general.admin_api_key,
          connectionTimeoutSeconds: 2,
        });
        const searchParameters = {
          q: searchQuery,
          query_by: 'product_name',
        };
        const searchResults = await typesenseClient
          .collections(configData.typeseSenseSystemConfig.general.index_name)
          .documents()
          .search(searchParameters);
        console.log('Typesense Search results:', searchResults);
      }
    } catch (error) {
      console.error('Typesense search error:', error);
    }
  };

  const handleSubmit = (e : any) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className={searchStyles.search}>
          <form onSubmit={handleSubmit} className='search_form'>
      <input
        type="text"
        className="searchInput"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* <button type="submit">Search</button> */}
      {searchLoading ? (
        <p>Loading...</p>
      ) : searchError ? (
        <p>Error: {searchError.message}</p>
      ) : (
        <div className='search'>
          {searchData && (
            <div>
              {searchData.resultPage.productItems.map((product:any) => (
                <div key={product.sku}>
                  <p>Product Name: {product.product_name}</p>
                  <p>Price: {product.price}</p>
                  <p>SKU: {product.sku}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </form>
    </div>
  );
};

export default Search;
