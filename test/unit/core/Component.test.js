/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */
import { expect } from 'chai';
import { describe, test } from 'mocha';

import Component from '../../../src/core/Component.js';
import Type from '../../../src/core/Type.js';
import * as PrimitiveTypes from '../../../src/type/PrimitiveTypes.js';
import IllegalArgumentError from '../../../src/error/IllegalArgument.error.js';
import InterfaceError from '../../../src/error/Interface.error.js';

describe('Component', () => {
	const positionSchema = {
		x: { type: PrimitiveTypes.Number },
		y: { type: PrimitiveTypes.Number },
	};

	describe('Abstraction', () => {
		test('Component class is abstract', () => {
			expect(() => {
				new Component();
			}).to.throw(InterfaceError, 'Component class is abstract');
		});

		test('setSchema cannot be called on Component class', () => {
			expect(() => {
				Component.setSchema(positionSchema);
			}).to.throw(InterfaceError, 'Component class is abstract');
		});
	});

	describe('Schema Validation Requirement', () => {
		test('Components cannot be instantiated without setting valid schema', () => {
			class ComponentA extends Component {}
			expect(() => new ComponentA()).to.throw(InterfaceError, 'schema is undefined');
		});

		test('Component setSchema implements isValidSchema', () => {
			class ComponentA extends Component {}
			expect(() => ComponentA.setSchema({})).to.throw(IllegalArgumentError, 'schema is invalid');
			expect(() => ComponentA.setSchema({ x: 'int', y: 'int' })).to.throw(IllegalArgumentError, 'schema is invalid');
		});

		test('Different schema of two different components are different', () => {
			class ComponentA extends Component {}
			class ComponentB extends Component {}

			ComponentA.setSchema({ x: { type: PrimitiveTypes.Number } });
			ComponentB.setSchema({ name: { type: PrimitiveTypes.String } });
			expect(ComponentA.schema).to.not.equals(ComponentB.schema);
		});
	});

	describe('Interface', () => {
		class Position extends Component {}

		test('Class must have static setSchema method', () => {
			expect(Position.setSchema instanceof Function).to.be.true;
		});

		Position.setSchema(positionSchema);
		const playerPosition = new Position();
		test('Instances of Component must have access to props', () => {
			expect(playerPosition.props).to.exist;
		});

		test('Instances of Component should be able to update props', () => {
			expect(playerPosition.update instanceof Function).to.be.true;
			expect(playerPosition.update.length).equals(1);
		});

		test('Instances of Component must be able to reset', () => {
			expect(playerPosition.reset instanceof Function).to.be.true;
			expect(playerPosition.reset.length).equals(1);
		});

		test('Instances of Component must be able to clone itself', () => {
			expect(playerPosition.clone instanceof Function).to.be.true;
		});

		test('Instances of Component must be serializable', () => {
			expect(playerPosition.serialize instanceof Function).to.be.true;
		});
		test('Instances of Component must be de-serializable', () => {
			expect(Position.deserialize instanceof Function).to.be.true;
			expect(Position.deserialize.length).equals(1);
		});
	});

	describe('Instantiation', () => {
		test('Component instantiated with type default', () => {
			const velocitySchema = {
				x: { type: PrimitiveTypes.Number },
				y: { type: PrimitiveTypes.Number },
			};
			class Velocity extends Component {}
			Velocity.setSchema(velocitySchema);
			const playerVelocity = new Velocity();
			expect(playerVelocity.props).to.deep.equals({
				x: PrimitiveTypes.Number.defaultValue,
				y: PrimitiveTypes.Number.defaultValue,
			});
		});

		test('Component instantiated with schema defaults', () => {
			const velocitySchema = {
				x: { type: PrimitiveTypes.Number, defaultValue: 10 },
				y: { type: PrimitiveTypes.Boolean },
				z: { type: PrimitiveTypes.String, defaultValue: 'defaultZ' },
			};
			class Velocity extends Component {}
			Velocity.setSchema(velocitySchema);
			const playerVelocity = new Velocity();
			expect(playerVelocity.props).to.deep.equals({
				x: velocitySchema.x.defaultValue,
				y: PrimitiveTypes.Boolean.defaultValue,
				z: velocitySchema.z.defaultValue,
			});
		});

		test('Components must be instantiated using valid props', () => {
			class Position extends Component {}
			Position.setSchema(positionSchema);
			expect(() => new Position({ x: '4' })).to.throw(InterfaceError, 'attributes are non-compliant with the schema');
		});
	});

	describe('Implementation', () => {
		test('setSchema and getSchema', () => {
			class Position extends Component {}
			expect(() => Position.setSchema(positionSchema)).not.to.throw(Error);
			expect(Position.schema).deep.equals(positionSchema);
		});

		test('update', () => {
			class Position extends Component {}
			Position.setSchema(positionSchema);
			const playerPosition = new Position({ x: 2, y: 2 });

			playerPosition.update({ x: 4, y: 4 });
			expect(playerPosition.props).to.deep.equals({ x: 4, y: 4 });
			playerPosition.update({ x: playerPosition.props.x + 2, y: playerPosition.props.y + 2 });
			expect(playerPosition.props).to.deep.equals({ x: 6, y: 6 });

			expect(() => playerPosition.update({ x: '4', y: '5' })).to.throw(
				InterfaceError,
				'attributes are non-compliant with the schema'
			);
		});

		test('reset', () => {
			class Position extends Component {}
			Position.setSchema(positionSchema);
			const playerPosition = new Position({ x: 2, y: 2 });

			playerPosition.reset({ x: 0, y: 0 });
			expect(playerPosition.props).to.deep.equals({ x: 0, y: 0 });
		});

		test('clone', () => {
			const CustomType = new Type({
				name: 'Custom',
				// eslint-disable-next-line no-unused-vars
				validator: (_) => true,
				clone: (value) => JSON.parse(JSON.stringify(value)),
				defaultValue: { a: { b: { c: 'd' } } },
				serialize: (value) => JSON.stringify(value),
				deserialize: (value) => JSON.parse(value),
			});

			class CustomComponent extends Component {}
			CustomComponent.setSchema({ a: { type: CustomType } });

			const custom = new CustomComponent();
			const customClone = custom.clone();

			expect(customClone.props.a).not.equals(custom.props.a);
			expect(customClone.props.a).deep.equals(custom.props.a);

			custom.update({ a: { a: { b: { c: 'd' } } } });

			expect(customClone.props.a).not.equals(custom.props.a);
			expect(customClone.props.a).deep.equals(custom.props.a);
		});

		test('serialize', () => {
			class Position extends Component {}
			Position.setSchema(positionSchema);
			const playerPosition = new Position({ x: 2, y: 2 });

			expect(playerPosition.serialize()).deep.equals({ x: 2, y: 2 });

			const velocitySchema = {
				x: { type: PrimitiveTypes.Number, serialize: false },
				y: { type: PrimitiveTypes.Number, serialize: true },
				z: { type: PrimitiveTypes.Number, serialize: false },
			};
			class Velocity extends Component {}
			Velocity.setSchema(velocitySchema);
			const velocity = new Velocity({ x: 2, y: 2 });

			expect(velocity.serialize()).deep.equals({ y: 2 });
		});

		test('deserialize', () => {
			const velocitySchema = {
				x: { type: PrimitiveTypes.Number, serialize: false },
				y: { type: PrimitiveTypes.Number, serialize: true },
				z: { type: PrimitiveTypes.Number, serialize: false },
			};
			class Velocity extends Component {}
			Velocity.setSchema(velocitySchema);

			const velocity = new Velocity({ x: 2, y: 2 });
			const deserializedComp = Velocity.deserialize(velocity.serialize());

			expect(deserializedComp).deep.equals(velocity);
			expect(deserializedComp instanceof Velocity).to.be.true;
		});
	});
});
