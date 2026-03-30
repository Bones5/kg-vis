import { describe, expect, it } from 'vitest';
import { getDeviceBudget, getDeviceClass, getNodeBudget } from './device';

describe('device budget utilities', () => {
  it('returns expected node budgets by width', () => {
    expect(getNodeBudget(1400)).toBe(4000);
    expect(getNodeBudget(900)).toBe(2500);
    expect(getNodeBudget(600)).toBe(1500);
    expect(getNodeBudget(599)).toBe(800);
  });

  it('returns expected device class by width', () => {
    expect(getDeviceClass(1200)).toBe('desktop');
    expect(getDeviceClass(600)).toBe('tablet');
    expect(getDeviceClass(320)).toBe('mobile');
  });

  it('builds maxEdges from maxNodes', () => {
    expect(getDeviceBudget(900)).toEqual({
      maxNodes: 2500,
      maxEdges: 7500,
      deviceClass: 'tablet',
    });
  });
});
