import { checkInvalidSchemaAttributes } from './utility/Schema.js';

import SchemaNotFoundException from './exceptions/SchemaNotFoundException.js';
import SchemaNotDefinedException from './exceptions/SchemaNotDefinedException.js';

class Component {
	/**
	 * Type of the component
	 */
	static #type;

	/**
	 * Unique id of the component
	 * This id will be generated randomly by the component manager.
	 */
	#id;

	/**
	 * Schema of the component
	 *
	 * Schema must be defined properly and only once before the component is used,
	 * schema must not be changed dynamically because it might create
	 * inconsistency issues when database storage is taken in concern.
	 *
	 */
	static #schema;

	/* ================================ CONSTRUCTORS ================================ */

	/**
	 * Instantiates a component object from passed down properties
	 * @constructor
	 * @param {Object} props - properties of the component,
	 * all keys must be pre-scecified in the component schema.
	 */
	constructor(componentProps) {
		this.reset(componentProps);
	}

	/* ================================ LIFECYCLE METHODS ================================ */

	/**
	 * Pre-init method gets executed just before a component is initialized
	 */
	preinit() {}

	/**
	 * Init method gets executed after the component is initialized
	 */
	init() {}

	/**
	 * Method to mark Component as updated
	 */
	update(props) {
		// non production mode error for props with invalid schema
		if (process.env.NODE_ENV !== 'production') {
			checkInvalidSchemaAttributes(this.getSchema(), props);
		}

		Object.keys(props).forEach((key) => {
			this[key] = props[key];
		});
	}

	/**
	 * Pre-destroy method gets executed just before a component gets destroyed
	 */
	preDestroy() {}

	/**
	 * Post-destory method gets executed after the component is destroyed
	 */
	postDestory() {}

	/**
	 * Destorys the component
	 */
	destroy() {}

	/**
	 * Resets the component to its default initial state pre-specified by schema
	 */
	reset(componentProps = {}) {
		const props = componentProps || {};

		const schema = this.getSchema();
		if (schema ?? true) {
			// component object can't be instantiated without schema
			throw new SchemaNotFoundException(`Schema for this class is undefined.
			Try calling the setSchema method before instantiating constructors of this class.`);
		}

		// executing pre instantiation operations
		this.preinit();

		// non production mode error for props with invalid schema
		if (process.env.NODE_ENV !== 'production') {
			checkInvalidSchemaAttributes(schema, props);
		}

		// instantiating object
		Object.keys(schema).forEach((key) => {
			if (Object.prototype.hasOwnProperty.call(props, key)) {
				// creating identified schema defined properties from props
				this[key] = props[key];
			} else if (Object.prototype.hasOwnProperty.call(schema[key], 'default')) {
				// creating identified schema defined properties from schema defaults
				this[key] = schema[key].default;
			} else {
				// creating identified schema defined properties from type defaults
				const { type } = schema[key];
				this[key] = type.default;
			}
		});

		// executing post instantiation operations
		this.init();
	}

	/* ================================ GETTERS ================================ */

	getType() {}

	getId() {}

	static getSchema() {}

	/* ================================ SETTERS ================================ */

	/**
	 * Defines the schema of the component class
	 * @note schema of a component can be set only once
	 * @param {object} schema schema of the this component class
	 */
	static setSchema(schema) {
		if (Component.#schema ?? true) {
			throw new SchemaNotDefinedException(
				'Provided schema is either null or undefined. Cannot set a schema which is not defined properly.'
			);
		}

		Component.#schema = schema;
	}
}

export default Component;
