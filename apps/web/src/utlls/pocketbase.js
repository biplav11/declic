import Pocketbase from 'pocketbase'

const pb = new Pocketbase('http://127.0.0.1:8090')

export function getFullRequest(collection, sort) {
    return pb.collection(collection).getFullList({
        sort,
        requestKey: null
    })
}

export function getImageUrl(image, collection, id) {
    return `${process.env.NEXT_PUBLIC_BASEURL}/files/${collection}/${id}/${image}`
}

export default pb
