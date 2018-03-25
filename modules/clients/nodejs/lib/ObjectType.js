/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const ArgumentChecker = require('./internal/ArgumentChecker');

/**
 * Supported type codes.
 * @typedef ObjectType.TYPE_CODE
 * @enum
 * @readonly
 * @property BYTE 1
 * @property SHORT 2
 * @property INTEGER 3
 * @property LONG 4
 * @property FLOAT 5
 * @property DOUBLE 6
 * @property CHAR 7
 * @property BOOLEAN 8
 * @property STRING 9
 * @property DATE 11
 * @property BYTE_ARRAY 12
 * @property SHORT_ARRAY 13
 * @property INTEGER_ARRAY 14
 * @property LONG_ARRAY 15
 * @property FLOAT_ARRAY 16
 * @property DOUBLE_ARRAY 17
 * @property CHAR_ARRAY 18
 * @property BOOLEAN_ARRAY 19
 * @property STRING_ARRAY 20
 * @property DATE_ARRAY 22
 * @property MAP 25
 * @property NULL 101
 */
const TYPE_CODE = Object.freeze({
    BYTE : 1,
    SHORT : 2,
    INTEGER : 3,
    LONG : 4,
    FLOAT : 5,
    DOUBLE : 6,
    CHAR : 7,
    BOOLEAN : 8,
    STRING : 9,
    DATE : 11,
    BYTE_ARRAY : 12,
    SHORT_ARRAY : 13,
    INTEGER_ARRAY : 14,
    LONG_ARRAY : 15,
    FLOAT_ARRAY : 16,
    DOUBLE_ARRAY : 17,
    CHAR_ARRAY : 18,
    BOOLEAN_ARRAY : 19,
    STRING_ARRAY : 20,
    DATE_ARRAY : 22,
    MAP : 25,
    NULL : 101,
    /* more types to be added... */
});

/**
 * Supported kinds of map.
 * @typedef ObjectType.MAP_SUBTYPE
 * @enum
 * @readonly
 * @property HASH_MAP 1
 * @property LINKED_HASH_MAP 2
 */
const MAP_SUBTYPE = Object.freeze({
    HASH_MAP : 1,
    LINKED_HASH_MAP : 2
});

/**
 * Class representing a type of object.
 *
 * Every type has mandatory type code {@link ObjectType.TYPE_CODE}.
 * Some of the types requires subtypes (eg. kind of map or kind of collection) which have defaults.
 *
 * This class helps the Ignite client to make a mapping between JavaScript types
 * and types used by Ignite.
 *
 * In many methods the Ignite client does not require to directly specify an object type.
 * In this case the Ignite client does automatical mapping between some of the JavaScript types
 * and object types - according to the following mapping table:
 * <pre>
 *      JavaScript type         : type code ({@link ObjectType.TYPE_CODE})
 *      null                    : NULL
 *      number                  : DOUBLE
 *      string                  : STRING
 *      boolean                 : BOOLEAN
 *      Date                    : DATE
 *      Map                     : MAP (HASH_MAP)
 *      Array of number         : DOUBLE_ARRAY
 *      Array of string         : STRING_ARRAY
 *      Array of boolean        : BOOLEAN_ARRAY
 *      Array of Date           : DATE_ARRAY
 * </pre>
 * Note: type of an array content is determined by the type of the first element of the array
 * (empty array has no automatical mapping).
 *
 * All other JavaScript types have no automatical mapping.
 */
class ObjectType {

    /**
     * Creates an instance of object type for the specified type code.
     *
     * @param {integer} typeCode - type code, one of the {@link ObjectType.TYPE_CODE} constants.
     *
     * @return {ObjectType} - new object type instance.
     *
     * @throws {UnsupportedTypeError} if the provided type code is null or not supported.
     * @throws {IgniteClientError} if other error.
     */
    constructor(typeCode) {
        this._typeCode = typeCode;
        this._init();
    }

    /**
     * Specifies a kind of map.
     * Optionally specifies types of keys and/or values in the map.
     *
     * If key and/or value type is not specified then during operations the Ignite client
     * will do automatic mapping between some of the JavaScript types and object types -
     * according to the mapping table defined in the description of the {@link ObjectType} class.
     * 
     * By default: HASH_MAP
     *
     * @param {integer} mapSubType - map subtype, one of the {@link ObjectType.MAP_SUBTYPE} constants.
     * @param {ObjectType | integer} [mapKeyType=null] - type of the keys in the map:
     *   - either an instance of object type
     *   - or a type code (means object type with this type code and with default subtype, if applicable)
     *   - or null or not specified (means the type is not specified)
     * @param {ObjectType | integer} [mapValueType=null] - type of the values in the map:
     *   - either an instance of object type
     *   - or a type code (means object type with this type code and with default subtype, if applicable)
     *   - or null or not specified (means the type is not specified)
     *
     * @return {ObjectType} - the same instance of the object type.
     *
     * @throws {IllegalArgumentError} if this object type is not a map.
     * @throws {UnsupportedTypeError} if the provided subtype is null or not supported.
     * @throws {IgniteClientError} if other error.
     */
    setMapSubType(mapSubType, mapKeyType = null, mapValueType = null) {
        if (this._typeCode === ObjectType.TYPE_CODE.MAP) {
            const BinaryUtils = require('./internal/BinaryUtils');
            ArgumentChecker.hasValueFrom(mapSubType, 'mapSubType', ObjectType.MAP_SUBTYPE);
            this._mapSubType = mapSubType;
            this._mapKeyType = BinaryUtils.getObjectType(mapKeyType);
            this._mapValueType = BinaryUtils.getObjectType(mapValueType);
            if (this._mapKeyType) {
                ArgumentChecker.hasValueFrom(this._mapKeyType.typeCode, 'mapKeyType', ObjectType.TYPE_CODE);
            }
            if (this._mapValueType) {
                ArgumentChecker.hasValueFrom(this._mapValueType.typeCode, 'mapValueType', ObjectType.TYPE_CODE);
            }
        }
        else {
            throw new Errors.IllegalArgumentError('setMapSubType() is called not for a map');
        }
        return this;
    }

    static get TYPE_CODE() {
        return TYPE_CODE;
    }

    static get MAP_SUBTYPE() {
        return MAP_SUBTYPE;
    }

    get typeCode() {
        return this._typeCode;
    }

    get mapSubType() {
        return this._mapSubType;
    }

    get mapKeyType() {
        return this._mapKeyType;
    }

    get mapValueType() {
        return this._mapValueType;
    }

    _init() {
        switch (this._typeCode) {
            case ObjectType.TYPE_CODE.MAP:
                this._mapSubType = ObjectType.MAP_SUBTYPE.HASH_MAP;
                break;
        }
    }
}

module.exports = ObjectType;
