import { checkSchemaProps, isValidSchema } from './utility/Schema.js';

import IllegalArgumentException from './exceptions/IllegalArgumentException.js';
import InterfaceException from './exceptions/InterfaceException.js';

/**
 * Abstract base class Component provides solid foundation for other component types to extend.
 *
 * @since 0.0.1
 * @public
 * @abstract
 * @class
 */
class Component {
	/**
	 * Schema of the component
	 *
	 * @see setSchema
	 * @see getSchema
	 *
	 * @deprecated
	 * Do not manually access or set the schema directly,
	 * even if you know what you are doing!
	 * <br>
	 * This library is intended and designed to be used using only accessible methods.
	 * Because of restrictions of private static variable of JS, schema is exposed.
	 * <br>
	 * Do not take the advantage of this always use {@link setSchema} and {@link getSchema} methods.
	 *
	 * @since 0.0.1
	 * @static
	 * @readonly
	 * @type {Object}
	 */
	static schema;

	/**
	 * Properties of the component
	 *
	 * @since 0.0.1
	 * @private
	 * @type {Object}
	 */
	#props;

	/* ================================ CONSTRUCTORS ================================ */

	/**
	 * Instantiates a component object from passed down properties
	 *
	 * @since 0.0.1
	 * @public
	 * @constructor
	 * @param {Object} componentProps - properties of the component,
	 * all keys must be pre-specified in the component schema.
	 */
	constructor(componentProps) {
		if (process.env.NODE_ENV !== 'production') {
			if (this.constructor === Component) {
				throw new InterfaceException('Cannot instantiate component class. Component class is abstract.');
			}
			const schema = this.constructor.getSchema();
			if (!schema) {
				throw new InterfaceException(
					'Cannot instantiate component. Class schema is undefined. ' +
						'Please consider setting valid schema before instantiating component.'
				);
			}
		}

		this.reset(componentProps);
	}

	/* ================================ LIFECYCLE METHODS ================================ */

	/**
	 * Pre-init method gets executed just before a component is initialized.
	 * <br>
	 * This function runs before any of the properties of the component is initialized
	 * when the component is instantiated or reset.
	 *
	 * @since 0.0.1
	 * @public
	 */
	// eslint-disable-next-line class-methods-use-this
	preInit() {}

	/**
	 * Init method gets executed after the component is initialized
	 */
	// eslint-disable-next-line class-methods-use-this
	init() {}

	/**
	 * Method to mark Component as updated
	 */
	update(props) {
		// non production mode error for props with invalid schema
		if (process.env.NODE_ENV !== 'production') {
			checkSchemaProps(this.constructor.getSchema(), props);
		}

		Object.keys(props).forEach((key) => {
			this.#props[key] = props[key];
		});
	}

	/**
	 * Pre-destroy method gets executed just before a component gets destroyed
	 */
	// eslint-disable-next-line class-methods-use-this
	preDestroy() {}

	/**
	 * Post-destory method gets executed after the component is destroyed
	 */
	// eslint-disable-next-line class-methods-use-this
	postDestory() {}

	/**
	 * Destorys the component
	 */
	// eslint-disable-next-line class-methods-use-this
	destroy() {}

	/**
	 * Resets a component object from passed down properties using life cycle methods.
	 *
	 * @since 0.0.1
	 * @public
	 * @param {Object} componentProps - properties of the component,
	 * all keys must be pre-specified in the component schema.
	 */
	reset(componentProps) {
		const props = componentProps || {};
		const schema = this.constructor.getSchema();

		if (process.env.NODE_ENV !== 'production') {
			checkSchemaProps(schema, props);
		}

		// executing pre instantiation operations
		this.preInit();

		// getting defaults from pre-defined schema
		this.#props = {};
		Object.keys(schema).forEach((key) => {
			if (Object.prototype.hasOwnProperty.call(props, key)) {
				// creating identified schema defined properties from props
				this.#props[key] = props[key];
			} else if (Object.prototype.hasOwnProperty.call(schema[key], 'defaultValue')) {
				// creating identified schema defined properties from schema defaults
				this.#props[key] = schema[key].defaultValue;
			} else {
				// creating identified schema defined properties from type defaults
				this.#props[key] = schema[key].type.getDefaultValue();
			}
		});

		// executing post instantiation operations
		this.init();
	}

	/* ================================ GETTERS ================================ */

	/**
	 * Getter method for schema of the class
	 *
	 * @since 0.0.1
	 * @public
	 * @static
	 * @returns {Object} schema of the class
	 */
	static getSchema() {
		return this.schema;
	}

	/**
	 * Getter method for properties
	 *
	 * @warning
	 * it is possible to manually change the props,
	 * but it is not desirable even when you know what you are doing!
	 * It may create inconsistency issues.
	 * Immutability constraint is not enforced because,
	 * it is costly from the point of view of performance.
	 *
	 * @since 0.0.1
	 * @public
	 * @returns {Object}
	 */
	getProps() {
		return this.#props;
	}

	/* ================================ SETTERS ================================ */

	/**
	 * Defines the schema of the component class
	 *
	 * @warning
	 * Component schema is theoretically constant
	 * i.e. you can set the schema of a component only once.
	 *
	 * @since 0.0.1
	 * @public
	 * @static
	 * @param {object} schema schema of the this component class
	 * @throws {InterfaceException} when setSchema is called directly from Component class
	 * or setSchema is called when there is a already a valid schema present
	 * @throws {IllegalArgumentException} when the schema is invalid
	 */
	static setSchema(schema) {
		if (process.env.NODE_ENV !== 'production') {
			if (this === Component) {
				throw new InterfaceException('Cannot set schema. Component class is abstract');
			} else if (this.schema) {
				throw new InterfaceException('Cannot set schema. Component schema can be set only once.');
			} else if (!isValidSchema(schema)) {
				throw new IllegalArgumentException('Cannot set schema. Provided schema is invalid.');
			}
		}

		this.schema = schema;
	}

	/* ================================ UTILITY ================================ */

	/**
	 * Clone i.e. deep copies the current component
	 *
	 * @since 0.0.1
	 * @public
	 * @returns {Component} cloned version of current component
	 */
	clone() {
		const schema = this.constructor.getSchema();
		const props = this.getProps();

		const clonedProps = {};
		Object.keys(schema).forEach((key) => {
			clonedProps[key] = schema[key].type.clone(props[key]);
		});

		const clonedComponent = new this.constructor(clonedProps);
		return clonedComponent;
	}
}

export default Component;
