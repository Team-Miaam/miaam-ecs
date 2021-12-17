class Entity {
	serialize() {
		Find out all the Serializable components in entity
		for (component in components) {
			component.serialize();
		}
	}
}