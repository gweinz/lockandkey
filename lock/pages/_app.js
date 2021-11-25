import '../styles/globals.css'
import Link from 'next/link'

function Marketplace({ Component, pageProps }) {
  return (
    <div>
      <nav className="flex fixed w-full font-mono justify-start  border-b bg-indigo-700 flex p-6">
      <Link href="/">
        <a className="text-4xl text-white font-bold">Lock & Key</a>
      </Link>
        <div className=" mt-4">
        
          <Link href="/create-item">
            <a className=" mx-10  text-white hover:text-indigo-200">
              List
            </a>
          </Link>

          <Link href="/collect">
            <a className="mr-10 text-white hover:text-indigo-200">
              Collect
            </a>
          </Link>

          <Link href="/my-assets">
            <a className="text-white hover:text-indigo-200">
              My NFTs
            </a>
          </Link>
        
        
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace