import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

let rpcEndpoint = null

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}

export default function Home() {
  
  return (
    <div className="flex font-mono justify-center">
        <div className="shadow-xl mt-40 rounded-2xl mt-20 p-10 w-1/2 bg-indigo-700">
          <p className="text-white mb-8 text-2xl font-semibold">
            Welcome to Lock & Key
          </p>
          <p className='text-white mb-4'>
            We make it easy to mint an NFT to the Polygon network, and password protect the NFT so only the right person can collect the NFT!
          </p>
          <p className='text-white mb-4'>
            Polygon enables effectively zero gas fees so you don't have to worry about paying a bunch just to create an NFT!
          </p>

          <p className='text-white mb-4'>
            Go to "List" and you can pass in the desired information to make your own Polygon NFT. Then, tell whoever you want to mint it the password and they'll be able to find the specific NFT on the "Collect" page.
          </p>

          <p className='text-white text-small'>
            Just add https://rpc-mumbai.maticvigil.com network to your MetaMask wallet and get some test coins from Polygon faucet.
          </p>
        </div>
    
    </div>
  )
}
