import { expect } from 'chai';
import { describe, test } from 'mocha';

import ComponentPool from '../../../src/core/ComponentPool.js';
import InterfaceError from '../../../src/error/Interface.error.js';
import Position from '../../mock/component/Position.component.js';

describe.skip('Component Pool', () => {
	const position = new Position();

	describe('Instantiation', () => {});

	describe('Implementation', () => {
		describe('malloc', () => {
			test('malloc returning correct indexes after successful allocation', () => {
				const positionPool = new ComponentPool({ type: Position, size: 50 });
				expect(positionPool.malloc(position)).to.equals(0);
				expect(positionPool.malloc(position)).to.equals(1);
				expect(positionPool.malloc(position)).to.equals(2);
				expect(positionPool.malloc(position)).to.equals(3);
			});

			test('throwing interface error when the pool is full', () => {
				const positionPool = new ComponentPool({ type: Position, size: 3 });

				expect(() => {
					positionPool.malloc(position);
					positionPool.malloc(position);
					positionPool.malloc(position);
					positionPool.malloc(position);
				}).to.throw(InterfaceError, 'pool size limit reached');
			});
		});

		describe('free', () => {
			test('freeing a component from component pool', () => {
				const positionPool = new ComponentPool({ type: Position, size: 8 });
				positionPool.malloc(position);
				positionPool.malloc(position);
				positionPool.malloc(position);
				positionPool.malloc(position);
				positionPool.malloc(position);
				positionPool.malloc(position);
				positionPool.malloc(position);
				positionPool.free(1);
				positionPool.free(2);
				expect(positionPool.malloc(position)).to.equals(2);
				expect(positionPool.malloc(position)).to.equals(1);
				expect(positionPool.malloc(position)).to.equals(7);
				positionPool.free(2);
			});
		});

		describe('componentAt', () => {
			test('get component at free index', () => {
				const positionPool = new ComponentPool({ type: Position, size: 8 });
				positionPool.malloc(position);
				positionPool.malloc(position);
				positionPool.free(1);
				expect(() => {
					positionPool.componentAt(1);
				}).to.throw(InterfaceError, 'memory at asked index is marked as free');
			});
		});
	});
});
