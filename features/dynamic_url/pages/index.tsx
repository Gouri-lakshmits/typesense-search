import React from 'react'
import { DynamicUrlProps } from '../utils/getServerSideProps'

const index = ({categories}: DynamicUrlProps) => {
  console.log("categories", categories);
    
  return (  
    <div>{categories?.name}</div>
  )
}

export default index