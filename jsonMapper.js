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
                        currentElement[prop] = { type: [`object-${type}`], fields: mapProps(value) };
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
            // we do this to  aggregate all types together. For instance, ['array'] and ['empty-array'] become ['array', 'empty-array']
            if (lodash.isArray(objectValue) || lodash.isSet(objectValue)) {
                let mergedSet = new Set([...objectValue, ...sourceValue]);
                // it prints nicer!
                return [...mergedSet];
            }
        });
    });

    return result;
}

module.exports.mapProps = mapProps;