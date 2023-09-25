import React from 'react'
import { DynamicUrlProps } from '../utils/getServerSideProps'

const index = ({categories}: DynamicUrlProps) => {
  console.log("categories", categories);
    
  return (  
    <div>index</div>
  )
}

export default index