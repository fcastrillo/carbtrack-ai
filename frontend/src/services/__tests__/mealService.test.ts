import { describe, it, expect } from 'vitest'
import { validateImageFile } from '../mealService'

describe('mealService', () => {
  describe('validateImageFile', () => {
    it('accepts valid JPEG file under 5MB', () => {
      const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 })
      const result = validateImageFile(file)
      expect(result.ok).toBe(true)
    })
    it('rejects file over 5MB', () => {
      const file = new File(['x'], 'big.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 })
      const result = validateImageFile(file)
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.message).toContain('grande')
    })
    it('rejects unsupported type', () => {
      const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' })
      Object.defineProperty(file, 'size', { value: 1024 })
      const result = validateImageFile(file)
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.message).toContain('Formato')
    })
  })
})
