const lodash = require('lodash');

function mapProps(json) {
    let result = {};

    json.forEach(element => {
        const currentElement = {};

        for (const prop in element) {
            const value = element[prop];
            let type = value != null ? typeof value : 'null';

            if (lodash.isArray(value)) {
                let firstElement = lodash.first(value);
                type = 'array';
                
                if (firstElement) {
                    if (!lodash.isObject(firstElement)) {
                        // Mapping primitive types
                        type = `${typeof firstElement}-${type}`;
                        currentElement[prop] = { type: [type] };
                    } else {
                        // Mapping objects
                        currentElement[prop] = { type: [type], fields: mapProps(value) };
                    }
                } else {
                    // Mapping empty arrays
                    currentElement[prop] = { type: [`empty-${type}`] };
                }
            } else if (lodash.isObject(value)) {
                currentElement[prop] = { type: [type], fields: mapProps([value]) };
            } else {
                currentElement[prop] = { type: [type] };
            }
        }

        result = lodash.mergeWith(result, currentElement, (objectValue, sourceValue) => {
            if (lodash.isArray(objectValue) || lodash.isSet(objectValue)) {
                return new Set([...objectValue, ...sourceValue]);
            }
        });
    });

    return result;
}

module.exports.mapProps = mapProps;