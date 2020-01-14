module.exports = function parseStringAsArray(arrayAsStrign){
    return arrayAsStrign.split(',').map((array) => array.trim());
}