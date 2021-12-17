
class Player extends Entity {

	@Serialize
	Position position;

	Sprite sprite;

	Physics body;

	@Serialize
	CustomComp com;
}

Player.serialize()