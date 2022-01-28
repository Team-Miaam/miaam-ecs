import Component from '../../../src/core/Component.js';
import { Number } from '../../../src/type/PrimitiveTypes.js';

const positionSchema = {
	x: { type: Number },
	y: { type: Number },
};

class Position extends Component {}
Position.setSchema(positionSchema);

export default Position;
