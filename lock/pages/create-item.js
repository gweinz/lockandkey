import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({password: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url)
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket() {
    const { name, description, password } = formInput
    if (!name || !description || !password || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, password, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      console.log(url)
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

  
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
 
    transaction = await contract.createMarketItem(nftaddress, tokenId)
    await transaction.wait()
    router.push('/')
  }

  return (
    <div className="flex font-mono justify-center">
      <div className="w-1/2 mt-40 flex border bg-indigo-700 border-bg-gray-100 p-10 rounded-2xl mt-10 flex-col ">
        <p className='text-xl text-white font-semibold'>
          List NFT
        </p>
        <input 
          placeholder="Asset Name"
          className="mt-4 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Password"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, password: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4 text-white"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mx-auto mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={createMarket} className="font-bold  mt-4 bg-white text-indigo-700 rounded-2xl p-4 shadow-lg hover:bg-indigo-200">
          Create
        </button>
      </div>
    </div>
  )
}