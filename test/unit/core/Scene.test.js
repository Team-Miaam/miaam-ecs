/* eslint-disable no-new */
import { expect } from 'chai';
import { describe, test } from 'mocha';
import Scene from '../../../src/core/Scene.js';
import InterfaceError from '../../../src/error/Interface.error.js';

describe.skip('Scene', () => {
	describe('Abstraction', () => {
		test('Scene class is abstract', () => {
			expect(() => {
				new Scene();
			}).to.throw(InterfaceError, 'Scene class is abstract');
		});
	});

	describe('Interface', () => {});

	describe('Instantiation', () => {
		class MainScene extends Scene {}
		expect(() => {
			new MainScene();
		}).not.to.throw(Error);
	});

	describe('Implementation', () => {});

	describe('Reliability', () => {});
});
