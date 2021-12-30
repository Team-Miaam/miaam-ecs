/* eslint-disable no-new */
import { expect } from 'chai';
import { describe, test } from 'mocha';
import Entity from '../../src/core/Entity.js';
import InterfaceError from '../../src/error/InterfaceError.js';

describe('Entity', () => {
	describe('Abstraction', () => {
		test('Entity class is abstract', () => {
			expect(() => {
				new Entity();
			}).to.throw(InterfaceError, 'Entity class is abstract');
		});
	});
});
