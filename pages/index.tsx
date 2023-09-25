import Image from 'next/image'
import { Inter } from 'next/font/google'
import Search from '../features/Search'
import Searches from '../features/Search2'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
   <>
   <Searches/>
   </>
  )
}
