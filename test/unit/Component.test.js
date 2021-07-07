/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */
import { expect } from 'chai';
import { describe, test } from 'mocha';
import Component from '../../src/Component.js';
import InterfaceException from '../../src/exceptions/InterfaceException.js';
import PrimitiveTypes from '../../src/constants/types/PrimitiveTypes.js';
import IllegalArgumentException from '../../src/exceptions/IllegalArgumentException.js';
import Type from '../../src/Type.js';

describe('Component', () => {
	const positionSchema = {
		x: { type: PrimitiveTypes.Number },
		y: { type: PrimitiveTypes.Number },
	};

	describe('Abstraction', () => {
		test('Component class is abstract', () => {
			expect(() => {
				new Component();
			}).to.throw(InterfaceException, 'Component class is abstract');
		});

		test('setSchema cannot be called on Component class', () => {
			expect(() => {
				Component.setSchema(positionSchema);
			}).to.throw(InterfaceException, 'Component class is abstract');
		});
	});

	describe('Schema Validation Requirement', () => {
		test('Components cannot be instantiated without setting valid schema', () => {
			class ComponentA extends Component {}
			expect(() => new ComponentA()).to.throw(InterfaceException, 'schema is undefined');
		});

		test('Component setSchema implements isValidSchema', () => {
			class ComponentA extends Component {}
			expect(() => ComponentA.setSchema({})).to.throw(IllegalArgumentException, 'schema is invalid');
			expect(() => ComponentA.setSchema({ x: 'int', y: 'int' })).to.throw(
				IllegalArgumentException,
				'schema is invalid'
			);
		});

		test('Different schema of two different components are different', () => {
			class ComponentA extends Component {}
			class ComponentB extends Component {}

			ComponentA.setSchema({ x: { type: PrimitiveTypes.Number } });
			ComponentB.setSchema({ name: { type: PrimitiveTypes.String } });
			expect(ComponentA.getSchema()).to.not.equals(ComponentB.getSchema());
		});
	});

	describe('Interface', () => {
		class Position extends Component {}

		test('Class must have static setSchema method', () => {
			expect(Position.setSchema instanceof Function).to.be.true;
		});

		test('Class must have static getSchema method', () => {
			expect(Position.getSchema instanceof Function).to.be.true;
		});

		Position.setSchema(positionSchema);
		const playerPosition = new Position();
		test('Instances of Component must have access to props', () => {
			expect(playerPosition.getProps instanceof Function).to.be.true;
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
			expect(playerVelocity.getProps()).to.deep.equals({
				x: PrimitiveTypes.Number.getDefaultValue(),
				y: PrimitiveTypes.Number.getDefaultValue(),
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
			expect(playerVelocity.getProps()).to.deep.equals({
				x: velocitySchema.x.defaultValue,
				y: PrimitiveTypes.Boolean.getDefaultValue(),
				z: velocitySchema.z.defaultValue,
			});
		});

		test('Components must be instantiated using valid props', () => {
			class Position extends Component {}
			Position.setSchema(positionSchema);
			expect(() => new Position({ x: '4' })).to.throw(
				InterfaceException,
				'attributes are non-compliant with the schema'
			);
		});
	});

	describe('Implementation', () => {
		test('setSchema and getSchema', () => {
			class Position extends Component {}
			expect(() => Position.setSchema(positionSchema)).not.to.throw(Error);
			expect(Position.getSchema()).deep.equals(positionSchema);
		});

		test('update', () => {
			class Position extends Component {}
			Position.setSchema(positionSchema);
			const playerPosition = new Position({ x: 2, y: 2 });

			playerPosition.update({ x: 4, y: 4 });
			expect(playerPosition.getProps()).to.deep.equals({ x: 4, y: 4 });
			playerPosition.update({ x: playerPosition.getProps().x + 2, y: playerPosition.getProps().y + 2 });
			expect(playerPosition.getProps()).to.deep.equals({ x: 6, y: 6 });

			expect(() => playerPosition.update({ x: '4', y: '5' })).to.throw(
				InterfaceException,
				'attributes are non-compliant with the schema'
			);
		});

		test('reset', () => {
			class Position extends Component {
				init() {
					this.update({ x: this.getProps().x + 2, y: this.getProps().y + 2 });
				}
			}
			Position.setSchema(positionSchema);
			const playerPosition = new Position({ x: 2, y: 2 });

			expect(playerPosition.getProps()).to.deep.equals({ x: 4, y: 4 });
			playerPosition.reset({ x: 0, y: 0 });
			expect(playerPosition.getProps()).to.deep.equals({ x: 2, y: 2 });
		});

		test('clone', () => {
			const CustomType = new Type(
				'Custom',
				// eslint-disable-next-line no-unused-vars
				(_) => true,
				(value) => JSON.parse(JSON.stringify(value)),
				{ a: { b: { c: 'd' } } }
			);

			class CustomComponent extends Component {}
			CustomComponent.setSchema({ a: { type: CustomType } });

			const custom = new CustomComponent();
			const customClone = custom.clone();

			expect(customClone.getProps().a).not.equals(custom.getProps().a);
			expect(customClone.getProps().a).deep.equals(custom.getProps().a);

			custom.update({ a: { a: { b: { c: 'd' } } } });

			expect(customClone.getProps().a).not.equals(custom.getProps().a);
			expect(customClone.getProps().a).deep.equals(custom.getProps().a);
		});
	});
});
