/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { describe, test } from 'mocha';
import Component from '../src/Component.js';
import SchemaNotDefinedException from '../src/exceptions/SchemaNotDefinedException.js';

describe('Component', () => {
	describe('component class can be extended', () => {
		class ComponentA extends Component {}

		describe('component can have its own schema', () => {
			test('schema cannot be null or undefined', () => {
				expect(() => ComponentA.setSchema(null)).to.throw(
					SchemaNotDefinedException,
					'Provided schema is either null or undefined.'
				);
				expect(() => ComponentA.setSchema(undefined)).to.throw(
					SchemaNotDefinedException,
					'Provided schema is either null or undefined.'
				);
			});
		});
	});
});