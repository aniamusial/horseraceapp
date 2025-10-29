/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import { getOrdinal, getRoundLabel, getColorName } from '../formatters'

describe('formatters', () => {
  describe('getOrdinal', () => {
    it('should handle 1st, 2nd, 3rd', () => {
      expect(getOrdinal(1)).toBe('1st')
      expect(getOrdinal(2)).toBe('2nd')
      expect(getOrdinal(3)).toBe('3rd')
    })

    it('should handle 4th-10th', () => {
      expect(getOrdinal(4)).toBe('4th')
      expect(getOrdinal(5)).toBe('5th')
      expect(getOrdinal(6)).toBe('6th')
      expect(getOrdinal(7)).toBe('7th')
      expect(getOrdinal(8)).toBe('8th')
      expect(getOrdinal(9)).toBe('9th')
      expect(getOrdinal(10)).toBe('10th')
    })

    it('should handle 11th, 12th, 13th (special cases)', () => {
      expect(getOrdinal(11)).toBe('11th')
      expect(getOrdinal(12)).toBe('12th')
      expect(getOrdinal(13)).toBe('13th')
    })

    it('should handle 21st, 22nd, 23rd', () => {
      expect(getOrdinal(21)).toBe('21st')
      expect(getOrdinal(22)).toBe('22nd')
      expect(getOrdinal(23)).toBe('23rd')
    })

    it('should handle 31st, 32nd, 33rd', () => {
      expect(getOrdinal(31)).toBe('31st')
      expect(getOrdinal(32)).toBe('32nd')
      expect(getOrdinal(33)).toBe('33rd')
    })

    it('should handle numbers ending in 4-9 and 0', () => {
      expect(getOrdinal(14)).toBe('14th')
      expect(getOrdinal(24)).toBe('24th')
      expect(getOrdinal(25)).toBe('25th')
      expect(getOrdinal(100)).toBe('100th')
      expect(getOrdinal(101)).toBe('101st')
      expect(getOrdinal(102)).toBe('102nd')
      expect(getOrdinal(103)).toBe('103rd')
      expect(getOrdinal(104)).toBe('104th')
    })

    it('should handle 111th, 112th, 113th (special cases)', () => {
      expect(getOrdinal(111)).toBe('111th')
      expect(getOrdinal(112)).toBe('112th')
      expect(getOrdinal(113)).toBe('113th')
    })

    it('should handle 121st, 122nd, 123rd', () => {
      expect(getOrdinal(121)).toBe('121st')
      expect(getOrdinal(122)).toBe('122nd')
      expect(getOrdinal(123)).toBe('123rd')
    })

    it('should handle large numbers', () => {
      expect(getOrdinal(1000)).toBe('1000th')
      expect(getOrdinal(1001)).toBe('1001st')
      expect(getOrdinal(1011)).toBe('1011th')
      expect(getOrdinal(1021)).toBe('1021st')
    })

    it('should handle zero', () => {
      expect(getOrdinal(0)).toBe('0th')
    })
  })

  describe('getRoundLabel', () => {
    it('should return uppercase ordinal labels', () => {
      expect(getRoundLabel(1)).toBe('1ST')
      expect(getRoundLabel(2)).toBe('2ND')
      expect(getRoundLabel(3)).toBe('3RD')
      expect(getRoundLabel(4)).toBe('4TH')
      expect(getRoundLabel(11)).toBe('11TH')
      expect(getRoundLabel(21)).toBe('21ST')
    })
  })

  describe('getColorName', () => {
    it('should return correct color names for defined hex codes', () => {
      expect(getColorName('#FF6B6B')).toBe('Red')
      expect(getColorName('#4ECDC4')).toBe('Teal')
      expect(getColorName('#FFE66D')).toBe('Yellow')
      expect(getColorName('#A8E6CF')).toBe('Mint')
      expect(getColorName('#FF8B94')).toBe('Pink')
    })

    it('should return all defined color names', () => {
      const testCases = [
        { hex: '#FF6B6B', name: 'Red' },
        { hex: '#4ECDC4', name: 'Teal' },
        { hex: '#FFE66D', name: 'Yellow' },
        { hex: '#A8E6CF', name: 'Mint' },
        { hex: '#FF8B94', name: 'Pink' },
        { hex: '#C7CEEA', name: 'Lavender' },
        { hex: '#FFDAC1', name: 'Peach' },
        { hex: '#B4F8C8', name: 'Green' },
        { hex: '#FBE7C6', name: 'Cream' },
        { hex: '#A0E7E5', name: 'Aqua' },
        { hex: '#FFAEBC', name: 'Rose' },
        { hex: '#B4A7D6', name: 'Purple' },
        { hex: '#FFD3B6', name: 'Apricot' },
        { hex: '#DCEDC1', name: 'Lime' },
        { hex: '#FFA8A8', name: 'Coral' },
        { hex: '#A8DADC', name: 'Sky Blue' },
        { hex: '#F4ACB7', name: 'Salmon' },
        { hex: '#D4A5A5', name: 'Dusty Rose' },
        { hex: '#9EE09E', name: 'Sage' },
        { hex: '#FFB6B9', name: 'Blush' },
      ]

      testCases.forEach(({ hex, name }) => {
        expect(getColorName(hex)).toBe(name)
      })
    })

    it('should return "Unknown" for undefined hex codes', () => {
      expect(getColorName('#000000')).toBe('Unknown')
      expect(getColorName('#FFFFFF')).toBe('Unknown')
      expect(getColorName('#123456')).toBe('Unknown')
      expect(getColorName('not-a-color')).toBe('Unknown')
    })
  })
})
