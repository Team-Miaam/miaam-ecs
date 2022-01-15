import { expect } from "chai"; 
import { describe, test } from "mocha";
import Position from "../../../src/component/Position.component.js"; 
import Component from "../../../src/core/Component.js";
import ComponentPool from "../../../src/core/ComponentPool.js";
import InterfaceError from "../../../src/error/Interface.error.js";




describe("Component Pool", ()=> {

    const position = new Position();
    

    describe('Instantiation', ()=>{
        const positionPool = new ComponentPool(Position, 50);
    });

    describe('Implementation', () => {
        describe('malloc', () => {
            test('malloc returning correct indexes after succesful allocation', () => {
                const positionPool = new ComponentPool(Position, 50);
                expect(positionPool.malloc(position)).to.equals(0);                        
                expect(positionPool.malloc(position)).to.equals(1);                        
                expect(positionPool.malloc(position)).to.equals(2);                        
                expect(positionPool.malloc(position)).to.equals(3);                        
            })       

            test('throwing interface error when the pool is full', () => {
                const positionPool = new ComponentPool(Position, 3);
                expect(() =>{
                positionPool.malloc(position);
                positionPool.malloc(position);
                positionPool.malloc(position);
                positionPool.malloc(position);
                }).to.throw(InterfaceError, 'Poolsize reached limits');
            })
        })
        describe('free', () => {
            test('removing a component from component pool', () => {
                const positionPool = new ComponentPool(Position, 3);
                positionPool.malloc(position);
                positionPool.malloc(position);
                positionPool.malloc(position);
                expect(positionPool.totalUsed).to.equals(3);
                positionPool.free(1);
                expect(positionPool.totalFree).to.equals(1);
                positionPool.free(2);
                expect(positionPool.totalFree).to.equals(2);
            })
        })
    });

});
