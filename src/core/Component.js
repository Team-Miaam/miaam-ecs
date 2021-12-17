class Component {
	schema;
	serialize(){
		const serializedValue = {};
		for (attributes in schema) {
			serializedValue.attribute = attributes.type.serialize(attribute);
		}

		return serializedValue;
	}
}

export default Component;
