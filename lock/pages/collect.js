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
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [enteredState, setEnteredState] = useState('not-entered')
  const [formInput, updateFormInput] = useState({password: ''})

  // useEffect(() => {
  //   loadNFTs()
  // }, [])
  async function enterPassword() {
    const { password } = formInput
    setEnteredState('entered') 
    loadNFTs(password)
  }
  async function loadNFTs(pwd) {    
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let item = {
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        password:meta.data.password
      }
      if (meta.data.password == pwd) {
        
        return item
        }
    })).then(items => items.filter(x => x !== undefined))
    setNfts(items)
    console.log(nfts)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const transaction = await contract.createMarketSale(nftaddress, nft.itemId)
    await transaction.wait()
    loadNFTs()
  }
  if(enteredState == 'not-entered') 

  return (
    <div className="flex justify-center">
      <div className="w-1/3 mt-40 flex border bg-indigo-700 border-bg-gray-100 p-10 rounded-2xl mt-10 flex-col ">
        <p className='text-white mb-2 font-bold'>Entered password for protected NFT</p>
        <input type="text" name="password" id="password" 
        className="focus:border-indigo-700 focus:text-indigo-700 mb-5 block w-full p-3 sm:text-sm border border-indigo-700 rounded" placeholder="password..."
        onChange={e => updateFormInput({ ...formInput, password: e.target.value })}/>
        <button className="w-full bg-white text-indigo-700 font-bold py-2 px-12 border-indigo-700 rounded border brounded hover:bg-indigo-500 hover:text-white" onClick={() => enterPassword()}>Enter</button>
        
      </div>
    </div>

  )
  if (loadingState === 'loaded' && !nfts.length) 
  return (<div className="flex justify-center">
  <div className="grid grid-cols-1 mt-40 gap-4 pt-4">
   <p className="font-semibold text-2xl text-indigo-700">Nothing to see here...</p>
   <p className="font-semibold text-small text-indigo-700">Either password was wrong or NFT does not exist</p>
  </div>
 </div>)
 
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 mt-40 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border w-1/3 shadow-2xl mx-auto rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-8 bg-indigo-700">
                  <button className="w-full bg-white text-indigo-700 font-bold py-2 px-12 rounded hover:bg-indigo-500 hover:text-white" onClick={() => buyNft(nft)}>Collect</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}