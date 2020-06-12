import {request} from "./request.js"

export function getHomeMultidata(){
  return request({
    url:'/home/multidata'
  })
}

export function getHomeGoods(type , page){
return request({
    url:'/home/data',
    params:{
      type,
      page
    }
  })
}

// let totalNums = []
// const nums1 = [20,11,22]
// const nums2 = [202,121,222]


// totalNums.push(...nums1)



// for (let n of nums1){
//   totalNums.push(n)
// }
