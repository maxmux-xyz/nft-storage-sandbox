import { NFTStorage, File } from 'nft.storage'
import * as dotenv from 'dotenv';
dotenv.config();

const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_API_KEY!
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })


export interface CreatorTokenMetadata {
    name: string
    description: string
    external_url: string
    image: File
    properties: {
        custom: string,
        file: File,
      }
    attributes: {
      trait_type: string
      value: string
    }[]
  }

async function makeMetadata(): Promise<CreatorTokenMetadata> {
    const videoUrl = 'https://your-video-url.mp4'
    let response = await fetch(videoUrl)
    const videoBuffer = await response.arrayBuffer()
    const video = new File([Buffer.from(videoBuffer)], `test_video.mp4`, {
      type: `video/mp4`,
    })

    const imgUrl = 'https://your-thumbnail-url.jpg'
    response = await fetch(imgUrl)
    const imageBuffer = await response.arrayBuffer()
    const image = new File([Buffer.from(imageBuffer)], `test_image.jpg`, {
      type: 'image/jpg',
    })
    const metadata = {
      name: 'testing video',
      description: 'testing video',
      external_url: 'testingvideo.com',
      image: image,
      properties: {
        custom: 'Onchain video',
        file: video,
      },
      attributes: [
        {
          trait_type: 'username',
          value: `username`,
        },
      ],
    }
    return metadata
}

export async function pinMetadata(metadata: CreatorTokenMetadata): Promise<string> {
    // returns the URL of the pinned metadata
    // `ipfs://${hash}`
    const upload = await client.store(metadata)
    return `ipfs://${upload.ipnft}`
  }


// Define a main function
async function main() {
    console.log("Hello, World!");
    const metadata = await makeMetadata()
    const url = await pinMetadata(metadata)
    console.log(url)
}

// Call the main function
main();
