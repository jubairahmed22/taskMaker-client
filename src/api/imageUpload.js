export const imageUpload = async image => {
  console.log(image)
  if (image) {
    const formData = new FormData()
    formData.append('image', image)
    const url = `https://api.imgbb.com/1/upload?key=3aab628f129005fa6716e3877d1a82c1`

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    return data
  }
}
