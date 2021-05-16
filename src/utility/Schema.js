export class SchemaNotFoundException extends Error {}
export const checkInvalidSchemaAttributes = (schema, props) => {
	Object.keys(props).forEach((key) => {
		if (!Object.prototype.hasOwnProperty.call(schema, key)) {
			throw new SchemaNotFoundException(
				`Trying to set attribute '${key}' not defined in the '${schema}' schema. 
				Please fix the schema, the attribute value won't be set`
			);
		}
	});
};
