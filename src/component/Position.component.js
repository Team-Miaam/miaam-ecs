import Component from '../core/Component.js';
import { Number } from '../type/PrimitiveTypes.js';

const positionSchema = {
	x: { type: Number },
	y: { type: Number },
};

class Position extends Component {}
Position.setSchema(positionSchema);

export default Position;
