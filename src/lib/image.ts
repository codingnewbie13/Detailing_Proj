// Image helpers — read files from a worker's phone and downscale them to
// small JPEG data URLs so they fit comfortably in localStorage for the demo.

const MAX_DIM = 900
const QUALITY = 0.72

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function downscale(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      const scale = Math.min(1, MAX_DIM / Math.max(width, height))
      width = Math.round(width * scale)
      height = Math.round(height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(dataUrl)
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', QUALITY))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

/** Process a FileList/array of image files into compact data URLs. */
export async function filesToImages(files: FileList | File[]): Promise<string[]> {
  const arr = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, 6)
  const out: string[] = []
  for (const f of arr) {
    try {
      const raw = await fileToDataURL(f)
      out.push(await downscale(raw))
    } catch {
      // ignore a bad file
    }
  }
  return out
}
