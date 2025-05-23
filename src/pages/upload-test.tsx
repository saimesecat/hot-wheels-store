import React, { useState } from 'react'

export default function ImageUploadTest() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0])
      setResult(null)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file first')
      return
    }

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'Upload failed')
        return
      }

      const data = await res.json()
      setResult(`Upload successful! File saved as: ${data.filename}`)
      setError(null)
    } catch (err) {
      setError('Upload error: ' + (err as Error).message)
    }
  }

  return (
    <div>
      <h2>Test Image Upload</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {result && <p style={{ color: 'green' }}>{result}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
