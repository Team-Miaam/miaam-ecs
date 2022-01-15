/* eslint-disable no-new */
// eslint-disable-next-line max-classes-per-file
import { expect } from 'chai';
import { describe, test } from 'mocha';
import Position from '../../../src/component/Position.component.js';
import Entity from '../../../src/core/Entity.js';
import InterfaceError from '../../../src/error/Interface.error.js';
import IntegrationError from '../../../src/error/Integration.error.js';

describe('Entity', () => {
	class Player extends Entity {}

	describe('Abstraction', () => {
		test('Entity class is abstract', () => {
			expect(() => {
				new Entity();
			}).to.throw(InterfaceError, 'Entity class is abstract');
		});
	});

	describe('Interface', () => {});

	describe('Instantiation', () => {
		test('Entities can be instantiated after extending base class', () => {
			expect(() => new Player()).not.to.throw(Error);
		});
	});

	describe('Implementation', () => {
		describe('addComponent', () => {
			test('Entity cannot integrate components unless it is associated with a scene', () => {
				const player = new Player();
				expect(() => {
					player.addComponent({ id: 'position', component: new Position() });
				}).to.throw(IntegrationError, 'entity is not associated with a scene');
			});
		});
	});

	describe('Reliability', () => {});
});
