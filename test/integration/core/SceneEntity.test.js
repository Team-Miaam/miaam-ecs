import { expect } from 'chai';
import { describe, Test, test } from 'mocha';
import Scene from '../../../src/core/Scene.js';
import Entity from '../../../src/core/Entity.js';
import InterfaceError from '../../../src/error/Interface.error.js';

describe('Scene Entity', () => {
	class TestScene extends Scene {}
	const mainScene = new TestScene();
});
