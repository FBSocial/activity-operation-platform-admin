import { useEffect, useState } from 'react'
import { PhotoSlider } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
export default function ImageView({
  images = [],
  index = 0,
  visible,
  onClose,
  afterClose,
}: {
  images?: { src: string }[]
  index?: number
  visible: boolean
  onClose: () => void
  afterClose: () => void
}) {
  const [innerIndex, setInnerIndex] = useState(index)

  useEffect(() => {
    setInnerIndex(index)
  }, [index])

  return (
    <PhotoSlider
      images={images.map((item, index) => ({ src: item.src, key: index }))}
      visible={visible}
      onClose={onClose}
      afterClose={afterClose}
      index={innerIndex}
      onIndexChange={setInnerIndex}
    />
  )
}
